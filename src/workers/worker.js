import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { Check } from '../modules/checks/check.model.js';
import { runHeartbeat } from './heartbeat.js';

const POLL_INTERVAL = 5000;

const shouldRunCheck = (check)=>{
        if(!check.lastCheckedAt) return true;

        const now = Date.now();
        const lastRun = new Date(check.lastCheckedAt).getTime();

        return now - lastRun >=check.interval * 1000;
};

const runWorker = async()=>{
    await connectDB(env.MONGO_URI);
    console.log("Worker connected to DB");

    setInterval(async()=>{
        try {
            const checks = await Check.find({isActive: true});

            for(const check of checks){
                if(!shouldRunCheck(check)) continue;

                await runHeartbeat(check);

                check.lastCheckedAt = new Date();
                await check.save();
            }
        } catch (error) {
                console.error('Worker error:', error.message);
        }
    }, POLL_INTERVAL);
};

runWorker();
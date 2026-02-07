import mongoose from "mongoose";
import { Tenant } from "../modules/tenants/tenant.model.js";

const seed = async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/sentinelstack');

        const tenant = await Tenant.create({
            name:'Company A',
            slug:'company a'
        });
        
        console.log("Tenant created:", tenant);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
import { Check } from './check.model.js';
import { CheckResult } from '../results/checkResult.model.js';
import { Incident } from '../incidents/incident.model.js';
import { Service } from '../services/service.model.js';

const executeCheck = async (check) => {
    const start = Date.now();
    let status = 'down';
    let errorMsg = '';
    let statusCode = 0;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), check.timeout || 5000);

        const response = await fetch(check.url, {
            method: check.method || 'GET',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        statusCode = response.status;
        status = response.ok ? 'up' : 'down';
        if (!response.ok) errorMsg = `HTTP ${response.status} Error`;

    } catch (error) {
        status = 'down';
        errorMsg = error.name === 'AbortError' ? 'Timeout' : error.message;
    } finally {
        const responseTime = Date.now() - start;

        await CheckResult.create({
            checkId: check._id,
            status,
            responseTime,
            statusCode,
            error: errorMsg,
        });

        // INCIDENT LOGIC
        try {
            if (status === 'up') {
               
                await Incident.updateMany(
                    { serviceId: check.serviceId, status: 'active' },
                    { status: 'resolved', resolvedAt: new Date() }
                );
            } else {
                
                const existingIncident = await Incident.findOne({
                    serviceId: check.serviceId,
                    status: 'active'
                });

                if (!existingIncident) {
                   
                    const service = await Service.findById(check.serviceId);
                    if (service) {
                        await Incident.create({
                            serviceId: service._id,
                            tenantId: service.tenantId,
                            serviceName: service.name,
                            error: errorMsg,
                            status: 'active'
                        });
                        console.log(`⚠️ Incident opened for ${service.name}`);
                    }
                }
            }
        } catch (incError) {
            console.error('Failed to process incident logic:', incError);
        }

        check.lastCheckedAt = new Date();
        await check.save();
    }
};


export const startCheckRunner = () => {
    console.log('🚀 Health Check Runner initialized');

    // Run every 60 seconds
    setInterval(async () => {
        try {
            const activeChecks = await Check.find({ isActive: true });

            if (activeChecks.length === 0) return;

            console.log(`📡 Running health checks for ${activeChecks.length} services...`);

            // Run checks in parallel
            await Promise.all(activeChecks.map(check => executeCheck(check)));

        } catch (error) {
            console.error('❌ Error in check runner loop:', error);
        }
    }, 60000);
};

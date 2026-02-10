import { Check } from './check.model.js';
import { CheckResult } from '../results/checkResult.model.js';

/**
 * Execute a single health check
 */
const executeCheck = async (check) => {
    const start = Date.now();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), check.timeout || 5000);

        const response = await fetch(check.url, {
            method: check.method || 'GET',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - start;

        await CheckResult.create({
            checkId: check._id,
            status: response.ok ? 'up' : 'down',
            responseTime,
            statusCode: response.status,
        });

    } catch (error) {
        const responseTime = Date.now() - start;
        await CheckResult.create({
            checkId: check._id,
            status: 'down',
            responseTime,
            error: error.name === 'AbortError' ? 'Timeout' : error.message,
        });
    } finally {
        check.lastCheckedAt = new Date();
        await check.save();
    }
};

/**
 * Main runner loop
 */
export const startCheckRunner = () => {
    console.log('🚀 Health Check Runner initialized');

    // Run every 60 seconds
    setInterval(async () => {
        try {
            const activeChecks = await Check.find({ isActive: true });

            if (activeChecks.length === 0) return;

            console.log(`📡 Running health checks for ${activeChecks.length} services...`);

            // Run checks in parallel with a small delay between batches if needed, 
            // but for now simple Promise.all is fine for a SaaS starter.
            await Promise.all(activeChecks.map(check => executeCheck(check)));

        } catch (error) {
            console.error('❌ Error in check runner loop:', error);
        }
    }, 60000);
};

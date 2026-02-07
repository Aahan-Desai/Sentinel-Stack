import { Check } from '../checks/check.model.js';
import { CheckResult } from '../results/checkResult.model.js';

export const getServiceStatus = async (serviceId) => {
  const checks = await Check.find({
    serviceId,
    isActive: true
  });

  if (checks.length === 0) {
    return {
      status: 'unknown',
      uptime: null
    };
  }

  const checkIds = checks.map(c => c._id);

  // last 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const results = await CheckResult.find({
    checkId: { $in: checkIds },
    checkedAt: { $gte: since }
  });

  if (results.length === 0) {
    return {
      status: 'unknown',
      uptime: null
    };
  }

  const total = results.length;
  const upCount = results.filter(r => r.status === 'up').length;

  const uptime = (upCount / total) * 100;

  const isDown = results.some(r => r.status === 'down');

  return {
    status: isDown ? 'down' : 'up',
    uptime: Number(uptime.toFixed(2))
  };
};

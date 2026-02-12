import { Service } from './service.model.js';
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

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const results = await CheckResult.find({
    checkId: { $in: checkIds },
    checkedAt: { $gte: since }
  }).sort({ checkedAt: -1 });

  if (results.length === 0) {
    return {
      status: 'unknown',
      uptime: null
    };
  }

  const total = results.length;
  const upCount = results.filter(r => r.status === 'up').length;

  const uptime = (upCount / total) * 100;

  const latestStatus = results[0].status;

  return {
    status: latestStatus === 'up' ? 'up' : 'down',
    uptime: Number(uptime.toFixed(2))
  };
};

export const getBatchServiceStatus = async (serviceIds) => {
  const checks = await Check.find({
    serviceId: { $in: serviceIds },
    isActive: true
  });

  const checkToService = {};
  checks.forEach(c => {
    checkToService[c._id.toString()] = c.serviceId.toString();
  });

  const checkIds = checks.map(c => c._id);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const results = await CheckResult.find({
    checkId: { $in: checkIds },
    checkedAt: { $gte: since }
  }).sort({ checkedAt: -1 });

  const statusMap = {};
  serviceIds.forEach(id => {
    statusMap[id.toString()] = { status: 'unknown', uptime: null };
  });

  const serviceResults = {};
  results.forEach(r => {
    const sId = checkToService[r.checkId.toString()];
    if (!serviceResults[sId]) serviceResults[sId] = [];
    serviceResults[sId].push(r);
  });

  Object.keys(serviceResults).forEach(sId => {
    const res = serviceResults[sId];
    const total = res.length;
    const upCount = res.filter(r => r.status === 'up').length;
    const uptime = (upCount / total) * 100;
    const latestStatus = res[0].status;

    statusMap[sId] = {
      status: latestStatus === 'up' ? 'up' : 'down',
      uptime: Number(uptime.toFixed(2))
    };
  });

  return statusMap;
};

export const getGlobalStats = async (tenantId) => {
  const services = await Service.find({ tenantId });
  const serviceIds = services.map(s => s._id);

  if (serviceIds.length === 0) return { globalUptime: 0, avgLatency: 0 };

  const checks = await Check.find({ serviceId: { $in: serviceIds } });
  const checkIds = checks.map(c => c._id);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stats = await CheckResult.aggregate([
    { $match: { checkId: { $in: checkIds }, checkedAt: { $gte: since } } },
    {
      $group: {
        _id: null,
        avgLatency: { $avg: "$responseTime" },
        total: { $sum: 1 },
        up: { $sum: { $cond: [{ $eq: ["$status", "up"] }, 1, 0] } }
      }
    }
  ]);

  if (stats.length === 0) return { globalUptime: 0, avgLatency: 0 };

  return {
    globalUptime: Number(((stats[0].up / stats[0].total) * 100).toFixed(2)),
    avgLatency: Math.round(stats[0].avgLatency)
  };
};

import { Service } from './service.model.js';
import { getServiceStatus } from './service.status.service.js';
import { ApiError } from '../../shared/errors/ApiError.js';

export const getServiceStatusHandler = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const tenantId = req.user.tenantId;

    const service = await Service.findOne({
      _id: serviceId,
      tenantId
    });

    if (!service) {
      return res.status(404).json({
        message: 'Service not found'
      });
    }

    const status = await getServiceStatus(serviceId);

    res.json({
      serviceId,
      ...status
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get service status'
    });
  }
};


export const createService = async (req, res) => {
  const { name, description } = req.body;
  const tenantId = req.user.tenantId;

  if (!name) {
    throw new ApiError(400, 'Service name is required');
  }

  const service = await Service.create({
    tenantId,
    name,
    description
  });

  res.status(201).json({ service });
};

export const listServices = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const services = await Service.find({
      tenantId,
      isActive: true
    });

    res.json({ services });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch services'
    });
  }
};

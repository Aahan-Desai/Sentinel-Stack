import { Service } from './service.model.js';
import { getServiceStatus } from './service.status.service.js';
import { ApiError } from '../../shared/errors/ApiError.js';
import { createService as createServiceLogic } from "./service.service.js";


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

export const createService = async (req, res, next) => {
  try {
    const { name, url } = req.body;

    const service = await createServiceLogic({
      tenantId: req.user.tenantId,
      name,
      url,
    });

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
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

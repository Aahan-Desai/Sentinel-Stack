import { Service } from './service.model.js';
import { getServiceStatus } from './service.status.service.js';
import { ApiError } from '../../shared/errors/ApiError.js';
import {
  createService as createServiceLogic,
  listServices as listServicesLogic,
  getServiceById as getServiceByIdLogic,
  getServiceHistory as getServiceHistoryLogic
} from "./service.service.js";

// ... (skipping down to the bottom of the file)

/**
 * GET SERVICE HISTORY
 */
export const getServiceHistoryHandler = async (req, res, next) => {
  try {
    const history = await getServiceHistoryLogic({
      serviceId: req.params.serviceId,
      tenantId: req.user.tenantId,
    });

    res.json(history);
  } catch (error) {
    next(error);
  }
};

// ... (existing code omitted for brevity)

/**
 * GET SERVICE BY ID
 */
export const getServiceByIdController = async (req, res, next) => {
  try {
    const service = await getServiceByIdLogic({
      serviceId: req.params.serviceId,
      tenantId: req.user.tenantId,
    });

    res.json(service);
  } catch (error) {
    next(error);
  }
};

export const listServicesController = async (req, res, next) => {
  try {
    const result = await listServicesLogic({
      tenantId: req.user.tenantId,
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 20),
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};


/**
 * GET SERVICE STATUS
 */
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

/**
 * CREATE SERVICE
 */
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

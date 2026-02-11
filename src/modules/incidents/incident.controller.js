import { Incident } from './incident.model.js';

export const listIncidentsController = async (req, res, next) => {
    try {
        const incidents = await Incident.find({ tenantId: req.user.tenantId })
            .sort({ startedAt: -1 })
            .limit(50);

        res.json(incidents);
    } catch (error) {
        next(error);
    }
};

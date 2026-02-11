import express from 'express';
import { listIncidentsController } from './incident.controller.js';
import { authMiddleware } from '../../shared/middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', listIncidentsController);

export default router;

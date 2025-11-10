import { Router } from 'express';

import { CreateUserGameLogController } from '../controllers/logs/CreateUserGameLogController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const logsRoutes = Router();

const createUserGameLogController = new CreateUserGameLogController();

logsRoutes.post('/', ensureAuthenticated, createUserGameLogController.handle);

export { logsRoutes };
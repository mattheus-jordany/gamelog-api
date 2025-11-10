import { Router } from 'express';

import { CreateUserGameLogController } from '../controllers/logs/CreateUserGameLogController.js';
import { ListUserGameLogsController } from '../controllers/logs/ListUserGameLogsController.js';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const logsRoutes = Router();

const createUserGameLogController = new CreateUserGameLogController();
const listUserGameLogsController = new ListUserGameLogsController();

logsRoutes.post('/', ensureAuthenticated, createUserGameLogController.handle);
logsRoutes.get('/my', ensureAuthenticated, listUserGameLogsController.handle);

export { logsRoutes };
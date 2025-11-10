import { Router } from 'express';

import { CreateUserGameLogController } from '../controllers/logs/CreateUserGameLogController.js';
import { ListUserGameLogsController } from '../controllers/logs/ListUserGameLogsController.js';
import { UpdateUserGameLogController } from '../controllers/logs/UpdateUserGameLogController.js';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const logsRoutes = Router();

const createUserGameLogController = new CreateUserGameLogController();
const listUserGameLogsController = new ListUserGameLogsController();
const updateUserGameLogController = new UpdateUserGameLogController();

logsRoutes.post('/', ensureAuthenticated, createUserGameLogController.handle);
logsRoutes.get('/my', ensureAuthenticated, listUserGameLogsController.handle);
logsRoutes.put('/:id', ensureAuthenticated, updateUserGameLogController.handle);

export { logsRoutes };
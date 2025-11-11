import { Router } from 'express';

import { CreateUserController } from '../controllers/users/CreateUserController.js';
import { AuthenticateUserController } from '../controllers/users/AuthenticateUserController.js';
import { ListUsersController } from '../controllers/users/ListUsersController.js';
import { DeleteUserController } from '../controllers/users/DeleteUserController.js';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ensureAdmin } from '../middlewares/ensureAdmin.js';

const usersRoutes = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const listUsersController = new ListUsersController();
const deleteUserController = new DeleteUserController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.get('/', ensureAuthenticated, ensureAdmin, listUsersController.handle);
usersRoutes.delete('/:id', ensureAuthenticated, ensureAdmin, deleteUserController.handle);

export { usersRoutes };
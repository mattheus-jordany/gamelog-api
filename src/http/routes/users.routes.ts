import { Router } from 'express';
import { CreateUserController } from '../controllers/users/CreateUserController.js';
import { AuthenticateUserController } from '../controllers/users/AuthenticateUserController.js';
import { ListUsersController } from '../controllers/users/ListUsersController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ensureAdmin } from '../middlewares/ensureAdmin.js';

const usersRoutes = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const listUsersController = new ListUsersController();

// Rotas públicas
usersRoutes.post('/', createUserController.handle);

// Rota protegida para admins
usersRoutes.get('/', ensureAuthenticated, ensureAdmin, listUsersController.handle);

export { usersRoutes };
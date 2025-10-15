import { Router } from 'express';
import { CreateUserController } from '../controllers/users/CreateUserController.js';
import { AuthenticateUserController } from '../controllers/users/AuthenticateUserController.js';

const usersRoutes = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

usersRoutes.post('/', createUserController.handle);

usersRoutes.post('/sessions', authenticateUserController.handle);

export { usersRoutes };
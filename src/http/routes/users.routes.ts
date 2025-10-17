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
usersRoutes.post('/sessions', authenticateUserController.handle);

// Rota de teste para perfil (precisa de login)
usersRoutes.get('/profile', ensureAuthenticated, (request, response) => {
  return response.json({ message: `Bem-vindo, usuário com ID: ${request.user.id}` });
});

// Rota protegida para admins
usersRoutes.get('/', ensureAuthenticated, ensureAdmin, listUsersController.handle);

export { usersRoutes };
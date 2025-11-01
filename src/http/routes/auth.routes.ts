import { Router } from 'express';
import { AuthenticateUserController } from '../controllers/users/AuthenticateUserController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ResetPasswordController } from '../controllers/auth/ResetPasswordController.js';
import { ForgotPasswordController } from '../controllers/auth/ForgotPasswordController.js';

const authRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

const resetPasswordController = new ResetPasswordController();

const forgotPasswordController = new ForgotPasswordController();

authRoutes.post('/forgot-password', forgotPasswordController.handle);

authRoutes.post('/reset-password', resetPasswordController.handle);

authRoutes.post('/sessions', authenticateUserController.handle);

authRoutes.get('/profile', ensureAuthenticated, (request, response) => {
  return response.json({ message: `Bem-vindo, usuário com ID: ${request.user.id}` });
});

export { authRoutes };
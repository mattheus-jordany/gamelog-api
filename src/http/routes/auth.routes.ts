import { Router } from 'express';

import { AuthenticateUserController } from '../controllers/users/AuthenticateUserController.js';
import { ResetPasswordController } from '../controllers/auth/ResetPasswordController.js';
import { ForgotPasswordController } from '../controllers/auth/ForgotPasswordController.js';
import { UpdateProfileController } from '../controllers/auth/UpdateProfileController.js';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const authRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const resetPasswordController = new ResetPasswordController();
const forgotPasswordController = new ForgotPasswordController();
const updateProfileController = new UpdateProfileController();

authRoutes.post('/forgot-password', forgotPasswordController.handle);

authRoutes.post('/reset-password', resetPasswordController.handle);

authRoutes.post('/sessions', authenticateUserController.handle);

authRoutes.put('/profile', ensureAuthenticated,updateProfileController.handle);

authRoutes.get('/profile', ensureAuthenticated, (request, response) => {
  return response.json({ message: `Bem-vindo, usuário com ID: ${request.user.id}` });
});

export { authRoutes };
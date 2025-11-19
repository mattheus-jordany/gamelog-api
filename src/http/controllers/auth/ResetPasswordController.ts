import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ResetPasswordController {
  async handle(request: Request, response: Response) {
    const { token, password, password_confirmation } = request.body;

    try {
      if (password !== password_confirmation) {
        return response.status(400).json({ error: 'Passwords do not match.' });
      }

      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

      if (!passwordRegex.test(password)) {
        return response.status(400).json({ 
          error: 'Password is too weak.',
          details: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number.' 
        });
      }

      if (password !== password_confirmation) {
        return response.status(400).json({ error: 'Passwords do not match.' });
      }

      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: token,
        },
      });

      if (!user) {
        return response.status(400).json({ error: 'Invalid or expired token.' });
      }

      const now = new Date();
      if (user.passwordResetExpires && now > user.passwordResetExpires) {
        return response.status(400).json({ error: 'Invalid or expired token.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
          passwordResetToken: null, 
          passwordResetExpires: null,
        },
      });

      return response.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}
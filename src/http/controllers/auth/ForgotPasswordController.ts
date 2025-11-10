import type { Request, Response } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ForgotPasswordController {
  async handle(request: Request, response: Response) {
    const { email } = request.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return response.status(200).json({
          message: 'Se um usuário com este e-mail existir, um link de recuperação será enviado.',
        });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      const expires = new Date(now.getTime() + 3600000);

      await prisma.user.update({
        where: { email },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: expires,
        },
      });

      // 4. SIMULAÇÃO DO ENVIO DE E-MAIL
      console.log('=================================');
      console.log('SIMULAÇÃO DE ENVIO DE E-MAIL:');
      console.log(`Para: ${email}`);
      console.log(`Token de recuperação: ${resetToken}`);
      console.log('=================================');

      return response.status(200).json({
        message: 'Se um usuário com este e-mail existir, um link de recuperação será enviado.',
      });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}
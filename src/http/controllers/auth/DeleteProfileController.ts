import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeleteProfileController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;

      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return response.status(204).send();

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
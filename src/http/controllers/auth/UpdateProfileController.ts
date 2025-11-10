import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UpdateProfileController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;

      const { name, avatarUrl } = request.body;

      if (name) {
        const nameAlreadyTaken = await prisma.user.findFirst({
          where: {
            name: name,
            id: {
              not: userId,
            }
          }
        });

        if (nameAlreadyTaken) {
          return response.status(409).json({ error: 'This username is already taken.' });
        }
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          avatarUrl,
        }
      });

      const { password: _, ...userWithoutPassword } = updatedUser;

      return response.status(200).json(userWithoutPassword);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
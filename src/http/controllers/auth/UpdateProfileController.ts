import type { Request, Response } from 'express';
import { prisma } from '../../../prisma/client.js';

export class UpdateProfileController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;

      const { name, avatarUrl } = request.body;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.status(404).json({ error: 'User not found.' });
      }

      if (name && name !== user.name) {
        if (user.nameChangeLockedUntil && user.nameChangeLockedUntil > new Date()) {
          return response.status(403).json({
            error: 'You are currently blocked from changing your name.',
            lockExpiresAt: user.nameChangeLockedUntil,
          });
        }

        const nameAlreadyTaken = await prisma.user.findFirst({
          where: {
            name: name,
            id: { not: userId }, 
          },
        });

        if (nameAlreadyTaken) {
          return response.status(409).json({ error: 'This username is already taken.' });
        }
      }
      
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
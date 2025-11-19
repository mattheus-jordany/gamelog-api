import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UnblockUserNameController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userIdToUnblock } = request.params;

      if (!userIdToUnblock){
        return response.status(400).json({ error: 'User ID is missing from URL.' })
      }

      const user = await prisma.user.findUnique({
        where: { id: userIdToUnblock },
      });

      if (!user) {
        return response.status(404).json({ error: 'User not found.' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userIdToUnblock },
        data: {
          nameChangeLockedUntil: null,
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
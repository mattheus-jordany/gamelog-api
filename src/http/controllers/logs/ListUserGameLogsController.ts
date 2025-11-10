import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListUserGameLogsController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;

      const userLogs = await prisma.userGameLog.findMany({
        where: {
          userId: userId,
        },

        include: {
          game: {
            select: {
              title: true,
              platform: true,
              coverUrl: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        }
      });

      return response.status(200).json(userLogs);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
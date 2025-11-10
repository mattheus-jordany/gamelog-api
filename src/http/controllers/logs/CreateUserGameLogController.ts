import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateUserGameLogController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;

      const {
        gameId,
        rating,
        comment,
        recommendation,
        playtimeHours,
        isPlatininated,
        status,
        startedAt,
        finishedAt
      } = request.body;

      const gameExists = await prisma.game.findUnique({
        where: { id: gameId },
      });

      if (!gameExists) {
        return response.status(404).json({ error: 'Game not found in catalog.' });
      }

      const logAlreadyExists = await prisma.userGameLog.findUnique({
        where: {
          userId_gameId: {
            userId: userId,
            gameId: gameId,
          }
        }
      });

      if (logAlreadyExists) {
        return response.status(409).json({ error: 'This game is already in your log.' });
      }

      const userGameLog = await prisma.userGameLog.create({
        data: {
          userId,
          gameId,
          rating,
          comment,
          recommendation,
          playtimeHours,
          isPlatininated,
          status,
          startedAt: startedAt ? new Date(startedAt) : null, // Converte string de data se existir
          finishedAt: finishedAt ? new Date(finishedAt) : null,
        }
      });

      return response.status(201).json(userGameLog);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
import type { Request, Response } from 'express';
import { prisma } from '../../../prisma/client.js';

export class ListGamesController {
  async handle(request: Request, response: Response) {
    try {
      const page = request.query.page ? parseInt(request.query.page as string, 10) : 1;
      const limit = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;

      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.max(1, limit);

      const skip = (validatedPage - 1) * validatedLimit;

      const games = await prisma.game.findMany({
        skip: skip,
        take: validatedLimit,
        orderBy: {
          title: 'asc',
        },
      });

      const totalGames = await prisma.game.count();

      return response.status(200).json({
        data: games,
        meta: {
          total: totalGames,
          page: validatedPage,
          limit: validatedLimit,
          totalPages: Math.ceil(totalGames / validatedLimit),
        },
      });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
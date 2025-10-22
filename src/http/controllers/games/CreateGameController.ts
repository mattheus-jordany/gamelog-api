import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateGameController {
  async handle(request: Request, response: Response) {
    try {
      const { title, platform, genre, releaseYear } = request.body;

      const gameAlreadyExists = await prisma.game.findUnique({
        where: { title },
      });

      if (gameAlreadyExists) {
        return response.status(409).json({ error: 'A game with this title already exists.' });
      }

      const game = await prisma.game.create({
        data: {
          title,
          platform,
          genre,
          releaseYear,
        },
      });

      return response.status(201).json(game);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
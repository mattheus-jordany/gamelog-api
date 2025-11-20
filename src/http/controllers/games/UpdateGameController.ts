import type { Request, Response } from 'express';
import { prisma } from '../../../prisma/client.js';

export class UpdateGameController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: 'Game ID is missing.' });
      }

      const { title, platform, genre, releaseYear, coverUrl } = request.body;

      const gameExists = await prisma.game.findUnique({
        where: { id },
      });

      if (!gameExists) {
        return response.status(404).json({ error: 'Game not found.' });
      }

      const updatedGame = await prisma.game.update({
        where: { id },
        data: {
          title,
          platform,
          genre,
          releaseYear,
          coverUrl,
        },
      });

      return response.status(200).json(updatedGame);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
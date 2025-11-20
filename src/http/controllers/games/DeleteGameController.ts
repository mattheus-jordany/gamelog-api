import type { Request, Response } from 'express';
import { prisma } from '../../../prisma/client.js';

export class DeleteGameController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: 'Game ID is missing.' });
      }

      const gameExists = await prisma.game.findUnique({
        where: { id },
      });

      if (!gameExists) {
        return response.status(404).json({ error: 'Game not found.' });
      }

      await prisma.game.delete({
        where: { id },
      });

      return response.status(204).send(); 

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
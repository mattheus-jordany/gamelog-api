import type { Request, Response } from 'express';
import { prisma } from '../../../prisma/client.js';

export class DeleteUserGameLogController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;

      const { id: logId } = request.params;

      if (!logId) {
        return response.status(400).json({ error: 'Log ID is missing from URL.' });
      }

      const deleteResult = await prisma.userGameLog.deleteMany({
        where: {
          id: logId,
          userId: userId,
        },
      });

      if (deleteResult.count === 0) {
        return response.status(404).json({ error: 'Log not found or user not authorized.' });
      }

      return response.status(204).send();

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
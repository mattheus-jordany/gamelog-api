import type { Request, Response } from 'express';
import { prisma } from '../../../prisma/client.js';
import { error } from 'console';

export class UpdateUserGameLogController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;

      const { id: logId } = request.params;
    
      if (!logId){
        return response.status(400).json({ error: 'Log ID is missing from URL.' })
      }
      const {
        rating,
        comment,
        recommendation,
        playtimeHours,
        isPlatininated,
        status,
        startedAt,
        finishedAt
      } = request.body;

      const updateResult = await prisma.userGameLog.updateMany({
        where: {
          id: logId,
          userId: userId,
        },
        data: {
          rating,
          comment,
          recommendation,
          playtimeHours,
          isPlatininated,
          status,
          startedAt: startedAt ? new Date(startedAt) : null,
          finishedAt: finishedAt ? new Date(finishedAt) : null,
        }
      });

      if (updateResult.count === 0) {
        return response.status(404).json({ error: 'Log not found or user not authorized.' });
      }

      const updatedLog = await prisma.userGameLog.findUnique({
        where: { id: logId }
      });

      return response.status(200).json(updatedLog);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
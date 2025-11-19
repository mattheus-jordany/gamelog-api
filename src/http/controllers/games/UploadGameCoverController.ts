import type { Request, Response } from 'express';
import { cloudinary } from '../../../config/cloudinary.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UploadGameCoverController {
  async handle(request: Request, response: Response) {
    try {
      const { id: gameId } = request.params;

      if (!gameId) {
        return response.status(400).json({ error: 'Game ID is missing from URL.' });
      }
      
      if (!request.file) {
        return response.status(400).json({ error: 'No cover image file uploaded.' });
      }

      const gameExists = await prisma.game.findFirst({
        where: { id: gameId },
      });
      
      if (!gameExists) {
        return response.status(404).json({ error: 'Game not found.' });
      }
      
      const b64 = Buffer.from(request.file.buffer).toString('base64');
      const dataURI = 'data:' + request.file.mimetype + ';base64,' + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'gamelog_covers', 
        public_id: gameId,
        overwrite: true,
      });

      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          coverUrl: result.secure_url,
        },
      });

      return response.status(200).json(updatedGame);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
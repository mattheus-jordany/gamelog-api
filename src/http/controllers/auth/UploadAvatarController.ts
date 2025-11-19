import type { Request, Response } from 'express';
import { cloudinary } from '../../../config/cloudinary.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UploadAvatarController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userId } = request.user;

      if (!request.file) {
        return response.status(400).json({ error: 'No file uploaded.' });
      }

      const b64 = Buffer.from(request.file.buffer).toString('base64');
      const dataURI = 'data:' + request.file.mimetype + ';base64,' + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'gamelog_avatars', 
        public_id: userId,
        overwrite: true,
      });

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          avatarUrl: result.secure_url,
        },
      });

      const { password: _, ...userWithoutPassword } = updatedUser;

      return response.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
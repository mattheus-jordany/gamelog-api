import type { Request, Response } from 'express';
import { prisma } from '../../../prisma/client.js';

export class ListUsersController {
  async handle(request: Request, response: Response) {
    try {
      const users = await prisma.user.findMany();

      const usersWithoutPassword = users.map(user => {
        const { password, ...userClean } = user;
        return userClean;
      });

      return response.status(200).json(usersWithoutPassword);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}
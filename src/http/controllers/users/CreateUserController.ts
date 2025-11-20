import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../prisma/client.js';

export class CreateUserController {
  async handle(request: Request, response: Response) {
    try {
      const { name, email, password } = request.body;

      if (!password) {
        return response.status(400).json({ error: 'Password is required.' });
      }

      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

      if (!passwordRegex.test(password)) {
        return response.status(400).json({ 
          code: 'password.weak',
          error: 'Password is too weak.',
          details: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one number.' 
        });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { name }],
         },
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return response.status(409).json({ error: 'This email is already in use.'})
        }
        if (existingUser.name === name) {
          return response.status(409).json({ error: 'This username is already taken'})
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      return response.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error.' });
    }
  }
}
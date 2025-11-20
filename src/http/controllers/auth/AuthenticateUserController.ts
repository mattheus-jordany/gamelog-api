import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return response.status(401).json({ error: "Invalid credentials." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return response.status(401).json({ error: "Invalid credentials." });
      }

      const token = jwt.sign(
        { role: user.role },
        process.env.JWT_SECRET as string,
        {
          subject: user.id,
          expiresIn: "1d",
        }
      );

      const { password: _, ...userWithoutPassword } = user;

      return response.status(200).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error." });
    }
  }
}

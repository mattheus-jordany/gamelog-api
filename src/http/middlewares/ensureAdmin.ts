import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client.js";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (user?.role !== "ADMIN") {
    return response.status(403).json({ error: "User is not an admin." });
  }

  return next();
}

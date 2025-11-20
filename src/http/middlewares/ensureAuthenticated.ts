import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const { verify } = jwt;

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ error: "Token is missing." });
  }

  const [, token] = authToken.split(" ");
  if (!token) {
    return response.status(401).json({ error: "Token malformatted." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  try {
    const { sub } = verify(token, secret) as IPayload;
    request.user = { id: sub };
    return next();
  } catch (err) {
    return response.status(401).json({ error: "Invalid token." });
  }
}

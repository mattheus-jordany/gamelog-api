import type { Request, Response } from "express";
import { prisma } from "../../../prisma/client.js";

export class GetGameByIdController {
  async handle(request: Request, response: Response) {
    try {
      const { id } = request.params;

      if (!id) {
        return response.status(400).json({ error: "Game ID is missing." });
      }

      const game = await prisma.game.findUnique({
        where: { id },
      });

      if (!game) {
        return response.status(404).json({ error: "Game not found." });
      }

      return response.status(200).json(game);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error." });
    }
  }
}

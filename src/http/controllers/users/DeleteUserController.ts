import type { Request, Response } from "express";
import { prisma } from "../../../prisma/client.js";

export class DeleteUserController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userIdToDelete } = request.params;

      const { id: adminId } = request.user;

      if (!userIdToDelete) {
        return response
          .status(400)
          .json({ error: "User ID is missing from URL." });
      }

      if (userIdToDelete === adminId) {
        return response.status(403).json({
          error:
            "Admins cannot delete themselves using this route. Use DELETE /auth/profile instead.",
        });
      }

      const userExists = await prisma.user.findUnique({
        where: { id: userIdToDelete },
      });

      if (!userExists) {
        return response.status(404).json({ error: "User not found." });
      }

      await prisma.user.delete({
        where: { id: userIdToDelete },
      });

      return response.status(204).send();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error." });
    }
  }
}

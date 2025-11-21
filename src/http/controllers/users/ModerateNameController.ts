import type { Request, Response } from "express";
import { prisma } from "../../../prisma/client.js";

export class ModerateNameController {
  async handle(request: Request, response: Response) {
    try {
      const { id: userIdToModerate } = request.params;

      const { id: adminId } = request.user;

      if (!userIdToModerate) {
        return response
          .status(400)
          .json({ error: "User ID is missing from URL." });
      }

      if (userIdToModerate === adminId) {
        return response
          .status(403)
          .json({ error: "Admin cannot moderate their own name." });
      }

      const user = await prisma.user.findUnique({
        where: { id: userIdToModerate },
      });

      if (!user) {
        return response.status(404).json({ error: "User not found." });
      }

      const defaultName = `User_${userIdToModerate.substring(0, 8)}`;
      const lockDuration = 3 * 7 * 24 * 60 * 60 * 1000;
      const lockExpiresAt = new Date(Date.now() + lockDuration);

      const updatedUser = await prisma.user.update({
        where: { id: userIdToModerate },
        data: {
          name: defaultName,
          nameChangeLockedUntil: lockExpiresAt,
        },
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      return response.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error." });
    }
  }
}

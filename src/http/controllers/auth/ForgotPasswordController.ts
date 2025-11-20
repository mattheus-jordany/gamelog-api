import type { Request, Response } from "express";
import crypto from "crypto";
import { EtherealMailProvider } from "../../../shared/provider/MailProvider/EtherealMailProvider.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const mailProvider = new EtherealMailProvider();

export class ForgotPasswordController {
  async handle(request: Request, response: Response) {
    const { email } = request.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return response.status(200).json({
          message:
            "Se um usuário com este e-mail existir, um link de recuperação será enviado.",
        });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");

      const now = new Date();
      const expires = new Date(now.getTime() + 3600000);

      await prisma.user.update({
        where: { email },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: expires,
        },
      });

      const recoveryLink = `http://localhost:8080/reset-password?token=${resetToken}`;

      await mailProvider.sendMail(
        email,
        "Recuperação de Senha - GameLog API",
        `Olá, use este link para redefinir sua senha: <a href="${recoveryLink}">${recoveryLink}</a>`
      );

      return response.status(200).json({
        message:
          "Se um usuário com este e-mail existir, um link de recuperação será enviado.",
      });
    } catch (error) {
      console.error("ERRO NO FLUXO DE ESQUECI MINHA SENHA:", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}

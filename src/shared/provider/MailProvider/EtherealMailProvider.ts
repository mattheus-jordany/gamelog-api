import nodemailer, { type Transporter } from "nodemailer";

export class EtherealMailProvider {
  private client!: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((err) => {
        console.error(
          "Falha ao criar conta Ethereal. O envio de e-mails de teste não funcionará.",
          err
        );
      });
  }

  public async sendMail(
    to: string,
    subject: string,
    body: string
  ): Promise<void> {
    if (!this.client) {
      console.warn(
        "Nodemailer Client não inicializado (Ethereal falhou na criação)."
      );
      return;
    }

    const message = await this.client.sendMail({
      to,
      from: "GameLog API <noreply@gamelog.com>",
      subject,
      html: body,
    });

    console.log(
      "🔗 URL de visualização do E-mail (Ethereal): %s",
      nodemailer.getTestMessageUrl(message)
    );
  }
}

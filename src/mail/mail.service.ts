import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as process from 'node:process';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, token: string) {
    const confirmUrl = `${process.env.APP_URL}/confirm/${token}`;
    const unsubscribeUrl = `${process.env.APP_URL}/unsubscribe/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your subscription',
      template: 'confirmation',
      html: `
            <p>Click here to confirm: <a href="${confirmUrl}">${confirmUrl}</a></p>
            <p>Click here to unsubscribe: <a href="${unsubscribeUrl}">${unsubscribeUrl}</p>
            `,
    });
  }
}

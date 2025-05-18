import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as process from 'node:process';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, token: string) {
    const url = `${process.env.APP_URL}/confirm/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your subscription',
      template: 'confirmation',
      html: `<p>Click here: <a href="${url}">${url}</a></p>`,
    });
  }
}

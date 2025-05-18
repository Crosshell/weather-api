import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow('mail.host'),
          port: configService.getOrThrow('mail.port'),
          secure: false,
          auth: {
            user: configService.getOrThrow('mail.user'),
            pass: configService.getOrThrow('mail.pass'),
          },
        },
        defaults: {
          from: '"Weather App" <no-reply@weather.com>',
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

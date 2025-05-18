import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionModule } from './subscription/subscription.module';
import config from './config/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    WeatherModule,
    SubscriptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
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
  controllers: [],
  providers: [],
})
export class AppModule {}

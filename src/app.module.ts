import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './subscription/subscription.module';
import config from './config/config';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    WeatherModule,
    SubscriptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    NotificationModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

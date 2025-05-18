import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WeatherModule } from '../weather/weather.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [SubscriptionModule, WeatherModule, MailModule],
  providers: [NotificationService],
})
export class NotificationModule {}

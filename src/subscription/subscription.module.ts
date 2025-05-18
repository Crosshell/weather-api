import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { WeatherModule } from '../weather/weather.module';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [WeatherModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService, MailService],
})
export class SubscriptionModule {}

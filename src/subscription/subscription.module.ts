import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { WeatherModule } from '../weather/weather.module';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [WeatherModule, MailModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}

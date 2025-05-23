import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WeatherSummaryDto } from '../weather/dto/weather-summary.dto';
import { MailService } from '../mail/mail.service';
import { WeatherService } from '../weather/weather.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { FrequencyType } from 'generated/prisma';

@Injectable()
export class NotificationService {
  constructor(
    private subscriptionService: SubscriptionService,
    private weatherService: WeatherService,
    private mailService: MailService,
  ) {}
  @Cron('0 * * * *')
  async sendHourlyWeather() {
    const hourlySubscriptions =
      await this.subscriptionService.findSubscriptionsByFrequency(
        FrequencyType.hourly,
      );

    await Promise.allSettled(
      hourlySubscriptions.map(async ({ email, city, token }) => {
        const weather: WeatherSummaryDto =
          await this.weatherService.getCurrent(city);

        await this.mailService.sendWeather(
          email,
          city,
          token,
          weather,
          FrequencyType.hourly,
        );
      }),
    );
  }

  @Cron('0 0 * * *')
  async sendDailyWeather() {
    const dailySubscriptions =
      await this.subscriptionService.findSubscriptionsByFrequency(
        FrequencyType.daily,
      );

    await Promise.allSettled(
      dailySubscriptions.map(async ({ email, city, token }) => {
        const weather: WeatherSummaryDto =
          await this.weatherService.getCurrent(city);

        await this.mailService.sendWeather(
          email,
          city,
          token,
          weather,
          FrequencyType.daily,
        );
      }),
    );
  }
}

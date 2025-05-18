import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as process from 'node:process';
import { WeatherSummaryDto } from '../weather/dto/weather-summary.dto';
import { FrequencyType } from 'generated/prisma';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmation(email: string, token: string) {
    const confirmUrl = `${process.env.APP_URL}/confirm/${token}`;
    const unsubscribeUrl = `${process.env.APP_URL}/unsubscribe/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your subscription',
      html: `
            <p>Click here to confirm: <a href="${confirmUrl}">${confirmUrl}</a></p>
            <p>Click here to unsubscribe: <a href="${unsubscribeUrl}">${unsubscribeUrl}</p>
            `,
    });
  }

  async sendWeather(
    email: string,
    city: string,
    weather: WeatherSummaryDto,
    frequency: FrequencyType,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `${frequency === FrequencyType.hourly ? 'Hourly' : 'Daily'} Weather Update`,
      html: `
        <h2>Weather in ${city}</h2>
        <p>${weather.description}, ${weather.temperature}°C</p>
        <p>Humidity: ${weather.humidity}%</p>
      `,
    });
  }
}

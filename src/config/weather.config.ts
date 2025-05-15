import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherApiConfig {
  constructor(private configService: ConfigService) {}

  get key(): string {
    return this.configService.getOrThrow<string>('weatherApi.key');
  }

  get baseUrl(): string {
    return this.configService.getOrThrow<string>('weatherApi.baseUrl');
  }
}

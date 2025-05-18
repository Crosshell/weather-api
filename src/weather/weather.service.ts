import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WeatherApiConfig } from '../config/weather.config';
import { WeatherApiResponseDto } from './dto/weather-api-response.dto';
import { AxiosResponse } from 'axios';
import { WeatherSummaryDto } from './dto/weather-summary.dto';

@Injectable()
export class WeatherService {
  constructor(
    private httpService: HttpService,
    private weatherApiConfig: WeatherApiConfig,
  ) {}
  async getCurrent(city: string): Promise<WeatherSummaryDto> {
    if (!city) {
      throw new BadRequestException('Invalid request');
    }

    const key = this.weatherApiConfig.key;
    const baseUrl = this.weatherApiConfig.baseUrl;
    const url = `${baseUrl}/current.json?key=${key}&q=${city}&aqi=no`;

    const response: AxiosResponse<WeatherApiResponseDto> = await firstValueFrom(
      this.httpService.get(url),
    );
    const data: WeatherApiResponseDto = response.data;

    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text,
    };
  }
}

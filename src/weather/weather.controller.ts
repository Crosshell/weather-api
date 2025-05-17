import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherSummaryDto } from './dto/weather-summary.dto';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  async getCurrent(@Query('city') city: string): Promise<WeatherSummaryDto> {
    return this.weatherService.getCurrent(city);
  }
}

import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherExceptionFilter } from './filters/weather-exception.filter';
import { WeatherSummaryDto } from './dto/weather-summary.dto';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  @UseFilters(WeatherExceptionFilter)
  async getCurrent(@Query('city') city: string): Promise<WeatherSummaryDto> {
    return this.weatherService.getCurrent(city);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { WeatherApiConfig } from '../config/weather.config';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { of } from 'rxjs';

describe('WeatherService', () => {
  let service: WeatherService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockWeatherApiConfig = {
    key: 'test-api-key',
    baseUrl: 'https://api.example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: WeatherApiConfig, useValue: mockWeatherApiConfig },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrent', () => {
    it('should throw BadRequestException if city is not found', async () => {
      await expect(service.getCurrent('')).rejects.toThrow(BadRequestException);
    });

    it('should call external API and return weather summary', async () => {
      const city = 'Kyiv';

      const apiResponse: AxiosResponse = {
        data: {
          current: {
            temp_c: 21.5,
            humidity: 60,
            condition: {
              text: 'Clear',
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      };

      mockHttpService.get.mockReturnValue(of(apiResponse));

      const result = await service.getCurrent(city);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        `${mockWeatherApiConfig.baseUrl}/current.json?key=${mockWeatherApiConfig.key}&q=${city}&aqi=no`,
      );

      expect(result).toEqual({
        temperature: 21.5,
        humidity: 60,
        description: 'Clear',
      });
    });
  });
});

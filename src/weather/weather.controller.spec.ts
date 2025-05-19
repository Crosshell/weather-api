import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherSummaryDto } from './dto/weather-summary.dto';

describe('WeatherController', () => {
  let controller: WeatherController;

  const mockWeatherService = {
    getCurrent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrent', () => {
    it('should get current weather', async () => {
      const city = 'London';
      const expected: WeatherSummaryDto = {
        temperature: 10,
        humidity: 54,
        description: 'Sunny',
      };

      mockWeatherService.getCurrent.mockResolvedValue(expected);

      const result = await controller.getCurrent(city);

      expect(mockWeatherService.getCurrent).toHaveBeenCalledWith(city);
      expect(result).toEqual(expected);
    });
  });
});

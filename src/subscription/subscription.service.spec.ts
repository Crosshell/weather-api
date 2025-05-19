import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { PrismaService } from '../prisma.service';
import { WeatherService } from '../weather/weather.service';
import { MailService } from '../mail/mail.service';
import { Subscription } from 'generated/prisma';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import { FrequencyType } from 'generated/prisma';

describe('SubscriptionService', () => {
  let service: SubscriptionService;

  const mockPrismaService = {
    subscription: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockWeatherService = {
    getCurrent: jest.fn(),
  };

  const mockMailService = {
    sendConfirmation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should create a new subscription', async () => {
      const subscribeDto: SubscribeDto = {
        email: 'testTest@gmail.com',
        city: 'Lviv',
        frequency: 'daily',
      };
      const mockToken = new Uint8Array(16);

      const expected = 'Subscription successful. Confirmation email sent.';

      mockPrismaService.subscription.findUnique.mockResolvedValue(null);

      jest.spyOn(uuid, 'v4').mockReturnValue(mockToken);

      const result = await service.subscribe(subscribeDto);

      expect(mockPrismaService.subscription.findUnique).toHaveBeenCalledWith({
        where: {
          email: subscribeDto.email,
        },
      });
      expect(mockWeatherService.getCurrent).toHaveBeenCalledWith(
        subscribeDto.city,
      );
      expect(mockPrismaService.subscription.create).toHaveBeenCalledWith({
        data: {
          ...subscribeDto,
          token: mockToken,
        },
      });
      expect(mockMailService.sendConfirmation).toHaveBeenCalledWith(
        subscribeDto.email,
        mockToken,
      );
      expect(result).toEqual(expected);
    });

    it('should throw ConflictException if email is already subscribed', async () => {
      const subscribeDto: SubscribeDto = {
        email: 'test1@gmail.com',
        city: 'Lviv',
        frequency: 'daily',
      };
      const subscription: Subscription = {
        id: 'uuid-token-id',
        email: 'test1@gmail.com',
        city: 'Lviv',
        frequency: 'daily',
        confirmed: true,
        token: 'mock-token',
      };

      mockPrismaService.subscription.findUnique.mockResolvedValue(subscription);
      await expect(service.subscribe(subscribeDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('confirm', () => {
    it('should confirm subscription', async () => {
      const token = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

      const subscription: Subscription = {
        id: 'uuid-token-id',
        email: 'test1@gmail.com',
        city: 'Lviv',
        frequency: 'daily',
        confirmed: false,
        token: token,
      };

      const expected = 'Subscription confirmed successfully';

      mockPrismaService.subscription.findUnique.mockResolvedValue(subscription);

      const result = await service.confirm(token);

      expect(mockPrismaService.subscription.findUnique).toHaveBeenCalledWith({
        where: {
          token,
        },
      });
      expect(mockPrismaService.subscription.update).toHaveBeenCalledWith({
        where: {
          token,
        },
        data: {
          confirmed: true,
        },
      });
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException if token is not UUID', async () => {
      const token = 'wrongFormatToken';

      await expect(service.confirm(token)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if token not found', async () => {
      const token = '3fa85f64-5717-4562-b3fc-4c963f66afa6';

      mockPrismaService.subscription.findUnique.mockResolvedValue(null);

      await expect(service.confirm(token)).rejects.toThrow(NotFoundException);
    });
  });

  describe('unsubscribe', () => {
    it('should delete subscription', async () => {
      const token = '3fa85f64-5717-4562-b3fc-4c963f66afa6';
      const subscription: Subscription = {
        id: 'uuid-token-id',
        email: 'test1@gmail.com',
        city: 'Lviv',
        frequency: 'daily',
        confirmed: false,
        token: token,
      };

      const expected = 'Unsubscribed successfully';

      mockPrismaService.subscription.findUnique.mockResolvedValue(subscription);

      const result = await service.unsubscribe(token);

      expect(mockPrismaService.subscription.findUnique).toHaveBeenCalledWith({
        where: {
          token,
        },
      });
      expect(mockPrismaService.subscription.delete).toHaveBeenCalledWith({
        where: {
          token,
        },
      });
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException if token is not UUID', async () => {
      const token = 'wrongFormatToken';

      await expect(service.unsubscribe(token)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if token not found', async () => {
      const token = '3fa85f64-5717-4562-b3fc-4c963f66afa6';

      mockPrismaService.subscription.findUnique.mockResolvedValue(null);

      await expect(service.unsubscribe(token)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findSubscriptionsByFrequency', () => {
    it('should find subscriptions by frequency', async () => {
      const frequency = FrequencyType.hourly;
      const subscriptions = [
        {
          id: 'uuid-token-id1',
          email: 'test1@gmail.com',
          city: 'Lviv',
          frequency: 'hourly',
          confirmed: true,
          token: 'mock-token',
        },
        {
          id: 'uuid-token-id3',
          email: 'test3@gmail.com',
          city: 'Kyiv',
          frequency: 'hourly',
          confirmed: true,
          token: 'mock-token',
        },
      ];

      mockPrismaService.subscription.findMany.mockResolvedValue(subscriptions);

      const result = await service.findSubscriptionsByFrequency(frequency);

      expect(mockPrismaService.subscription.findMany).toHaveBeenCalledWith({
        where: {
          confirmed: true,
          frequency,
        },
      });

      expect(result).toEqual(subscriptions);
    });
  });
});

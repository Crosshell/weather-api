import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscribeDto } from './dto/subscribe.dto';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;

  const mockSubscriptionService = {
    subscribe: jest.fn(),
    confirm: jest.fn(),
    unsubscribe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('subscribe', () => {
    it('should create a new subscription', async () => {
      const subscribeDto: SubscribeDto = {
        email: 'test@gmail.com',
        city: 'London',
        frequency: 'hourly',
      };
      const expected = 'Subscription successful. Confirmation email sent.';

      mockSubscriptionService.subscribe.mockResolvedValue(expected);

      const result = await controller.subscribe(subscribeDto);

      expect(mockSubscriptionService.subscribe).toHaveBeenCalledWith(
        subscribeDto,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('confirm', () => {
    it('should confirm subscription', async () => {
      const token = 'test-token';
      const expected = 'Subscription confirmed successfully';

      mockSubscriptionService.confirm.mockResolvedValue(expected);

      const result = await controller.confirm(token);

      expect(mockSubscriptionService.confirm).toHaveBeenCalledWith(token);
      expect(result).toEqual(expected);
    });
  });

  describe('unsubscribe', () => {
    it('should delete subscription', async () => {
      const token = 'test-token';
      const expected = 'Unsubscribed successfully';

      mockSubscriptionService.unsubscribe.mockResolvedValue(expected);

      const result = await controller.unsubscribe(token);

      expect(mockSubscriptionService.unsubscribe).toHaveBeenCalledWith(token);
      expect(result).toEqual(expected);
    });
  });
});

import { ConflictException, Injectable } from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { PrismaService } from '../prisma.service';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private weatherService: WeatherService,
  ) {}
  async subscribe(createSubscriptionDto: SubscribeDto): Promise<string> {
    const subscription = await this.prismaService.subscription.findUnique({
      where: {
        email: createSubscriptionDto.email,
      },
    });

    if (subscription) {
      throw new ConflictException('Email already subscribed');
    }

    await this.weatherService.getCurrent(createSubscriptionDto.city);

    await this.prismaService.subscription.create({
      data: {
        ...createSubscriptionDto,
        token: 'some token',
      },
    });
    return 'Subscription successful. Confirmation email sent.';
  }

  //async unsubscribe(token: string) {}
}

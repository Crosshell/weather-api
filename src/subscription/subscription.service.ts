import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { PrismaService } from '../prisma.service';
import { WeatherService } from 'src/weather/weather.service';
import { MailService } from '../mail/mail.service';
import * as uuid from 'uuid';
import { isUUID } from 'class-validator';

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private weatherService: WeatherService,
    private mailService: MailService,
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

    const token = uuid.v4();
    await this.prismaService.subscription.create({
      data: {
        ...createSubscriptionDto,
        token,
      },
    });

    await this.mailService.sendConfirmationEmail(
      createSubscriptionDto.email,
      token,
    );
    return 'Subscription successful. Confirmation email sent.';
  }

  async confirm(token: string): Promise<string> {
    if (!isUUID(token)) {
      throw new BadRequestException('Invalid token');
    }

    const subscription = await this.prismaService.subscription.findUnique({
      where: {
        token,
      },
    });
    if (!subscription) {
      throw new NotFoundException('Token not found');
    }

    await this.prismaService.subscription.update({
      where: {
        token,
      },
      data: {
        confirmed: true,
      },
    });

    return 'Subscription confirmed successfully';
  }

  //async unsubscribe(token: string) {}
}

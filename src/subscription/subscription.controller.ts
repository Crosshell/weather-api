import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller()
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  async subscribe(@Body() subscribeDto: SubscribeDto): Promise<string> {
    return this.subscriptionService.subscribe(subscribeDto);
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string): Promise<string> {
    return this.subscriptionService.confirm(token);
  }

  @Get('unsubscribe/:token')
  async unsubscribe(@Param('token') token: string): Promise<string> {
    return this.subscriptionService.unsubscribe(token);
  }
}

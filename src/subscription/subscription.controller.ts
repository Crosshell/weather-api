import { Controller, Post, Body } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller()
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  async subscribe(
    @Body() createSubscriptionDto: SubscribeDto,
  ): Promise<string> {
    return this.subscriptionService.subscribe(createSubscriptionDto);
  }

  /*@Get('unsubscribe/:token')
  unsubscribe(@Param('token') token: string) {
    return this.subscriptionService.unsubscribe(token);
  }*/
}

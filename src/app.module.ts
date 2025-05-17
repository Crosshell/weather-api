import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './subscription/subscription.module';
import config from './config/config';

@Module({
  imports: [
    WeatherModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

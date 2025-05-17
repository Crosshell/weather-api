import { IsEmail, IsEnum, IsString } from 'class-validator';
import { FrequencyType } from 'generated/prisma';

export class SubscribeDto {
  @IsEmail()
  email: string;

  @IsString()
  city: string;

  @IsEnum(FrequencyType)
  frequency: FrequencyType;
}

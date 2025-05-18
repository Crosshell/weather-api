import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

@Catch(AxiosError)
export class WeatherApiExceptionFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;

    const description = 'Weather API error';

    if (statusCode === 400) {
      throw new NotFoundException('City not found');
    }

    response.status(statusCode).json({
      description,
    });
  }
}

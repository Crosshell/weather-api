import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
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

    let description = 'Weather API error';

    if (statusCode === 400) {
      description = 'Invalid request';
    } else if (statusCode === 404) {
      description = 'City not found';
    }

    response.status(statusCode).json({
      description,
    });
  }
}

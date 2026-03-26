import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    // Handle pesan error dari class-validator yang biasanya berbentuk array
    const message = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message[0]
      : exceptionResponse.message ||
        exceptionResponse.error ||
        'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: message,
      error:
        typeof exceptionResponse === 'string'
          ? 'Error'
          : exceptionResponse.error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

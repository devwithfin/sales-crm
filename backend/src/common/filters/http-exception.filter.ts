import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as any)
        : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse?.message
        ? Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message[0]
          : exceptionResponse.message
        : exception.message || 'Internal server error';

    // Log the error for internal debugging
    console.error('[Global Exception Filter]:', {
      status,
      message,
      stack: exception.stack,
    });

    response.status(status).json({
      success: false,
      message: message,
      data: null,
      statusCode: status,
      timestamp: new Date().toISOString(),
    });
  }
}

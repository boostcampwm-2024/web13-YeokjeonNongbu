import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as { message: string; data?: any }; // 타입 단언

    const message = exceptionResponse.message;
    const data = exceptionResponse.data;

    response.status(status).json({
      code: status,
      message,
      data // 추가 데이터 포함
    });
  }
}

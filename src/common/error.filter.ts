import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    ctx.getRequest();
    if (exception instanceof ZodError) {
      const errorMessages = exception.errors.map((error) => {
        const path = error.path.length > 0 ? error.path[0] : 'general';
        return `${path === 'general' ? '' : path + ': '}${error.message}`;
      });

      response.status(400).json({
        errors: errorMessages.join('<>'),
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      response.status(status).json({
        errors:
          typeof errorResponse === 'string'
            ? errorResponse
            : errorResponse['message'] || 'Unknown error',
      });
    } else {
      this.logger.error(exception);
      response.status(500).json({
        errors: 'Internal Server Error',
      });
    }
  }
}

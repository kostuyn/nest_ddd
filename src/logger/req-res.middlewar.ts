import { CustomLogger } from 'src/logger/custom-logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'node:http';

@Injectable()
export class ReqResMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  use(req: IncomingMessage, res: ServerResponse, next: () => unknown) {
    this.logger.log('HTTP_REQUEST', { req });

    res.once('finish', () => {
      if (res.statusCode >= 400) {
        this.logger.error('HTTP_ERROR_RESPONSE', { res });
        return;
      }

      this.logger.log('HTTP_RESPONSE', { res });
    });

    next();
  }
}

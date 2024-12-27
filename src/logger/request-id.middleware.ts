import { CustomLogger } from 'src/logger/custom-logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Logger } from 'pino';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class InitLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly context: AsyncLocalStorage<Logger>,
    private readonly customLogger: CustomLogger,
  ) {}

  use(req: IncomingMessage, res: ServerResponse, next: () => unknown) {
    const requestId = req.headers['x-request-id']?.toString() ?? uuidv7();
    res.setHeader('X-Request-Id', requestId);

    const logger = this.customLogger.logger.child({ requestId });
    this.context.run(logger, next);
  }
}

import { ConfigFactory, Config } from '@/config/config.factory';
import {
  loggerParamsFactory,
  LoggerSerializers,
} from 'src/logger/logger-params.factory';
import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AsyncLocalStorage } from 'async_hooks';
import pino, { Logger, LoggerOptions } from 'pino';
import { context } from '@/logger/context';

@Injectable()
export class CustomLogger implements LoggerService {
  private options: LoggerOptions;

  constructor(
    private readonly context: AsyncLocalStorage<Logger>,
    private readonly config: ConfigService<Config>,
  ) {
    this.options = loggerParamsFactory(this.config);
  }

  static create(): CustomLogger {
    const config = ConfigFactory.createConfigService();
    return new CustomLogger(context, config);
  }

  get logger(): Logger {
    return this.context.getStore() ?? pino(this.options);
  }

  log(message: string, data?: LoggerSerializers) {
    this.call('info', message, data);
  }

  error(message: string, data: LoggerSerializers | Error) {
    this.call('error', message, data);
  }

  warn(message: any, data?: LoggerSerializers) {
    this.call('warn', message, data);
  }

  debug(message: any, data?: LoggerSerializers) {
    this.call('debug', message, data);
  }

  verbose(message: any, data?: LoggerSerializers) {
    this.call('trace', message, data);
  }

  fatal(message: any, data?: LoggerSerializers) {
    this.call('fatal', message, data);
  }

  private call(method: string, message: any, ...optionalParams: any[]) {
    if (optionalParams.length > 0) {
      this.logger[method](
        optionalParams[0],
        message,
        ...optionalParams.slice(1),
      );
    } else {
      this.logger[method](message);
    }
  }
}

import { Config } from '@/config/config.factory';
import { LoggerConfig } from '@/config/logger.config';
import { Environment, NodeConfig } from '@/config/node.config';
import { ConfigService } from '@nestjs/config';
import { ServerResponse } from 'http';
import { IncomingMessage } from 'node:http';
import pino, { LoggerOptions } from 'pino';

export type LoggerSerializers = {
  req?: IncomingMessage;
  res?: ServerResponse;
  err?: Error;
  data?: Record<string, unknown> | Record<string, unknown>[];
};

export function loggerParamsFactory(
  config: ConfigService<Config>,
): LoggerOptions {
  const logLevel = config.get('logger.level', { infer: true });
  const transport = getTransport(config);

  const options: LoggerOptions = {
    level: logLevel,
    messageKey: 'message',
    errorKey: 'error',
    // todo: add redact
    redact: [],
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label: string): object {
        return { level: label };
      },
      log(object) {
        return {
          ...object,
        };
      },
    },
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      data: (data) => {
        return JSON.stringify(data);
      },
    },
    ...transport,
  };

  return options;
}

function getTransport(config: ConfigService<Config>): LoggerOptions {
  const env = config.get('node.nodeEnv', { infer: true });
  if (env === Environment.DEV) {
    return {
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: false,
        },
      },
    };
  }

  return undefined;
}

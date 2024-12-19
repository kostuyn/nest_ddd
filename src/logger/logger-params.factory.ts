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
  // todo: create correct type
  config: ConfigService<LoggerConfig> & ConfigService<NodeConfig>,
): LoggerOptions {
  const logLevel = config.get('level', { infer: true });
  const transport = getTransport(config);

  const options: LoggerOptions = {
    level: logLevel,
    messageKey: 'message',
    errorKey: 'error',
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
    // serializers: {
    //     req(req){

    //     }
    // },
    // serializers:{

    // },
    ...transport,
  };

  return options;
}

function getTransport(config: ConfigService<NodeConfig>): LoggerOptions {
  const env = config.get('nodeEnv', { infer: true });
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

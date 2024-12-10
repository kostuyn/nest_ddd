import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export class LoggerConfig {
  @IsEnum(LogLevel)
  @Expose({ name: 'LOGGER_LEVEL' })
  level: string;
}

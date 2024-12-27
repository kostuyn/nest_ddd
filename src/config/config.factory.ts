import {
  ClassConstructor,
  Exclude,
  Expose,
  plainToClassFromExist,
  plainToInstance,
  Type,
} from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { LoggerConfig } from 'src/config/logger.config';
import { NodeConfig } from 'src/config/node.config';
import { ServerConfig } from '@/config/app.config';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { OtelConfig } from '@/config/otel.config';

export class Config {
  node: NodeConfig = new NodeConfig();
  app: ServerConfig = new ServerConfig();
  logger: LoggerConfig = new LoggerConfig();
  otel: OtelConfig = new OtelConfig();
}

class ValidatedResult {
  result: Object;
  errors: string[] = [];
}

export class ConfigFactory {
  private static configService: ConfigService<Config> = null;

  static get envFile(): string | undefined {
    return '.env';
  }

  static createConfigService(): ConfigService<Config> {
    if (this.configService) {
      return this.configService;
    }

    dotenv.config({ path: this.envFile });
    const data = this.createConfig(process.env);
    this.configService = new ConfigService<Config>(data);

    return this.configService;
  }

  static createConfig(config: Record<string, unknown>): Config {
    const cfg = new Config();

    const errors = [];
    for (const key in cfg) {
      const validatedResult = this.validateConfig(cfg[key].constructor, config);

      errors.push(...validatedResult.errors);
      cfg[key] = validatedResult.result;
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return cfg;
  }

  private static validateConfig<T extends ClassConstructor<Object>>(
    t: T,
    config: Record<string, unknown>,
  ): ValidatedResult {
    const validatedConfig = plainToInstance(t, config, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
    });

    const errorMessages = this.parseErrors(t.name, errors);

    return {
      result: validatedConfig,
      errors: errorMessages,
    };
  }

  private static parseErrors(
    className: string,
    errors: ValidationError[],
  ): string[] {
    if (errors.length === 0) {
      return [];
    }

    const constraints = errors
      .map((error) => {
        return `${error.toString(true, true, undefined, true).trim()}. Actual value: ${error.value}\n`;
      })
      .join('');

    return [
      `An instance of ${className} has failed the validation:\n${constraints}`,
    ];
  }
}

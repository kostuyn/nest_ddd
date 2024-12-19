import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { LoggerConfig } from 'src/config/logger.config';
import { NodeConfig } from 'src/config/node.config';
import { ServerConfig } from 'src/config/server.config';

export type Config = NodeConfig | ServerConfig | LoggerConfig;

class ValidatedResult {
  result: Config;
  errors: string[] = [];
}

export function validate(config: Record<string, unknown>) {
  const configList = [NodeConfig, ServerConfig, LoggerConfig];

  const { result, errors } = configList.reduce((prevValue, cls) => {
    const validatedResult = validateConfig(cls, config);

    const errors = prevValue.errors.concat(validatedResult.errors);
    const result = {
      ...prevValue.result,
      ...validatedResult.result,
    };

    return {
      result,
      errors,
    };
  }, new ValidatedResult());

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  return result;
}

function validateConfig<T extends ClassConstructor<Config>>(
  t: T,
  config: Record<string, unknown>,
): ValidatedResult {
  const validatedConfig = plainToInstance(t, config);

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const errorMessages = parseErrors(t.name, errors);
  return {
    result: validatedConfig,
    errors: errorMessages,
  };
}

function parseErrors(className: string, errors: ValidationError[]): string[] {
  if (errors.length === 0) {
    return [];
  }

  const constraints = errors
    .map((error) => error.toString(true, true, undefined, true))
    .join('');

  return [
    `An instance of ${className} has failed the validation:\n${constraints}`,
  ];
}

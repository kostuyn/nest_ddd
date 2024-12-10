import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export enum Environment {
    DEV = 'dev',
    PROD = 'prod',
    TEST = 'test',
  }
  
export class NodeConfig {
  @IsEnum(Environment)
  @Expose({ name: 'NODE_ENV' })
  nodeEnv: string;
}

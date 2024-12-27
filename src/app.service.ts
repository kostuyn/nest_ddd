import { CustomLogger } from 'src/logger/custom-logger';
import { Injectable } from '@nestjs/common';
import { Config } from '@/config/config.factory';
import { ConfigService } from '@nestjs/config';

const logger = CustomLogger.create();

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService<Config>,
    private readonly logger: CustomLogger,
  ) {}

  getHello(): string {
    this.logger.log('Hello World!');
    this.logger.warn('My Data Array!!!', {
      data: [{ foo: 'bar' }, { data: 'My Data' }],
    });
    this.logger.log('My Data FooBar!!!', { data: { foo: 'bar' } });
    this.logger.debug('My Empty Data', { data: undefined });
    this.logger.error('My error!', new Error('Error message'));
    // this.logger.warn('My FooBar!!!', {foo: 'bar'});
    // this.logger.error(new Error('Error message'), 'My error!');
    // throw new Error('My NEW error!');

    this.logger.log('My config', {
      data: { aa: this.config.get('app.host', { infer: true }) },
    });
    logger.warn('Static logger');
    return 'Hello World!';
  }
}

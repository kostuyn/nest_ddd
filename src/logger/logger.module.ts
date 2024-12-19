import { CustomLogger } from '@/logger/custom-logger';
import { InitLoggerMiddleware } from './request-id.middleware';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ReqResInterceptor } from '@/logger-new/req-res.interceptor';
import { ReqResMiddleware } from 'src/logger-new/req-res.middlewar';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CustomLogger,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage<Logger>(),
    },
    // {
    //     provide: APP_INTERCEPTOR,
    //     useClass: ReqResInterceptor,
    // }
  ],
  exports: [CustomLogger],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InitLoggerMiddleware, ReqResMiddleware).forRoutes('*');
  }
}

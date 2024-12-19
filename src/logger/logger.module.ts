import { CustomLogger } from '@/logger/custom-logger';
import { InitLoggerMiddleware } from './request-id.middleware';
import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { ReqResMiddleware } from "src/logger/req-res.middlewar";

@Module({
    imports: [],
    controllers: [],
    providers: [
        CustomLogger,
        {
            provide: AsyncLocalStorage,
            useValue: new AsyncLocalStorage<Logger>(),
        },
    ],
    exports: [CustomLogger],
})
export class LoggerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                InitLoggerMiddleware,
                ReqResMiddleware,
            )
            .forRoutes('*');
    }
}

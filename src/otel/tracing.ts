import { ConfigFactory } from '@/config/config.factory';
import { Environment } from '@/config/node.config';
import { CustomLogger } from '@/logger/custom-logger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const config = ConfigFactory.createConfigService();
const logger = CustomLogger.create();

export const otelSdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: config.get('app.serviceName', { infer: true }),
  }),
  spanProcessor: createSpanProcessor(),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
  ],
});

process.on('SIGTERM', () => {
  otelSdk
    .shutdown()
    .then(() => {
      logger.log('SDK shut down successfully');
    })
    .catch((err) => {
      logger.log('Error shutting down SDK', err);
    })
    .finally(() => {
      process.exit(0);
    });
});

function createSpanProcessor(): SpanProcessor {
  const env = config.get('node.nodeEnv', { infer: true });
  const otelConfig = config.get('otel', { infer: true });

  const url = `http://${otelConfig.host}:${otelConfig.port}`;
  const traceExporter = new OTLPTraceExporter({
    url,
  });

  if (env === Environment.DEV) {
    return new SimpleSpanProcessor(traceExporter);
  }

  return new BatchSpanProcessor(traceExporter, {
    exportTimeoutMillis: otelConfig.exportTimeoutMillis,
    scheduledDelayMillis: otelConfig.scheduledDelayMillis,
    maxQueueSize: otelConfig.maxQueueSize,
    maxExportBatchSize: otelConfig.maxExportBatchSize,
  });
}

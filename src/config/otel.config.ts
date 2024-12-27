import { TransformNumberString as TransformIfNumberString } from '@/shared/transformers';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsPort, IsString } from 'class-validator';

export class OtelConfig {
  @IsString()
  @Expose({ name: 'OTEL_EXPORTER_HOST' })
  host: string;

  @IsPort()
  @Expose({ name: 'OTEL_EXPORTER_PORT' })
  port: string;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'OTEL_EXPORTER_TIMEOUT' })
  @TransformIfNumberString()
  exportTimeoutMillis: number = 30000;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'OTEL_EXPORTER_SCHEDULED_DELAY' })
  @TransformIfNumberString()
  scheduledDelayMillis: number = 5000;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'OTEL_EXPORTER_MAX_QUEUE_SIZE' })
  @TransformIfNumberString()
  maxQueueSize: number = 2048;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'OTEL_EXPORTER_MAX_EXPORT_BATCH_SIZE' })
  @TransformIfNumberString()
  maxExportBatchSize: number = 512;
}

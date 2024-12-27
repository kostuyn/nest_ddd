import { Expose } from 'class-transformer';
import { IsPort, IsString } from 'class-validator';

export class ServerConfig {
  @IsPort()
  @Expose({ name: 'APP_PORT' })
  port: string;

  @IsString()
  @Expose({ name: 'APP_HOST' })
  host: string;

  @IsString()
  @Expose({ name: 'APP_SERVICE_NAME' })
  serviceName: string;
}

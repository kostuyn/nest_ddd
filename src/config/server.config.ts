import { Expose } from 'class-transformer';
import { IsPort, IsString } from 'class-validator';

export class ServerConfig {
  @IsPort()
  @Expose({ name: 'HTTP_SERVER_PORT' })
  port: number;

  @IsString()
  @Expose({ name: 'HTTP_SERVER_HOST' })
  host: string;
}

import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) =>
    ({
      type: configService.get<string>('CONNECTION_TYPE'),
      url: configService.get<string>('CONNECTION_STRING'),
      entities: [`${__dirname}/../../../**/*.entity{.js,.ts}`],
      synchronize: false,
      logging:
        configService.get<string>('NODE_ENV') !== 'production' ? true : false,
    } as TypeOrmModuleOptions),
  inject: [ConfigService],
};

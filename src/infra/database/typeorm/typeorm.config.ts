import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) =>
    configService.get<string>('NODE_ENV') !== 'test'
      ? ({
          type: configService.get<string>('CONNECTION_TYPE'),
          url: configService.get<string>('CONNECTION_STRING'),
          entities: [`${__dirname}/../../../**/*.entity{.js,.ts}`],
          synchronize: false,
          logging:
            configService.get<string>('NODE_ENV') !== 'production'
              ? true
              : false,
        } as TypeOrmModuleOptions)
      : ({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [`${__dirname}/../../../**/*.entity{.js,.ts}`],
          synchronize: true,
          logging: false,
          dropSchema: true,
        } as TypeOrmModuleOptions),
  inject: [ConfigService],
};

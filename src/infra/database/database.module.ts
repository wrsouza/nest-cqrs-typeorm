import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './typeorm/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmAsyncConfig)],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../../infra/database/typeorm/typeorm-ex.module';
import { CommandHandlers } from './commands';
import { UserEntity } from './entities/user.entity';
import { QueryHandlers } from './queries';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UniqueEmailValidation, UserExistsValidation } from './validations';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmExModule.forCustomRepository([UsersRepository]),
  ],
  controllers: [UsersController],
  providers: [
    UniqueEmailValidation,
    UserExistsValidation,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class UsersModule {}

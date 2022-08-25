import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { UserCreateCommand } from './user-create.command';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { UserDto } from '../../dtos';
import { plainToClass } from 'class-transformer';

@CommandHandler(UserCreateCommand)
export class UserCreateHandler implements ICommandHandler<UserCreateCommand> {
  constructor(private repository: UsersRepository) {}

  async execute({ userCreate }: UserCreateCommand): Promise<UserDto> {
    try {
      const newUser = this.repository.create();
      newUser.name = userCreate.name;
      newUser.email = userCreate.email;
      newUser.password = bcrypt.hashSync(userCreate.password, 8);

      await this.repository.save(newUser);
      return plainToClass(UserDto, newUser, { excludeExtraneousValues: true });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}

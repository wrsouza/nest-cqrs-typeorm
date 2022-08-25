import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDto } from '../../dtos';
import { UsersRepository } from '../../repositories/users.repository';
import { UserUpdateCommand } from './user-update.command';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@CommandHandler(UserUpdateCommand)
export class UserUpdateHandler implements ICommandHandler<UserUpdateCommand> {
  constructor(private repository: UsersRepository) {}

  async execute({ id, userUpdate }: UserUpdateCommand): Promise<UserDto> {
    try {
      const user = await this.repository.findOneBy({ id });
      Object.keys(userUpdate).forEach((key) => {
        if (key === 'password') {
          user.password = bcrypt.hashSync(userUpdate.password, 8);
        }
        user[key] = userUpdate[key];
      });
      await this.repository.save(user);
      return plainToClass(UserDto, user, { excludeExtraneousValues: true });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}

import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { UserDestroyCommand } from './user-destroy.command';

@CommandHandler(UserDestroyCommand)
export class UserDestroyHandler implements ICommandHandler<UserDestroyCommand> {
  constructor(private repository: UsersRepository) {}

  async execute({ id }: UserDestroyCommand): Promise<void> {
    try {
      const user = await this.repository.findOneBy({ id });
      await this.repository.remove(user);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}

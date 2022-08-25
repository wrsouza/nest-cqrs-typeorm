import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../../dtos';
import { UsersRepository } from '../../repositories/users.repository';
import { UserShowQuery } from './user-show.query';

@QueryHandler(UserShowQuery)
export class UserShowHandler implements IQueryHandler<UserShowQuery> {
  constructor(private repository: UsersRepository) {}

  async execute({ id }: UserShowQuery): Promise<UserDto> {
    try {
      const user = await this.repository.findOneBy({ id });
      return plainToClass(UserDto, user, { excludeExtraneousValues: true });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}

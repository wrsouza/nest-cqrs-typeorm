import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { PaginateUserDto, UserDto } from '../../dtos';
import { UsersRepository } from '../../repositories/users.repository';
import { UserPaginateQuery } from './user-paginate.query';

@QueryHandler(UserPaginateQuery)
export class UserPaginateHandler implements IQueryHandler<UserPaginateQuery> {
  constructor(private repository: UsersRepository) {}

  async execute({ userPaginate }: UserPaginateQuery): Promise<PaginateUserDto> {
    const result = await this.repository.paginate(userPaginate);
    return {
      ...result,
      data: result.data.map((user) =>
        plainToClass(UserDto, user, {
          excludeExtraneousValues: true,
        }),
      ),
    };
  }
}

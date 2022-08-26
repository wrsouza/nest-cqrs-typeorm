import { InternalServerErrorException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import * as classTransform from 'class-transformer';
import { UserDto } from '../../../../../../src/app/users/dtos';
import {
  UserShowHandler,
  UserShowQuery,
} from '../../../../../../src/app/users/queries';
import { UsersRepository } from '../../../../../../src/app/users/repositories/users.repository';
import { expectedUser, user } from './user-show.testcases';

describe('UserPaginateHandler', () => {
  let handler: UserShowHandler;
  let repository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserShowHandler,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UserShowHandler>(UserShowHandler);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('should return an user', async () => {
      const findSpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(user);

      const plainSpy = jest.spyOn(classTransform, 'plainToClass');

      const { id } = user;
      const query = new UserShowQuery(id);
      const result = await handler.execute(query);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ id });

      const options = { excludeExtraneousValues: true };

      expect(plainSpy).toHaveBeenCalledTimes(1);
      expect(plainSpy).toHaveBeenCalledWith(UserDto, user, options);
      expect(result).toEqual(expectedUser);
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockRejectedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const { id } = user;
        const query = new UserShowQuery(id);
        await handler.execute(query);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });
});

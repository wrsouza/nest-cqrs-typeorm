import { InternalServerErrorException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import * as classTransform from 'class-transformer';
import { PaginateUserDto } from '../../../../../../src/app/users/dtos';
import {
  UserPaginateHandler,
  UserPaginateQuery,
} from '../../../../../../src/app/users/queries';
import { UsersRepository } from '../../../../../../src/app/users/repositories/users.repository';
import {
  emptyPaginateParams,
  expectedEmptyPaginate,
  expectedPaginateUser,
  mapperOptions,
  paginateUser,
} from './user-paginate.testcases';

describe('UserPaginateHandler', () => {
  let handler: UserPaginateHandler;
  let repository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserPaginateHandler,
        {
          provide: UsersRepository,
          useValue: {
            paginate: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UserPaginateHandler>(UserPaginateHandler);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('should return a paginate data with empty list', async () => {
      const paginateSpy = jest
        .spyOn(repository, 'paginate')
        .mockResolvedValueOnce(expectedEmptyPaginate);

      const plainSpy = jest.spyOn(classTransform, 'plainToClass');

      const query = new UserPaginateQuery(emptyPaginateParams);
      const result = await handler.execute(query);

      expect(paginateSpy).toHaveBeenCalledTimes(1);
      expect(paginateSpy).toHaveBeenCalledWith(emptyPaginateParams);
      expect(plainSpy).toHaveBeenCalledWith(
        PaginateUserDto,
        expectedEmptyPaginate,
        mapperOptions,
      );
      expect(result).toEqual(expectedEmptyPaginate);
    });

    it('should return a paginate data with 2 items', async () => {
      const paginateSpy = jest
        .spyOn(repository, 'paginate')
        .mockResolvedValueOnce(paginateUser);

      const plainSpy = jest.spyOn(classTransform, 'plainToClass');

      const query = new UserPaginateQuery(emptyPaginateParams);
      const result = await handler.execute(query);

      expect(paginateSpy).toHaveBeenCalledTimes(1);
      expect(paginateSpy).toHaveBeenCalledWith(emptyPaginateParams);
      expect(plainSpy).toHaveBeenCalledWith(
        PaginateUserDto,
        paginateUser,
        mapperOptions,
      );
      expect(result).toEqual(expectedPaginateUser);
      expect(result.data.length).toBe(2);
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(repository, 'paginate')
        .mockRejectedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const query = new UserPaginateQuery(emptyPaginateParams);
        await handler.execute(query);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });
});

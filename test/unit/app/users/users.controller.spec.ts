import { InternalServerErrorException } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import {
  UserCreateCommand,
  UserDestroyCommand,
  UserUpdateCommand,
} from '../../../../src/app/users/commands';
import {
  UserPaginateQuery,
  UserShowQuery,
} from '../../../../src/app/users/queries';
import { UsersController } from '../../../../src/app/users/users.controller';
import {
  createUserParams,
  deleteUserId,
  emptyPaginateParams,
  expectedEmptyPaginate,
  expectedNewUser,
  expectedPaginateUser,
  expectedUpdatedUser,
  expectedUser,
  updateUserParams,
} from './users.controller.testcases';

describe('UsersController', () => {
  let controller: UsersController;
  let queryBus: QueryBus;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [UsersController],
      providers: [],
    }).compile();

    controller = moduleRef.get<UsersController>(UsersController);
    queryBus = moduleRef.get<QueryBus>(QueryBus);
    commandBus = moduleRef.get<CommandBus>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(queryBus).toBeDefined();
    expect(commandBus).toBeDefined();
  });

  describe('index', () => {
    it('should return a paginate data with empty list', async () => {
      const queryBusSpy = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValueOnce(expectedEmptyPaginate);

      const result = await controller.index(emptyPaginateParams);

      expect(result).toBe(expectedEmptyPaginate);
      expect(queryBusSpy).toBeCalledTimes(1);
      expect(queryBusSpy).toBeCalledWith(
        new UserPaginateQuery(emptyPaginateParams),
      );
    });

    it('should return a paginate data with 2 items', async () => {
      jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValueOnce(expectedPaginateUser);

      const result = await controller.index(emptyPaginateParams);

      for (const property of Object.keys(expectedPaginateUser)) {
        expect(result).toHaveProperty(property);
      }

      expect(result.data.length).toBe(2);
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        await controller.index(emptyPaginateParams);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });

  describe('store', () => {
    it('should return a new user', async () => {
      const commandBusSpy = jest
        .spyOn(commandBus, 'execute')
        .mockResolvedValueOnce(expectedNewUser);

      const result = await controller.store(createUserParams);

      expect(result).toBe(expectedNewUser);
      expect(commandBusSpy).toBeCalledTimes(1);
      expect(commandBusSpy).toBeCalledWith(
        new UserCreateCommand(createUserParams),
      );
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(commandBus, 'execute')
        .mockResolvedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        await controller.store(createUserParams);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });

  describe('show', () => {
    it('should return an user', async () => {
      const queryBusSpy = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValueOnce(expectedUser);
      const { id } = expectedUser;
      const result = await controller.show({ id });

      expect(result).toBe(expectedUser);
      expect(queryBusSpy).toBeCalledTimes(1);
      expect(queryBusSpy).toBeCalledWith(new UserShowQuery(id));
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const { id } = expectedUser;
        await controller.show({ id });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });

  describe('update', () => {
    it('should return a user updated', async () => {
      const commandBusSpy = jest
        .spyOn(commandBus, 'execute')
        .mockResolvedValueOnce(expectedUpdatedUser);

      const { id } = expectedUpdatedUser;
      const result = await controller.update({ id }, updateUserParams);

      expect(result).toBe(expectedUpdatedUser);
      expect(commandBusSpy).toBeCalledTimes(1);
      expect(commandBusSpy).toBeCalledWith(
        new UserUpdateCommand(id, updateUserParams),
      );
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(commandBus, 'execute')
        .mockResolvedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const { id } = expectedUpdatedUser;
        await controller.update({ id }, updateUserParams);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });

  describe('destroy', () => {
    it('should delete user with id', async () => {
      const commandBusSpy = jest
        .spyOn(commandBus, 'execute')
        .mockImplementation();

      const id = deleteUserId;
      await controller.destroy({ id });

      expect(commandBusSpy).toBeCalledTimes(1);
      expect(commandBusSpy).toBeCalledWith(new UserDestroyCommand(id));
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(commandBus, 'execute')
        .mockResolvedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const id = deleteUserId;
        await controller.destroy({ id });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });
});

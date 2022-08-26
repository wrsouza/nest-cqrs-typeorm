import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as classTransform from 'class-transformer';
import {
  UserCreateCommand,
  UserCreateHandler,
} from '../../../../../../src/app/users/commands';
import { UserEntity } from '../../../../../../src/app/users/entities';
import { UsersRepository } from '../../../../../../src/app/users/repositories/users.repository';
import { createUserParams, expectedNewUser } from './user-create.testcases';
import { UserDto } from '../../../../../../src/app/users/dtos';

describe('UserCreateHandler', () => {
  let handler: UserCreateHandler;
  let repository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserCreateHandler,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UserCreateHandler>(UserCreateHandler);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('should create a new user and return UserDto', async () => {
      const user = new UserEntity();
      const repoCreateSpy = jest
        .spyOn(repository, 'create')
        .mockReturnValue(user);

      user.name = createUserParams.name;
      user.email = createUserParams.email;
      user.password = 'password_hash';

      const bcryptSpy = jest
        .spyOn(bcrypt, 'hashSync')
        .mockReturnValueOnce(user.password);

      const repoSaveSpy = jest.spyOn(repository, 'save').mockImplementation(
        (user: UserEntity) =>
          new Promise((resolve) => {
            user.id = expectedNewUser.id;
            user.createdAt = expectedNewUser.createdAt;
            user.updatedAt = expectedNewUser.createdAt;
            resolve(user);
          }),
      );

      const plainSpy = jest.spyOn(classTransform, 'plainToClass');

      const command = new UserCreateCommand(createUserParams);
      const result = await handler.execute(command);

      expect(repoCreateSpy).toHaveBeenCalledTimes(1);
      expect(bcryptSpy).toHaveBeenCalledTimes(1);
      expect(bcryptSpy).toHaveBeenCalledWith(createUserParams.password, 8);
      expect(repoSaveSpy).toHaveBeenCalledTimes(1);
      expect(repoSaveSpy).toHaveBeenCalledWith(user);

      const options = { excludeExtraneousValues: true };
      user.id = expectedNewUser.id;
      user.createdAt = expectedNewUser.createdAt;
      user.updatedAt = expectedNewUser.createdAt;

      expect(plainSpy).toHaveBeenCalledTimes(1);
      expect(plainSpy).toHaveBeenCalledWith(UserDto, user, options);
      expect(result).toEqual(expectedNewUser);
    });

    it('should throw an InternalServerError', async () => {
      const user = new UserEntity();
      jest.spyOn(repository, 'create').mockReturnValue(user);

      jest
        .spyOn(repository, 'save')
        .mockRejectedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const command = new UserCreateCommand(createUserParams);
        await handler.execute(command);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });
});

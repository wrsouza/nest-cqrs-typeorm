import { InternalServerErrorException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as classTransform from 'class-transformer';
import {
  UserUpdateCommand,
  UserUpdateHandler,
} from '../../../../../../src/app/users/commands';
import { UserDto } from '../../../../../../src/app/users/dtos';
import { UsersRepository } from '../../../../../../src/app/users/repositories/users.repository';
import {
  expectedUpdatedUser,
  updateUser,
  updateUserParams,
} from './user-update.testcases';

describe('UserUpdateHandler', () => {
  let handler: UserUpdateHandler;
  let repository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserUpdateHandler,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UserUpdateHandler>(UserUpdateHandler);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('should update a user', async () => {
      const findSpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(updateUser);

      const bcryptSpy = jest
        .spyOn(bcrypt, 'hashSync')
        .mockReturnValueOnce('updated_password_hash');

      updateUser.name = updateUserParams.name;
      updateUser.email = updateUserParams.email;
      updateUser.password = 'updated_password_hash';

      const saveSpy = jest.spyOn(repository, 'save');

      const plainSpy = jest.spyOn(classTransform, 'plainToClass');

      const { id } = updateUser;
      const command = new UserUpdateCommand(id, updateUserParams);
      const result = await handler.execute(command);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ id });
      expect(bcryptSpy).toHaveBeenCalledTimes(1);
      expect(bcryptSpy).toHaveBeenCalledWith(updateUserParams.password, 8);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(updateUser);

      const options = { excludeExtraneousValues: true };

      expect(plainSpy).toHaveBeenCalledTimes(1);
      expect(plainSpy).toHaveBeenCalledWith(UserDto, updateUser, options);
      expect(result).toEqual(expectedUpdatedUser);
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockRejectedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const { id } = updateUser;
        const command = new UserUpdateCommand(id, updateUserParams);
        await handler.execute(command);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });
});

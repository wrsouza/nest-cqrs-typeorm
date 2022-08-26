import { InternalServerErrorException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDestroyHandler } from '../../../../../../src/app/users/commands';
import { UsersRepository } from '../../../../../../src/app/users/repositories/users.repository';
import { deleteUser } from './user-destroy.testcases';

describe('UserCreateHandler', () => {
  let handler: UserDestroyHandler;
  let repository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UserDestroyHandler,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UserDestroyHandler>(UserDestroyHandler);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a user', async () => {
      const findSpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(deleteUser);

      const removeSpy = jest.spyOn(repository, 'remove').mockImplementation();

      const { id } = deleteUser;
      await handler.execute({ id });
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ id });
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).toHaveBeenCalledWith(deleteUser);
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockRejectedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const { id } = deleteUser;
        await handler.execute({ id });
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });
});

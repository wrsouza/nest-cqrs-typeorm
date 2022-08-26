import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../../../../src/app/users/repositories/users.repository';
import { UserExistsValidation } from '../../../../../src/app/users/validations';
import { userFound } from './user-exists.testcases';

describe('UserExistsValidation', () => {
  let validation: UserExistsValidation;
  let repository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserExistsValidation,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();
    validation = module.get<UserExistsValidation>(UserExistsValidation);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(validation).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if id param sent and found a user', async () => {
      const findSpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(userFound);

      const { id } = userFound;
      const result = await validation.validate(id);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ id });
      expect(result).toBe(true);
    });

    it('should return false if id param sent and not found a user', async () => {
      const findSpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(null);

      const { id } = userFound;
      const result = await validation.validate(id);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith({ id });
      expect(result).toBe(false);
    });

    it('should throw an InternalServerError', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockRejectedValueOnce(
          new InternalServerErrorException('database error message'),
        );

      try {
        const { id } = userFound;
        await validation.validate(id);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe('database error message');
      }
    });
  });

  describe('defaultMessage', () => {
    it('should return a default message validation', () => {
      const result = validation.defaultMessage();
      expect(result).toBe(`User not exists.`);
    });
  });
});

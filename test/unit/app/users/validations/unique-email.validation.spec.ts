import { Test, TestingModule } from '@nestjs/testing';
import { Not } from 'typeorm';
import { UsersRepository } from '../../../../../src/app/users/repositories/users.repository';
import { UniqueEmailValidation } from '../../../../../src/app/users/validations';
import {
  anotherUser,
  emptyValidationArguments,
  idParamValidationArguments,
  user,
} from './unique-email.testcases';

describe('UniqueEmailValidation', () => {
  let validation: UniqueEmailValidation;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        UniqueEmailValidation,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    validation = module.get<UniqueEmailValidation>(UniqueEmailValidation);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(validation).toBeDefined();
    expect(repository).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it.each([
      [
        'should return true if email not found in database',
        {
          mockValue: null,
          email: user.email,
          args: emptyValidationArguments,
          status: true,
        },
      ],
      [
        'should return false if email is found in database',
        {
          mockValue: user,
          email: user.email,
          args: emptyValidationArguments,
          status: false,
        },
      ],
      [
        'should return true if email sent has belongs to user when pass id param',
        {
          mockValue: null,
          email: user.email,
          args: idParamValidationArguments,
          status: true,
        },
      ],
      [
        'should return false if email sent has not belongs to user when pass id param',
        {
          mockValue: anotherUser,
          email: 'ervin.howell@storm.com',
          args: idParamValidationArguments,
          status: false,
        },
      ],
    ])('%s', async (_, { mockValue, email, args, status }) => {
      const findSpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(mockValue);

      const result = await validation.validate(email, args);
      expect(findSpy).toHaveBeenCalledTimes(1);
      const { context } = args.object;
      const where = { email };
      if (context.params?.id) {
        where['id'] = Not(context.params.id);
      }
      expect(findSpy).toHaveBeenCalledWith(where);
      expect(result).toBe(status);
    });
  });

  describe('defaultMessage', () => {
    it('should return a default message validation', () => {
      const result = validation.defaultMessage();
      expect(result).toBe(`Email already exists.`);
    });
  });
});

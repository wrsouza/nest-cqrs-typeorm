import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as defaults from 'superagent-defaults';
import { AppModule } from '../../../src/app.module';
import { UsersRepository } from '../../../src/app/users/repositories/users.repository';
import { makeUserList } from './users.testcases';
import { useContainer } from 'class-validator';
import { ContextInterceptor } from '../../../src/infra/interceptors/context.interceptor';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let repository: UsersRepository;
  let request;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);

    app = module.createNestApplication({ logger: false });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalInterceptors(new ContextInterceptor());
    await app.init();

    request = defaults(supertest.agent(app.getHttpServer()));
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await repository.remove(await repository.find());
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(repository).toBeDefined();
    expect(request).toBeDefined();
  });

  describe('show (GET)', () => {
    it('should return user data', async () => {
      const userData = makeUserList(1)[0];
      await repository.save(userData);

      const response = await request.get(`/users/${userData.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          createdAt: userData.createdAt.toISOString(),
        }),
      );
    });

    it('should return validation error if user not exists', async () => {
      const userData = makeUserList(1)[0];
      const response = await request.get(`/users/${userData.id}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.message.length).toBe(1);
      expect(response.body.message).toEqual(['User not exists.']);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should throw a InternalServerError', async () => {
      const userData = makeUserList(1)[0];
      await repository.save(userData);

      jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(new Error());

      const response = await request.get(`/users/${userData.id}`);
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toEqual('Internal Server Error');
    });
  });
});

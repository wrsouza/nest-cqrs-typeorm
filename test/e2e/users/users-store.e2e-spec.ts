import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as defaults from 'superagent-defaults';
import { AppModule } from '../../../src/app.module';
import { UsersRepository } from '../../../src/app/users/repositories/users.repository';
import { makeUserList } from './users.testcases';
import { useContainer } from 'class-validator';
import { ContextInterceptor } from '../../../src/infra/interceptors/context.interceptor';
import * as bcrypt from 'bcrypt';

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

  describe('store (POST)', () => {
    it('should create a new user', async () => {
      const userData = makeUserList(1).map((item) => ({
        name: item.name,
        email: item.email,
        password: item.password,
      }))[0];

      const response = await request.post(`/users`).send(userData);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: userData.name,
          email: userData.email,
        }),
      );

      const { email } = userData;
      const userCreated = await repository.findOneBy({ email });
      expect(userCreated).toBeTruthy();
      expect(userCreated).toEqual(
        expect.objectContaining({
          name: userData.name,
        }),
      );
      expect(bcrypt.compareSync(userData.password, userCreated.password)).toBe(
        true,
      );
    });

    it('should return validation error if not sent a param', async () => {
      const response = await request.post(`/users`).send();
      expect(response.statusCode).toBe(400);
      expect(response.body.message.length).toBe(6);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'name must be longer than or equal to 3 characters',
          'name must be a string',
          'email must be an email',
          'password must be shorter than or equal to 20 characters',
          'password must be longer than or equal to 8 characters',
          'password must be a string',
        ]),
      );
      expect(response.body.error).toBe('Bad Request');
    });

    it('should return email exists', async () => {
      const userData = makeUserList(1)[0];
      await repository.save(userData);

      const response = await request.post(`/users`).send(userData);
      expect(response.statusCode).toBe(400);
      expect(response.body.message.length).toBe(1);
      expect(response.body.message).toEqual(['Email already exists.']);
      expect(response.body.error).toBe('Bad Request');
    });

    it('should throw a InternalServerError', async () => {
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error());

      const userData = makeUserList(1).map((item) => ({
        name: item.name,
        email: item.email,
        password: item.password,
      }))[0];

      const response = await request.post(`/users`).send(userData);
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toEqual('Internal Server Error');
    });
  });
});

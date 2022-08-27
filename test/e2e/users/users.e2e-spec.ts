import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as defaults from 'superagent-defaults';
import { AppModule } from '../../../src/app.module';
import { UsersRepository } from '../../../src/app/users/repositories/users.repository';
import { makeUserList } from './users.testcases';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let repository: UsersRepository;
  let request;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);

    app = module.createNestApplication();
    await app.init();

    request = defaults(supertest.agent(app.getHttpServer()));
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('index (GET)', () => {
    it('should return a success paginate user empty list', async () => {
      const response = await request.get('/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.total).toBe(0);
    });

    it('should return paginate user list with default filters', async () => {
      const userList = makeUserList(45);
      await repository.save(userList);

      const response = await request.get('/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.total).toBe(45);
    });
  });
});

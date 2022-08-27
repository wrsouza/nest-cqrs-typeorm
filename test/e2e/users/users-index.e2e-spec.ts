import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import * as defaults from 'superagent-defaults';
import { AppModule } from '../../../src/app.module';
import { UsersRepository } from '../../../src/app/users/repositories/users.repository';
import { makeUserList } from './users.testcases';
import * as OrderBy from 'lodash.orderby';
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

  describe('index (GET)', () => {
    it('should return paginate with empty user list', async () => {
      const response = await request.get('/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.total).toBe(0);
    });

    it('should return paginate with users list and default filters', async () => {
      const userList = makeUserList(45);
      await repository.save(userList);

      const response = await request.get('/users');
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBe(15);
      expect(response.body.total).toBe(45);
      expect(response.body.page).toBe(1);
      expect(response.body.perPage).toBe(15);
    });

    it('should return page 2 of user list with 20 perPage', async () => {
      const userList = makeUserList(60);
      await repository.save(userList);

      const response = await request.get('/users?page=2&perPage=20');
      expect(response.body.data.length).toBe(20);
      expect(response.body.page).toBe(2);
    });

    it('should return user list with sort by name and default perPage', async () => {
      const total = 50;
      const userList = makeUserList(total);
      await repository.save(userList);

      const orderUserList = OrderBy(userList, ['name'], ['asc']);
      const defaultPerPage = 15;
      const defaultPage = 1;
      const startList = (defaultPage - 1) * defaultPerPage;

      const response = await request.get('/users?sort=name');
      expect(response.body.data.length).toBe(defaultPerPage);
      expect(response.body.data).toEqual(
        expect.arrayContaining(
          orderUserList.slice(startList, defaultPerPage).map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            createdAt: item.createdAt.toISOString(),
          })),
        ),
      );
      expect(response.body.page).toBe(defaultPage);
    });

    it('should return the last page of user list with sort by email desc', async () => {
      const total = 60;
      const userList = makeUserList(total);
      await repository.save(userList);

      const orderUserList = OrderBy(userList, ['email'], ['desc']);
      const defaultPerPage = 15;
      const totalPages =
        total % defaultPerPage == 0
          ? total / defaultPerPage
          : Math.floor(total / defaultPerPage) + 1;
      const startList = (totalPages - 1) * defaultPerPage;

      const response = await request.get('/users?sort=-email&page=4');
      expect(response.body.data.length).toBe(defaultPerPage);
      expect(response.body.data).toEqual(
        expect.arrayContaining(
          orderUserList.slice(startList, total).map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            createdAt: item.createdAt.toISOString(),
          })),
        ),
      );
      expect(response.body.page).toBe(totalPages);
    });

    it('should return user list with search by name', async () => {
      const total = 60;
      const userList = makeUserList(total);
      await repository.save(userList);

      const search = userList[0].name;
      const filteredList = userList
        .filter((item) => item.name === search)
        .map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          createdAt: item.createdAt.toISOString(),
        }));
      const response = await request.get(`/users?search=${search}&type=name`);
      expect(response.body.data).toEqual(expect.arrayContaining(filteredList));
      expect(response.body.total).toBe(filteredList.length);
    });

    it('should throw a InternalServerError', async () => {
      jest.spyOn(repository, 'findAndCount').mockRejectedValueOnce(new Error());

      const response = await request.get(`/users`);
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toEqual('Internal server error');
    });
  });
});

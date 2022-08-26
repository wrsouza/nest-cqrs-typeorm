import { UserEntity } from '../../../../../../src/app/users/entities';
import { UserPaginateRequest } from '../../../../../../src/app/users/requests';

export const paginateUserParams = {
  search: '',
  type: '',
  page: 1,
  perPage: 15,
  sort: '-id',
};

export const emptyPaginateParams = {} as UserPaginateRequest;

export const expectedEmptyPaginate = {
  data: [],
  page: 1,
  perPage: 15,
  total: 0,
};

const userOne = new UserEntity();
userOne.id = '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b';
userOne.name = 'Leanne Graham';
userOne.email = 'leanne.graham@april.biz';
userOne.password = 'password_hash';
userOne.createdAt = new Date('2022-08-25T04:35:22.247Z');
userOne.updatedAt = new Date('2022-08-25T04:35:22.247Z');
const userTwo = new UserEntity();
userTwo.id = 'e91afb91-0a64-46f8-885a-919328b95b97';
userTwo.name = 'Ervin Howell';
userTwo.email = 'ervin.howell@storm.com';
userTwo.password = 'password_hash';
userTwo.createdAt = new Date('2022-08-25T04:55:34.519Z');
userTwo.updatedAt = new Date('2022-08-25T04:55:34.519Z');

export const paginateUser = {
  data: [userOne, userTwo],
  search: undefined,
  type: undefined,
  sort: '-id',
  page: 1,
  perPage: 15,
  total: 2,
};

export const expectedPaginateUser = {
  data: [
    {
      id: '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b',
      name: 'Leanne Graham',
      email: 'leanne.graham@april.biz',
      createdAt: new Date('2022-08-25T04:35:22.247Z'),
    },
    {
      id: 'e91afb91-0a64-46f8-885a-919328b95b97',
      name: 'Ervin Howell',
      email: 'ervin.howell@storm.com',
      createdAt: new Date('2022-08-25T04:55:34.519Z'),
    },
  ],
  sort: '-id',
  page: 1,
  perPage: 15,
  total: 2,
};

export const mapperOptions = { excludeExtraneousValues: true };

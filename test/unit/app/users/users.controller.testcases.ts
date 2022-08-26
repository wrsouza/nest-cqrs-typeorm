import { UserPaginateRequest } from '../../../../src/app/users/requests';

export const emptyPaginateParams = {} as UserPaginateRequest;

export const expectedEmptyPaginate = {
  data: [],
  page: 1,
  perPage: 15,
  total: 0,
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

export const createUserParams = {
  name: 'Leanne Graham',
  email: 'leanne.graham@april.biz',
  password: '12345678',
};

export const expectedNewUser = {
  id: '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b',
  name: 'Leanne Graham',
  email: 'leanne.graham@april.biz',
  createdAt: new Date('2022-08-25T04:35:22.247Z'),
};

export const expectedUser = {
  id: 'e91afb91-0a64-46f8-885a-919328b95b97',
  name: 'Ervin Howell',
  email: 'ervin.howell@storm.com',
  createdAt: new Date('2022-08-25T04:55:34.519Z'),
};

export const updateUserParams = {
  name: 'Leanne Graham',
  email: 'leanne.graham@april.biz',
  password: '12345678',
};

export const expectedUpdatedUser = {
  id: '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b',
  name: 'Leanne Graham',
  email: 'leanne.graham@april.biz',
  createdAt: new Date('2022-08-25T04:35:22.247Z'),
};

export const deleteUserId = 'e91afb91-0a64-46f8-885a-919328b95b97';

import { ValidationArguments } from 'class-validator';
import { UserEntity } from '../../../../../src/app/users/entities';

export const user = new UserEntity();
user.id = '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b';
user.name = 'Leanne Graham';
user.email = 'leanne.graham@april.biz';
user.createdAt = new Date('2022-08-25T04:35:22.247Z');
user.updatedAt = new Date('2022-08-25T04:35:22.247Z');

export const anotherUser = new UserEntity();
anotherUser.id = 'e91afb91-0a64-46f8-885a-919328b95b97';
anotherUser.name = 'Ervin Howell';
anotherUser.email = 'ervin.howell@storm.com';
anotherUser.createdAt = new Date('2022-08-25T04:35:22.247Z');
anotherUser.updatedAt = new Date('2022-08-25T04:35:22.247Z');

export const emptyValidationArguments: ValidationArgs = {
  value: '',
  constraints: [],
  targetName: '',
  property: '',
  object: {
    context: {
      params: {},
      query: {},
      user: {},
    },
  },
};

interface ValidationArgs extends ValidationArguments {
  object: ObjectValidationArgs;
}

interface ObjectValidationArgs {
  context: {
    params: {
      id?: string;
    };
    query: any;
    user: any;
  };
}

export const idParamValidationArguments: ValidationArgs = {
  value: '',
  constraints: [],
  targetName: '',
  property: '',
  object: {
    context: {
      params: {
        id: '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b',
      },
      query: {},
      user: {},
    },
  },
};

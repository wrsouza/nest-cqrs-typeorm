import { UserEntity } from '../../../../../../src/app/users/entities';

export const user = new UserEntity();
user.id = '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b';
user.name = 'Leanne Graham';
user.email = 'leanne.graham@april.biz';
user.createdAt = new Date('2022-08-25T04:35:22.247Z');
user.updatedAt = new Date('2022-08-25T04:35:22.247Z');

export const expectedUser = {
  id: '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b',
  name: 'Leanne Graham',
  email: 'leanne.graham@april.biz',
  createdAt: new Date('2022-08-25T04:35:22.247Z'),
};

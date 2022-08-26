import { UserEntity } from '../../../../../../src/app/users/entities';

export const updateUserParams = {
  name: 'Leanne Graham2',
  email: 'leanne.graham2@april.biz',
  password: '12345678',
};

export const updateUser = new UserEntity();
updateUser.id = '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b';
updateUser.name = 'Leanne Graham';
updateUser.email = 'leanne.graham@april.biz';
updateUser.createdAt = new Date('2022-08-25T04:35:22.247Z');
updateUser.updatedAt = new Date('2022-08-25T04:35:22.247Z');

export const expectedUpdatedUser = {
  id: '806b7cb1-8cb3-4609-805b-6e4fa5e6f93b',
  name: 'Leanne Graham2',
  email: 'leanne.graham2@april.biz',
  createdAt: new Date('2022-08-25T04:35:22.247Z'),
};

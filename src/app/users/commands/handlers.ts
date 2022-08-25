import { UserCreateHandler } from './user-create/user-create.handler';
import { UserDestroyHandler } from './user-destroy/user-destroy.handler';
import { UserUpdateHandler } from './user-update/user-update.handler';

export const CommandHandlers = [
  UserCreateHandler,
  UserUpdateHandler,
  UserDestroyHandler,
];

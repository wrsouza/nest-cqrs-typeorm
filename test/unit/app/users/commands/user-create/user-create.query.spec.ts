import { UserCreateCommand } from '../../../../../../src/app/users/commands';
import { createUserParams } from './user-create.testcases';

describe('UserCreateCommand', () => {
  it('should create an UserCreateCommand instance', () => {
    const command = new UserCreateCommand(createUserParams);
    expect(command).toBeInstanceOf(UserCreateCommand);
  });
});

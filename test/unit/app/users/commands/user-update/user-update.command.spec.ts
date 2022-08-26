import { UserUpdateCommand } from '../../../../../../src/app/users/commands';
import { updateUserParams, expectedUpdatedUser } from './user-update.testcases';

describe('UserUpdateCommand', () => {
  it('should create an UserUpdateCommand instance', () => {
    const command = new UserUpdateCommand(
      expectedUpdatedUser.id,
      updateUserParams,
    );
    expect(command).toBeInstanceOf(UserUpdateCommand);
  });
});

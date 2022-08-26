import { UserDestroyCommand } from '../../../../../../src/app/users/commands';
import { deleteUser } from './user-destroy.testcases';

describe('UserDestroyCommand', () => {
  it('should create an UserCreateCommand instance', () => {
    const command = new UserDestroyCommand(deleteUser.id);
    expect(command).toBeInstanceOf(UserDestroyCommand);
  });
});

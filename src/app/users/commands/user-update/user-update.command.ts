import { UserUpdateRequest } from '../../requests';

export class UserUpdateCommand {
  constructor(
    public readonly id: string,
    public readonly userUpdate: UserUpdateRequest,
  ) {}
}

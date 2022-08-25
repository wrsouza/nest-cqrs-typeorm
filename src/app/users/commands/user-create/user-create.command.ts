import { UserCreateRequest } from '../../requests';

export class UserCreateCommand {
  constructor(public readonly userCreate: UserCreateRequest) {}
}

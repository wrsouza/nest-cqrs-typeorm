import { UserPaginateRequest } from '../../requests';

export class UserPaginateQuery {
  constructor(public readonly userPaginate: UserPaginateRequest) {}
}

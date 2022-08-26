import { UserPaginateQuery } from '../../../../../../src/app/users/queries';
import { paginateUserParams } from './user-paginate.testcases';

describe('UserPaginateQuery', () => {
  it('should create an UserPaginateQuery instance', () => {
    const query = new UserPaginateQuery(paginateUserParams);
    expect(query).toBeInstanceOf(UserPaginateQuery);
  });
});

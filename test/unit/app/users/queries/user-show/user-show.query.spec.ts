import { UserShowQuery } from '../../../../../../src/app/users/queries';
import { expectedUser } from './user-show.testcases';

describe('UserShowQuery', () => {
  it('should create an UserShowQuery instance', () => {
    const query = new UserShowQuery(expectedUser.id);
    expect(query).toBeInstanceOf(UserShowQuery);
  });
});

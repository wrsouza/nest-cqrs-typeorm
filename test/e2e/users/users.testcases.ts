import { faker } from '@faker-js/faker';

export const makeUserList = (total: number) => {
  const list = [];
  for (let i = 0; i < total; i++) {
    const randomDate = new Date(
      faker.date.between(
        '2022-06-01T00:00:00.000Z',
        '2022-07-31T00:00:00.000Z',
      ),
    );
    list.push({
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(8),
      createdAt: randomDate,
      createAt: randomDate,
    });
  }
  return list;
};

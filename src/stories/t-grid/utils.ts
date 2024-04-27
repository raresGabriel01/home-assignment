import { faker } from '@faker-js/faker';

export type MockUser = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  points: number;
};

export const generateMockUser = (): MockUser => ({
  id: faker.string.nanoid(10),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.imei(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  points: faker.number.int({ min: -100, max: 100 }),
});

export const MOCK_DATA: MockUser[] = faker.helpers.multiple(generateMockUser, {
  count: 10,
});

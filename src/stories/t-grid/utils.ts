import { faker } from '@faker-js/faker';
import { concatMap, delay, from, of } from 'rxjs';

export type MockUser = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  points: number;
};

export type ColumnData<T> = {
  name: string;
  property: keyof T;
  sortable: boolean;
};

export const createMockUser = (): MockUser => ({
  id: faker.string.nanoid(10),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.imei(),
  email: faker.internet.email(),
  address: faker.location.streetAddress(),
  points: faker.number.int({ min: -100, max: 100 }),
});

export const MOCK_DATA: MockUser[] = faker.helpers.multiple(createMockUser, {
  count: 20,
});

export const createMockDataObserver = () => {
  const dataObservable = of(
    faker.helpers.multiple(createMockUser, { count: 5 }),
    faker.helpers.multiple(createMockUser, { count: 5 }),
    faker.helpers.multiple(createMockUser, { count: 5 }),
  );
  return dataObservable.pipe(concatMap((item) => of(item).pipe(delay(2500))));
};

import { StoryObj, moduleMetadata, type Meta } from '@storybook/angular';
import {
  PaginationChangeEvent,
  SortChangeEvent,
  TGridComponent,
} from '../../app/components/t-grid/t-grid.component';
import { MOCK_DATA, MockUser } from './utils';
import { TColumnComponent } from '../../app/components/t-column/t-column.component';
import { CommonModule } from '@angular/common';

const meta: Meta<TGridComponent<MockUser>> = {
  title: 'Assignment/t-grid',
  component: TGridComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TColumnComponent],
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
      logEvent: (e: SortChangeEvent | PaginationChangeEvent) => console.log(e),
    },
    template: `
      <t-grid [data]="data" [sortable]="sortable" [pageSize]="pageSize" (sortChange)="logEvent($event)" (paginationChange)="logEvent($event)">
        <t-column [name]="'ID'" [property]="'id'" [sortable]="false"></t-column>
        <t-column [name]="'First Name'" [property]="'firstName'" [sortable]="true"></t-column>
        <t-column [name]="'Last Name'" [property]="'lastName'" [sortable]="true"></t-column>
        <t-column [name]="'Points'" [property]="'points'" [sortable]="true"></t-column>
        <t-column [name]="'Phone Number'" [property]="'phoneNumber'" [sortable]="false"></t-column>
      </t-grid>
    `,
  }),
  tags: ['autodocs'],
  argTypes: {
    data: {
      description:
        'A data array to be displayed within the table. \
      Generic type: `T[] | Observable<T[]>` \
      The columns are determined from `T` as `keyof T` by using the \
      `<t-column [name]="columnName" [property]="propertyName">` via content projection',
      name: 'data',
    },
  },
};

export default meta;
type Story = StoryObj<
  TGridComponent<MockUser> & { x: (e: SortChangeEvent) => void }
>;

export const SortableGrid: Story = {
  args: {
    data: MOCK_DATA,
    sortable: true,
    pageSize: null,
  },
};

export const NonSortableGrid: Story = {
  args: {
    data: MOCK_DATA,
    sortable: false,
    pageSize: null,
  },
};

export const PaginatedGrid: Story = {
  args: {
    data: MOCK_DATA,
    sortable: false,
    pageSize: 2,
  },
};

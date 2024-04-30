import { StoryObj, moduleMetadata, type Meta } from '@storybook/angular';
import {
  PaginationChangeEvent,
  SortChangeEvent,
  TGridComponent,
} from '../../app/components/t-grid/t-grid.component';
import { createMockData, MockUser, createMockDataObservable } from './utils';
import { TColumnComponent } from '../../app/components/t-column/t-column.component';
import { CommonModule } from '@angular/common';

const COMMON_TEMPLATE = `
<t-grid 
  [data]="data" 
  [sortable]="sortable" 
  [pageSize]="pageSize" 
  (sortChange)="handleSortChange($event)" 
  (paginationChange)="handlePaginationChange($event)"
>
  <t-column [name]="'ID'" [property]="'id'" [sortable]="false"></t-column>
  <t-column [name]="'First Name'" [property]="'firstName'" [sortable]="true"></t-column>
  <t-column [name]="'Last Name'" [property]="'lastName'" [sortable]="true"></t-column>
  <t-column [name]="'Points'" [property]="'points'" [sortable]="true"></t-column>
  <t-column [name]="'Phone Number'" [property]="'phoneNumber'" [sortable]="false"></t-column>
</t-grid>
`;

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
      handleSortChange: (e: SortChangeEvent) => console.log(e),
      handlePaginationChange: (e: PaginationChangeEvent) => console.log(e),
    },
    template: COMMON_TEMPLATE,
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
    sortable: {
      description:
        'Indicated the capability of the table to sort via a sortable column',
      name: 'sortable',
    },
    pageSize: {
      description:
        'Indicates the size of a page. In case it is `null`, there is no pagination',
      name: 'pageSize',
    },
    sortChange: {
      description:
        'Event emitted every time there is a change in sorting (sorting direction or criteria)',
      name: 'sortChange',
    },
    paginationChange: {
      description:
        'Event emitted every time there is a change in pagination (page size or current page)',
      name: 'paginationChange',
    },
  },
};

export default meta;
type Story = StoryObj<TGridComponent<MockUser>>;

export const SortableNonPaginated: Story = {
  args: {
    data: createMockData(30),
    sortable: true,
    pageSize: null,
  },
};

export const NonSortableNonPaginated: Story = {
  args: {
    data: createMockData(30),
    sortable: false,
    pageSize: null,
  },
};

export const NonSortablePaginated: Story = {
  args: {
    data: createMockData(30),
    sortable: false,
    pageSize: 8,
  },
};

export const SortablePaginated: Story = {
  args: {
    data: createMockData(30),
    sortable: true,
    pageSize: 8,
  },
};

export const LargeDataSet: Story = {
  args: {
    data: createMockData(2000),
    sortable: false,
    pageSize: null,
  },
};

export const PaginatedAsyncLoadingWithDelayBetweenChunks: Story = {
  args: {
    data: createMockDataObservable(20),
    sortable: true,
    pageSize: 10,
  },
  render: (args) => ({
    props: {
      ...args,
      handleSortChange: (event: SortChangeEvent) => console.log(event),
      handlePaginationChange: (event: PaginationChangeEvent) =>
        console.log(event),
    },
    template: COMMON_TEMPLATE,
  }),
};

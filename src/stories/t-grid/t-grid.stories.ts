import { StoryFn, moduleMetadata, type Meta } from '@storybook/angular';
import { TGridComponent } from '../../app/components/t-grid/t-grid.component';
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

const Template: StoryFn<TGridComponent<MockUser>> = (
  args: TGridComponent<MockUser>,
) => ({
  props: args,
  template: `
    <t-grid [data]="data">
    </t-grid>
  `,
});

export const Example = Template.bind({});
Example.args = {
  data: MOCK_DATA,
  columns: [
    {
      name: 'ID',
      property: 'id',
    },
    {
      name: 'First name',
      property: 'firstName',
    },
    {
      name: 'Last name',
      property: 'lastName',
    },
    {
      name: 'Points',
      property: 'points',
    },
    {
      name: 'Phone Number',
      property: 'phoneNumber',
    },
    {
      name: 'E-mail address',
      property: 'email',
    },
    {
      name: 'Address',
      property: 'address',
    },
  ],
};

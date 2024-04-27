import { StoryFn, type Meta } from '@storybook/angular';
import { TGridComponent } from '../../app/components/t-grid/t-grid.component';

const meta: Meta<TGridComponent> = {
  title: 'Assignment/t-grid',
  component: TGridComponent,
  tags: ['autodocs'],
};

export default meta;

export const Basic: StoryFn<TGridComponent> = (args: TGridComponent) => ({
  props: args,
  template: `
        <t-grid></t-grid>
    `,
});
Basic.args = {};

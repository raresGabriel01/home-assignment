import { StoryObj, moduleMetadata, type Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { TProgressComponent } from '../../app/components/t-progress/t-progress.component';

const meta: Meta<TProgressComponent> = {
  title: 'Assignment/t-progress',
  component: TProgressComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
      logEvent: () => console.log('t-progress completed!'),
    },
    template: `
      <t-progress 
        [radius]="radius" 
        [progress]="progress" 
        [color]="color"
        (complete)="logEvent()"
      >
      </t-progress>
    `,
  }),
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TProgressComponent>;
export const Default: Story = {
  args: {
    radius: 70,
    color: 'green',
    progress: 50,
  },
};

export const SmallRadius: Story = {
  args: {
    radius: 50,
    color: 'blue',
    progress: 25,
  },
};

export const BigRadius: Story = {
  args: {
    radius: 200,
    color: 'purple',
    progress: 63,
  },
};

export const FullProgress: Story = {
  args: {
    radius: 75,
    color: 'darkgreen',
    progress: 100,
  },
};

export const SmallProgress: Story = {
  args: {
    radius: 75,
    color: 'red',
    progress: 2,
  },
};

export const VerySmallRadius: Story = {
  args: {
    radius: 30,
    color: 'blue',
    progress: 70,
  },
};

export const Over100Progress: Story = {
  args: {
    radius: 70,
    color: 'blue',
    progress: 120,
  },
};

export const NegativeProgress: Story = {
  args: {
    radius: 70,
    color: 'pink',
    progress: -50,
  },
};

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
  SimpleChanges,
} from '@angular/core';

type Point = {
  x: number;
  y: number;
};

export const RADIUS_ERROR_MESSAGE = 't-progress radius value is less than 50';
export const PROGRESS_ERROR_MESSAGE =
  't-progress progress value is outside of the [0, 100] interval';

@Component({
  selector: 't-progress',
  standalone: true,
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './t-progress.component.html',
  styleUrl: './t-progress.component.scss',
})
export class TProgressComponent {
  @Input() radius: number;
  @Input() progress: number;
  @Input() color: string;
  @Output() complete = new EventEmitter<void>();

  // A safety margin proportional to the radius so that the circle stroke does not overflow outside the svg element.
  margin: number;
  public readonly MINIMUM_RADIUS: number = 50;
  public readonly MINIMUM_PROGRESS: number = 0;
  public readonly MAXIMUM_PROGRESS: number = 100;

  //IMPORTANT NOTE: while running in storybook, the errors will be thrown twice (does not reproduce while running with `ng serve`)
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['radius'].currentValue < this.MINIMUM_RADIUS) {
      throw new Error(RADIUS_ERROR_MESSAGE);
    }

    if (
      simpleChanges['progress'].currentValue < this.MINIMUM_PROGRESS ||
      simpleChanges['progress'].currentValue > this.MAXIMUM_PROGRESS
    ) {
      throw new Error(PROGRESS_ERROR_MESSAGE);
    }
  }

  ngOnInit() {
    this.margin = 0.1 * this.radius;
  }

  ngAfterViewInit() {
    if (this.progress === this.MAXIMUM_PROGRESS) {
      this.complete.emit();
    }
  }

  getPathString() {
    const centerPoint: Point = {
      x: this.radius + this.margin,
      y: this.radius + this.margin,
    };

    // Point at the top of the circle.
    const startPoint: Point = {
      x: this.radius + this.margin,
      y: this.margin,
    };

    // The angle describing the circle arc - directly proportional to the progress.
    const arcAngle = (2 * Math.PI * this.progress) / 100;

    // Angle measured against the Ox axis.
    const referenceAngle = Math.PI / 2 - arcAngle;

    // End point of circle arc.
    const endPoint: Point = {
      x: centerPoint.x + this.radius * Math.cos(referenceAngle),
      y: centerPoint.y - this.radius * Math.sin(referenceAngle),
    };

    const largeArcFlag = this.progress >= 50 ? 1 : 0;

    return `M ${startPoint.x}, ${startPoint.y} A ${this.radius}, ${this.radius}, 0 ${largeArcFlag} 1 ${endPoint.x}, ${endPoint.y}`;
  }
}

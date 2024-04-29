import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from '@angular/core';

type Point = {
  x: number;
  y: number;
};

@Component({
  selector: 't-progress',
  standalone: true,
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './t-progress.component.html',
  styleUrl: './t-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TProgressComponent {
  @Input() radius: number;
  @Input() progress: number;
  @Input() color: string;
  @Output() complete = new EventEmitter<void>();

  renderRadius: number;
  renderProgress: number;
  // A safety margin proportional to the radius so that the circle stroke does not overflow outside the svg element.
  margin: number;

  public readonly MINIMUM_RADIUS: number = 50;
  public readonly MINIMUM_PROGRESS: number = 0;
  public readonly MAXIMUM_PROGRESS: number = 100;

  ngOnChanges() {
    this.renderRadius = Math.max(this.MINIMUM_RADIUS, this.radius);
    this.renderProgress = Math.max(
      this.MINIMUM_PROGRESS,
      Math.min(this.MAXIMUM_PROGRESS, this.progress),
    );
    this.margin = 0.1 * this.renderRadius;
  }

  ngAfterViewInit() {
    if (this.renderProgress === this.MAXIMUM_PROGRESS) {
      this.complete.emit();
    }
  }

  getPathString() {
    const centerPoint: Point = {
      x: this.renderRadius + this.margin,
      y: this.renderRadius + this.margin,
    };

    // Point at the top of the circle.
    const startPoint: Point = {
      x: this.renderRadius + this.margin,
      y: this.margin,
    };

    // The angle describing the circle arc - directly proportional to the progress.
    const arcAngle = (2 * Math.PI * this.renderProgress) / 100;

    // Angle measured against the Ox axis.
    const referenceAngle = Math.PI / 2 - arcAngle;

    // End point of circle arc.
    const endPoint: Point = {
      x: centerPoint.x + this.renderRadius * Math.cos(referenceAngle),
      y: centerPoint.y - this.renderRadius * Math.sin(referenceAngle),
    };

    const largeArcFlag = this.renderProgress >= 50 ? 1 : 0;

    return `M ${startPoint.x}, ${startPoint.y} A ${this.renderRadius}, ${this.renderRadius}, 0 ${largeArcFlag} 1 ${endPoint.x}, ${endPoint.y}`;
  }
}

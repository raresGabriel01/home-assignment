import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { Observable } from 'rxjs';
import { TColumnComponent } from '../t-column/t-column.component';
import { CommonModule } from '@angular/common';

export enum Direction {
  NONE = 'none',
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export type SortChangeEvent = {
  columnName: string;
  direction: Direction;
};

@Component({
  selector: 't-grid',
  standalone: true,
  imports: [CommonModule, TColumnComponent],
  templateUrl: './t-grid.component.html',
  styleUrl: './t-grid.component.scss',
})
export class TGridComponent<T> {
  @Input() data: T[] | Observable<T[]>;
  @Input() sortable: boolean;
  @Output() sortChange = new EventEmitter<SortChangeEvent>();
  @ContentChildren(TColumnComponent) columnQuery: QueryList<
    TColumnComponent<T>
  >;

  originalData: T[] = [];
  displayData: T[] = [];
  columns: TColumnComponent<T>[];
  sortProperty?: keyof T;
  direction?: Direction = Direction.NONE;

  ngOnInit() {
    if (this.data instanceof Observable) {
      this.data.subscribe((data) => {
        this.displayData = [...data];
        this.originalData = [...data];
      });
    } else {
      this.displayData = [...this.data];
      this.originalData = [...this.data];
    }
  }

  ngAfterContentInit() {
    this.columns = this.columnQuery.map((column) => ({ ...column }));
  }

  changeDirection() {
    if (this.direction === Direction.NONE) {
      this.direction = Direction.ASCENDING;
    } else if (this.direction === Direction.ASCENDING) {
      this.direction = Direction.DESCENDING;
    } else {
      this.direction = Direction.NONE;
    }

    this.sortChange.emit({
      columnName: this.sortProperty as string,
      direction: this.direction,
    });
  }

  sortData() {
    if (this.direction === Direction.NONE) {
      this.displayData = [...this.originalData];
    } else {
      this.displayData.sort((a, b) => {
        const valueA = a[this.sortProperty as keyof T];
        const valueB = b[this.sortProperty as keyof T];

        if (valueA < valueB)
          return this.direction === Direction.ASCENDING ? -1 : 1;
        if (valueA > valueB)
          return this.direction === Direction.ASCENDING ? 1 : -1;
        return 0;
      });
    }
  }

  handleColumnClick(column: TColumnComponent<T>) {
    if (!this.sortable || !column.sortable) {
      return;
    }

    if (this.sortProperty !== column.property) {
      this.sortProperty = column.property;
      this.direction = Direction.NONE;
    }

    this.changeDirection();
    this.sortData();
  }
}

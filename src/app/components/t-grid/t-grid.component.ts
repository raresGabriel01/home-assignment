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

export type PaginationChangeEvent = {
  currentPage: number;
  pageSize: number | null;
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
  @Input() pageSize: number | null;
  @Output() sortChange = new EventEmitter<SortChangeEvent>();
  @Output() paginationChange = new EventEmitter<PaginationChangeEvent>();
  @ContentChildren(TColumnComponent) columnQuery: QueryList<
    TColumnComponent<T>
  >;

  originalData: T[] = [];
  sortedData: T[] = [];
  displayData: T[] = [];
  currentPage: number = 1;
  sortProperty?: keyof T;
  direction: Direction = Direction.NONE;
  isLoading: boolean = false;

  ngOnInit() {
    if (this.data instanceof Observable) {
      this.isLoading = true;
      this.data.subscribe({
        next: (nextData) => {
          this.originalData = [...this.originalData, ...nextData];
          // The reason that I am doing it here instead of on the `complete` method
          // Is that maybe the pageSize is large/null and it need to constantly update the displayedData
          this.displayData = this.originalData.slice(
            0,
            this.pageSize || this.originalData.length,
          );
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.isLoading = false;
          this.sortedData = [...this.originalData];
        },
      });
    } else {
      this.displayData = this.data.slice(0, this.pageSize || this.data.length);
      this.originalData = [...this.data];
      this.sortedData = [...this.data];
    }
  }

  updatePageNumber(pageNumber: number) {
    if (!this.pageSize) {
      return;
    }

    if (
      pageNumber < 1 ||
      pageNumber > Math.ceil(this.originalData.length / this.pageSize)
    ) {
      return;
    }

    this.currentPage = pageNumber;
    this.updateDisplayData();
    this.paginationChange.emit({
      pageSize: this.pageSize,
      currentPage: this.currentPage,
    });
  }

  handlePageSizeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pageSize = parseInt(input.value);
    this.updatePageNumber(1);
  }

  updateDirection() {
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
      this.sortedData = [...this.originalData];
    } else if (this.direction === Direction.ASCENDING) {
      this.sortedData.sort((a, b) => {
        const valueA = a[this.sortProperty as keyof T];
        const valueB = b[this.sortProperty as keyof T];

        return valueA < valueB ? -1 : 1;
      });
    } else {
      this.sortedData.reverse();
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

    this.updateDirection();
    this.sortData();
    this.updatePageNumber(1);
    this.updateDisplayData();
  }

  updateDisplayData() {
    const pageSize = this.pageSize || this.sortedData.length;
    this.displayData = this.sortedData.slice(
      (this.currentPage - 1) * pageSize,
      this.currentPage * pageSize,
    );
  }
}

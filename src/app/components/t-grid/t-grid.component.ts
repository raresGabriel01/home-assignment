import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { TColumnComponent } from '../t-column/t-column.component';
import { CommonModule } from '@angular/common';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';

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
  imports: [CommonModule, TColumnComponent, ScrollingModule],
  templateUrl: './t-grid.component.html',
  styleUrl: './t-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  public viewPort: CdkVirtualScrollViewport;

  originalData: T[] = [];
  sortedData: T[] = [];
  displayData: T[] = [];
  currentPage: number = 1;
  sortProperty?: keyof T;
  direction: Direction = Direction.NONE;
  isLoading: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

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
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.isLoading = false;
          this.sortedData = [...this.originalData];
          this.changeDetectorRef.detectChanges();
        },
      });
    } else {
      this.displayData = this.data.slice(0, this.pageSize || this.data.length);
      this.originalData = [...this.data];
      this.sortedData = [...this.data];
    }
  }

  getTableHeaderTop() {
    if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
      return '-2px';
    }
    let offset = this.viewPort['_renderedContentOffset'];
    return `-${offset + 2}px`;
  }

  updatePage(pageNumber: number, pageSize: number | null) {
    if (!this.pageSize) {
      return;
    }

    if (
      pageNumber < 1 ||
      pageNumber > Math.ceil(this.originalData.length / this.pageSize) ||
      pageSize === null ||
      pageSize < 1
    ) {
      return;
    }

    // Early exit here to avoid events emitted in case nothing changes.
    if (this.currentPage === pageNumber && this.pageSize === pageSize) {
      return;
    }

    this.currentPage = pageNumber;
    this.pageSize = pageSize;
    this.paginationChange.emit({
      pageSize: this.pageSize,
      currentPage: this.currentPage,
    });
  }

  handlePageSizeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newPageSize = parseInt(input.value);
    this.updatePage(1, newPageSize);
    this.updateDisplayData();
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
    this.updatePage(1, this.pageSize);
    this.updateDisplayData();
  }

  handlePageChangeButtonClick(step: 1 | -1) {
    const newPage = this.currentPage + step;
    this.updatePage(newPage, this.pageSize);
    if (newPage > 0) {
      this.updateDisplayData();
    }
  }

  updateDisplayData() {
    const pageSize = this.pageSize || this.sortedData.length;
    this.displayData = this.sortedData.slice(
      (this.currentPage - 1) * pageSize,
      this.currentPage * pageSize,
    );
  }
}

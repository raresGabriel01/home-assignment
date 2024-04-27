import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { TColumnComponent } from '../t-column/t-column.component';
import { CommonModule } from '@angular/common';

export type ColumnData<T> = {
  name: string;
  property: keyof T;
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
  @ContentChildren(TColumnComponent) columnQuery: QueryList<
    TColumnComponent<T>
  >;
  columns: ColumnData<T>[];

  ngAfterContentInit() {
    console.log('test     sssssdxzxzxZXXzasddasd');
    this.columns = this.columnQuery.map((column) => ({ ...column }));
  }
}

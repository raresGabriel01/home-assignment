import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Direction, TGridComponent } from './t-grid.component';
import { TColumnComponent } from '../t-column/t-column.component';

type TestData = {
  id: string;
  name: string;
  points: number;
};

const areNameArraysEqual = (a: TestData[], b: string[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i].name !== b[i]) {
      return false;
    }
  }

  return true;
};

describe('TGridComponent', () => {
  let component: TGridComponent<TestData>;
  let fixture: ComponentFixture<TGridComponent<TestData>>;

  const nameColumn = new TColumnComponent<TestData>();
  nameColumn.name = 'Name';
  nameColumn.property = 'name';
  nameColumn.sortable = true;

  const pointsColumn = new TColumnComponent<TestData>();
  pointsColumn.name = 'Points';
  pointsColumn.property = 'points';
  pointsColumn.sortable = true;

  const idColumn = new TColumnComponent<TestData>();
  idColumn.name = 'ID';
  idColumn.property = 'id';
  idColumn.sortable = false;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGridComponent, TColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TGridComponent<TestData>);
    component = fixture.componentInstance;
    component.data = [
      { id: '1', name: 'John', points: 2 },
      { id: '2', name: 'Alice', points: 10 },
      { id: '3', name: 'Bob', points: -1 },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change sort direction', () => {
    component.sortable = true;
    fixture.detectChanges();
    const sortChangeSpy = spyOn(component.sortChange, 'emit');

    // On the first click on the 'name' column, we should expect an ASCENDING order.
    component.handleColumnClick(nameColumn);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      columnName: 'name',
      direction: Direction.ASCENDING,
    });
    expect(
      areNameArraysEqual(component.displayData, ['Alice', 'Bob', 'John']),
    ).toBe(true);

    // On a second click, we should expect a DESCENDING order.
    component.handleColumnClick(nameColumn);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      columnName: 'name',
      direction: Direction.DESCENDING,
    });
    expect(
      areNameArraysEqual(component.displayData, ['John', 'Bob', 'Alice']),
    ).toBe(true);

    // On a third click, we should expect the original data order.
    component.handleColumnClick(nameColumn);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      columnName: 'name',
      direction: Direction.NONE,
    });
    expect(
      areNameArraysEqual(component.displayData, ['John', 'Alice', 'Bob']),
    ).toBe(true);
  });

  it('should reset sorting direction when changing column sortkey', () => {
    component.sortable = true;
    fixture.detectChanges();
    const sortChangeSpy = spyOn(component.sortChange, 'emit');

    // On the first click on the 'name' column, we should expect an ASCENDING order on that specific column.
    component.handleColumnClick(nameColumn);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      columnName: 'name',
      direction: Direction.ASCENDING,
    });
    expect(
      areNameArraysEqual(component.displayData, ['Alice', 'Bob', 'John']),
    ).toBe(true);

    // When clicking on another sortable column, we should expect the sorting direction to reset to NONE.
    component.handleColumnClick(pointsColumn);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      columnName: 'points',
      direction: Direction.ASCENDING,
    });
    expect(
      areNameArraysEqual(component.displayData, ['Bob', 'John', 'Alice']),
    ).toBe(true);
  });

  it('should not sort if the table is not sortable', () => {
    component.sortable = false;
    fixture.detectChanges();
    const sortChangeSpy = spyOn(component.sortChange, 'emit');

    component.handleColumnClick(nameColumn);
    expect(sortChangeSpy).not.toHaveBeenCalled();
    expect(
      areNameArraysEqual(component.displayData, ['John', 'Alice', 'Bob']),
    ).toBe(true);
  });

  it('should not sort if the column is not sortable', () => {
    component.sortable = true;
    fixture.detectChanges();
    const sortChangeSpy = spyOn(component.sortChange, 'emit');

    component.handleColumnClick(idColumn);
    expect(sortChangeSpy).not.toHaveBeenCalled();
    expect(
      areNameArraysEqual(component.displayData, ['John', 'Alice', 'Bob']),
    ).toBe(true);
  });

  it('should display only the data on the current page', () => {
    component.pageSize = 1;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.displayData.length).toBe(1);
    expect(component.displayData[0].name).toBe('John');
  });

  it('should change pages', () => {
    component.pageSize = 2;
    fixture.detectChanges();

    const changePaginationSpy = spyOn(component.paginationChange, 'emit');

    component.handlePageChangeButtonClick(+1);
    expect(component.displayData.length).toBe(1);
    expect(changePaginationSpy).toHaveBeenCalledOnceWith({
      currentPage: 2,
      pageSize: 2,
    });
  });

  it('should not change pages if pageSize is null', () => {
    component.pageSize = null;
    fixture.detectChanges();

    const changePaginationSpy = spyOn(component.paginationChange, 'emit');

    component.updatePage(2, component.pageSize);
    expect(changePaginationSpy).not.toHaveBeenCalled();
  });

  it('should respect page boundaries', () => {
    component.sortable = false;
    component.pageSize = 2;
    fixture.detectChanges();

    const changePaginationSpy = spyOn(component.paginationChange, 'emit');

    component.updatePage(0, component.pageSize);
    expect(component.currentPage).toBe(1);
    expect(changePaginationSpy).not.toHaveBeenCalled();

    component.updatePage(2, component.pageSize);
    expect(component.currentPage).toBe(2);
    expect(changePaginationSpy).toHaveBeenCalledTimes(1);

    component.updatePage(3, component.pageSize);
    expect(component.currentPage).toBe(2);
    expect(changePaginationSpy).toHaveBeenCalledTimes(1);
  });

  it('should change pageSize', () => {
    component.sortable = false;
    component.pageSize = 2;
    fixture.detectChanges();

    const changePaginationSpy = spyOn(component.paginationChange, 'emit');
    const mockEvent = {
      target: {
        value: '3',
      },
    } as unknown as Event;

    component.handlePageSizeChange(mockEvent);
    expect(changePaginationSpy).toHaveBeenCalledOnceWith({
      pageSize: 3,
      currentPage: 1,
    });
    expect(
      areNameArraysEqual(component.displayData, ['John', 'Alice', 'Bob']),
    ).toBe(true);
  });

  it('should reset pageNumber when sorting', () => {
    component.sortable = true;
    component.pageSize = 2;
    fixture.detectChanges();

    const changePaginationSpy = spyOn(component.paginationChange, 'emit');

    component.updatePage(2, component.pageSize);
    component.handleColumnClick(nameColumn);
    expect(changePaginationSpy).toHaveBeenCalledWith({
      pageSize: 2,
      currentPage: 1,
    });
    expect(component.currentPage).toBe(1);
    expect(areNameArraysEqual(component.displayData, ['Alice', 'Bob'])).toBe(
      true,
    );
  });

  it('should reset pageNumber when changing the pageSize', () => {
    component.sortable = true;
    component.pageSize = 2;
    fixture.detectChanges();

    const changePaginationSpy = spyOn(component.paginationChange, 'emit');
    const mockEvent = {
      target: {
        value: '3',
      },
    } as unknown as Event;

    component.handlePageSizeChange(mockEvent);

    expect(component.currentPage).toBe(1);
    expect(changePaginationSpy).toHaveBeenCalledOnceWith({
      pageSize: 3,
      currentPage: 1,
    });
    expect(
      areNameArraysEqual(component.displayData, ['John', 'Alice', 'Bob']),
    ).toBe(true);
  });
});

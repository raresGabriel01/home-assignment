import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Direction, TGridComponent } from './t-grid.component';
import { TColumnComponent } from '../t-column/t-column.component';

describe('TGridComponent', () => {
  type TestData = {
    id: string;
    name: string;
  };
  let component: TGridComponent<TestData>;
  let fixture: ComponentFixture<TGridComponent<TestData>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGridComponent, TColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TGridComponent<TestData>);
    component = fixture.componentInstance;
    component.data = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort in proper order', () => {
    component.sortable = true;
    component.pageSize = null;
    fixture.detectChanges();
    const sortChangeSpy = spyOn(component.sortChange, 'emit');

    const nameColumn = new TColumnComponent<TestData>();
    nameColumn.name = 'Name';
    nameColumn.property = 'name';
    nameColumn.sortable = true;

    component.handleColumnClick(nameColumn);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      columnName: 'name',
      direction: Direction.ASCENDING,
    });
    expect(component.displayData[0].name).toBe('Alice');
    expect(component.displayData[1].name).toBe('Bob');
    expect(component.displayData[2].name).toBe('John');

    component.handleColumnClick(nameColumn);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      columnName: 'name',
      direction: Direction.DESCENDING,
    });
    expect(component.displayData[0].name).toBe('John');
    expect(component.displayData[1].name).toBe('Bob');
    expect(component.displayData[2].name).toBe('Alice');

    component.handleColumnClick(nameColumn);
    expect(sortChangeSpy).toHaveBeenCalledWith({
      columnName: 'name',
      direction: Direction.NONE,
    });
    expect(component.displayData[0].name).toBe('John');
    expect(component.displayData[1].name).toBe('Alice');
    expect(component.displayData[2].name).toBe('Bob');
  });
});

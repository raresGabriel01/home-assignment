import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TGridComponent } from './t-grid.component';

describe('TGridComponent', () => {
  let component: TGridComponent<any>;
  let fixture: ComponentFixture<TGridComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

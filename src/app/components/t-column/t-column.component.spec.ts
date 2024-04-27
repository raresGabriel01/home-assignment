import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TColumnComponent } from './t-column.component';

describe('TColumnComponent', () => {
  let component: TColumnComponent<any>;
  let fixture: ComponentFixture<TColumnComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  PROGRESS_ERROR_MESSAGE,
  RADIUS_ERROR_MESSAGE,
  TProgressComponent,
} from './t-progress.component';

describe('TProgressComponent', () => {
  let component: TProgressComponent;
  let fixture: ComponentFixture<TProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw radius error', () => {
    try {
      component.ngOnChanges({
        radius: {
          firstChange: true,
          isFirstChange: () => true,
          previousValue: undefined,
          currentValue: 20,
        },
        progress: {
          firstChange: true,
          isFirstChange: () => true,
          previousValue: undefined,
          currentValue: 20,
        },
      });
    } catch (e) {
      expect((e as Error).message).toBe(RADIUS_ERROR_MESSAGE);
    }
  });

  it('should throw progress error on negative values', () => {
    try {
      component.ngOnChanges({
        radius: {
          firstChange: true,
          isFirstChange: () => true,
          previousValue: undefined,
          currentValue: 60,
        },
        progress: {
          firstChange: true,
          isFirstChange: () => true,
          previousValue: undefined,
          currentValue: -20,
        },
      });
    } catch (e) {
      expect((e as Error).message).toBe(PROGRESS_ERROR_MESSAGE);
    }
  });

  it('should throw progress error on values over 100', () => {
    try {
      component.ngOnChanges({
        radius: {
          firstChange: true,
          isFirstChange: () => true,
          previousValue: undefined,
          currentValue: 60,
        },
        progress: {
          firstChange: true,
          isFirstChange: () => true,
          previousValue: undefined,
          currentValue: 120,
        },
      });
    } catch (e) {
      expect((e as Error).message).toBe(PROGRESS_ERROR_MESSAGE);
    }
  });

  it('should return correct path string', () => {
    component.radius = 100;
    component.progress = 50;
    fixture.detectChanges();
    component.ngOnInit();
    const pathString = component.getPathString();
    expect(pathString).toBe('M 110, 10 A 100, 100, 0 1 1 110, 210');
  });
});

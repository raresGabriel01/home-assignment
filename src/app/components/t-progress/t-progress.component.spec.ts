import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TProgressComponent } from './t-progress.component';

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

  it('should set render radius to 50 in case of smaller values', () => {
    component.radius = 10;
    component.progress = 20;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.renderRadius).toBe(50);
  });

  it('shoul set render progress to 0 in case of negative values', () => {
    component.radius = 50;
    component.progress = -50;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.renderProgress).toBe(0);
  });

  it('should set render progress to 100 in case of larger values', () => {
    component.radius = 50;
    component.progress = 120;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.renderProgress).toBe(100);
  });

  it('should return correct path string', () => {
    component.radius = 100;
    component.progress = 50;
    fixture.detectChanges();
    component.ngOnInit();
    const pathString = component.getPathString();
    expect(pathString).toBe('M 110, 10 A 100, 100, 0 1 1 110, 210');
  });

  it('should emit complete event on 100% progress', () => {
    component.radius = 50;
    component.progress = 100;
    const completeSpy = spyOn(component.complete, 'emit');

    fixture.detectChanges();
    component.ngOnInit();
    component.ngAfterViewInit();

    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});

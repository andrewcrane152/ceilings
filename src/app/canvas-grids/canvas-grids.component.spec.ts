import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasGridsComponent } from './canvas-grids.component';

describe('CanvasGridsComponent', () => {
  let component: CanvasGridsComponent;
  let fixture: ComponentFixture<CanvasGridsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasGridsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasGridsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCanvasGridControlsComponent } from './design-canvas-grid-controls.component';

describe('DesignCanvasGridControlsComponent', () => {
  let component: DesignCanvasGridControlsComponent;
  let fixture: ComponentFixture<DesignCanvasGridControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesignCanvasGridControlsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignCanvasGridControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

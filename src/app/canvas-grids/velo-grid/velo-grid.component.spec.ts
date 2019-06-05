import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VeloGridComponent } from './velo-grid.component';

describe('VeloGridComponent', () => {
  let component: VeloGridComponent;
  let fixture: ComponentFixture<VeloGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VeloGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VeloGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // RESTORE
  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  // });
});

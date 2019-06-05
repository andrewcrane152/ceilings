import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwoonGridComponent } from './swoon-grid.component';

describe('SwoonGridComponent', () => {
  let component: SwoonGridComponent;
  let fixture: ComponentFixture<SwoonGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwoonGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwoonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

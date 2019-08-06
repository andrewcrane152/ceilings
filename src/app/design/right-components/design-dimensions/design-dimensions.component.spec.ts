import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignDimensionsComponent } from './design-dimensions.component';

describe('DesignDimensionsComponent', () => {
  let component: DesignDimensionsComponent;
  let fixture: ComponentFixture<DesignDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignDimensionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityDetailsComponent } from './quantity-details.component';

describe('QuantityDetailsComponent', () => {
  let component: QuantityDetailsComponent;
  let fixture: ComponentFixture<QuantityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

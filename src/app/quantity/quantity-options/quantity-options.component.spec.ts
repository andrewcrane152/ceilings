import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityOptionsComponent } from './quantity-options.component';

describe('QuantityOptionsComponent', () => {
  let component: QuantityOptionsComponent;
  let fixture: ComponentFixture<QuantityOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

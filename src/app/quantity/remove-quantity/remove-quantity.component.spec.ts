import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveQuantityComponent } from './remove-quantity.component';

describe('RemoveQuantityComponent', () => {
  let component: RemoveQuantityComponent;
  let fixture: ComponentFixture<RemoveQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

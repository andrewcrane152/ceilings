import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignModifyComponent } from './design-modify.component';

describe('DesignModifyComponent', () => {
  let component: DesignModifyComponent;
  let fixture: ComponentFixture<DesignModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDuplicateComponent } from './confirm-duplicate.component';

describe('ConfirmDuplicateComponent', () => {
  let component: ConfirmDuplicateComponent;
  let fixture: ComponentFixture<ConfirmDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

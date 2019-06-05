import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignSeeyondComponent } from './design-seeyond.component';

describe('DesignSeeyondComponent', () => {
  let component: DesignSeeyondComponent;
  let fixture: ComponentFixture<DesignSeeyondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignSeeyondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignSeeyondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRightSeeyondComponent } from './options-right-seeyond.component';

describe('OptionsRightSeeyondComponent', () => {
  let component: OptionsRightSeeyondComponent;
  let fixture: ComponentFixture<OptionsRightSeeyondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsRightSeeyondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsRightSeeyondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

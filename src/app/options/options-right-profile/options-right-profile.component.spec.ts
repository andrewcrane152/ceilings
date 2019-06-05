import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRightProfileComponent } from './options-right-profile.component';

describe('OptionsRightProfileComponent', () => {
  let component: OptionsRightProfileComponent;
  let fixture: ComponentFixture<OptionsRightProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsRightProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsRightProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

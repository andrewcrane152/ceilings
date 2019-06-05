import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRightHushSwoonComponent } from './options-right-hush-swoon.component';

describe('OptionsRightHushSwoonComponent', () => {
  let component: OptionsRightHushSwoonComponent;
  let fixture: ComponentFixture<OptionsRightHushSwoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsRightHushSwoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsRightHushSwoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

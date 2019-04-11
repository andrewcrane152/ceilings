import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRightHushComponent } from './options-right-hush.component';

describe('OptionsRightHushComponent', () => {
  let component: OptionsRightHushComponent;
  let fixture: ComponentFixture<OptionsRightHushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsRightHushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsRightHushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

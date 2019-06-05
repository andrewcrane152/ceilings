import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRightClarioComponent } from './options-right-clario.component';

describe('OptionsRightClarioComponent', () => {
  let component: OptionsRightClarioComponent;
  let fixture: ComponentFixture<OptionsRightClarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsRightClarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsRightClarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

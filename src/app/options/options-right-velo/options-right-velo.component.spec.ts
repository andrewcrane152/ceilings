import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRightVeloComponent } from './options-right-velo.component';

describe('OptionsRightVeloComponent', () => {
  let component: OptionsRightVeloComponent;
  let fixture: ComponentFixture<OptionsRightVeloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsRightVeloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsRightVeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

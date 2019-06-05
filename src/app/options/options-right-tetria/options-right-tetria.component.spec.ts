import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRightTetriaComponent } from './options-right-tetria.component';

describe('OptionsRightTetriaComponent', () => {
  let component: OptionsRightTetriaComponent;
  let fixture: ComponentFixture<OptionsRightTetriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsRightTetriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsRightTetriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

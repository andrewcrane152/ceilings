import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRightClarioCloudComponent } from './options-right-clario-cloud.component';

describe('OptionsRightClarioCloudComponent', () => {
  let component: OptionsRightClarioCloudComponent;
  let fixture: ComponentFixture<OptionsRightClarioCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsRightClarioCloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsRightClarioCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

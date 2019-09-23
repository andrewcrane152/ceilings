import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarioCloudGridComponent } from './clario-cloud-grid.component';

describe('ClarioCloudGridComponent', () => {
  let component: ClarioCloudGridComponent;
  let fixture: ComponentFixture<ClarioCloudGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClarioCloudGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarioCloudGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

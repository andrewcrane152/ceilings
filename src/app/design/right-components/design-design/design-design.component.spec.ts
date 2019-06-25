import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignMaterialsComponent } from './design-materials.component';

describe('DesignMaterialsComponent', () => {
  let component: DesignMaterialsComponent;
  let fixture: ComponentFixture<DesignMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesignMaterialsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';
// import { Overlay } from '@angular/cdk/overlay/typings/overlay';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router/src/directives/router_outlet';

import { User } from 'app/_models/user';
import { AppComponent } from './app.component';
import { AlertComponent } from 'app/alert/alert.component';
import { AlertService } from 'app/_services/alert.service';
import { DebugService } from './_services/debug.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        AppComponent,
        AlertComponent
      ],
      providers: [
        User,
        DebugService,
        AlertService,
        MatSnackBar,
        // Overlay
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  // it('should create the app', async(() => {
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));

  // it('should have a router outlet', () => {
  //   const de = fixture.debugElement.query(By.directive(RouterOutlet));

  //   expect(de).not.toBeNull();
  // })

  // it(`should have as title 'app'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!!');
  // }));
});

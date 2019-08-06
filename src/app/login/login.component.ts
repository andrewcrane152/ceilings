import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Feature } from '../_features/feature';
import { User } from '../_models/user';
import { AlertService } from '../_services/alert.service';
import { ApiService } from '../_services/api.service';
import { DebugService } from './../_services/debug.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public email: string;
  public password: string;
  public loading = false;

  constructor(
    private alert: AlertService,
    private api: ApiService,
    private debug: DebugService,
    public feature: Feature,
    public user: User,
    public dialogRef: MatDialogRef<LoginComponent>
  ) {}

  ngOnInit() {
    this.debug.log('login-component', this.user);
  }

  createAccount() {
    window.open('https://www.3-form.com/userprofile', '_blank');
  }

  forgotPassword() {
    window.open('http://www.3-form.com/userprofile/reset', '_blank');
  }

  login() {
    this.loading = true;
    this.api.login(this.email, this.password).subscribe(
      data => {
        if (!!data.result && !!data.result.user) {
          this.alert.success('Successfully logged in.');
          this.loading = false;
          localStorage.setItem('3formUser', JSON.stringify(data.result.user));
          this.api.onUserLoggedIn.emit(this.user);
          this.debug.log('api', 'user successfully logged in');
          this.dialogRef.close();
        } else {
          this.alert.error('Incorrect Username or Password');
        }
        this.loading = false;
      },
      error => {
        if (error) {
          this.api.handleError(error);
        }
        this.loading = false;
      }
    );
  }

  validateSignIn() {
    return !!this.email && !!this.password;
  }
}

import { Injectable } from '@angular/core';
import { DebugService } from './../_services/debug.service';

@Injectable()
export class User {
  private static _instance: User = new User();
  uid: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;

  constructor(private debug: DebugService = new DebugService()) {
    if (User._instance) {
      return User._instance;
    }

    User._instance = this;
  }

  public getFullname() {
    return this.firstname + ' ' + this.lastname;
  }

  public isLoggedIn() {
    let loggedIn: boolean;
    if (typeof this.uid !== 'undefined') {
      loggedIn = true;
    } else {
      loggedIn = false;
    }
    return loggedIn;
  }
}

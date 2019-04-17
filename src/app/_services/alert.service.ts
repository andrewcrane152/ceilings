import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  snackBarConfig: MatSnackBarConfig;

  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone
  ) { }

  public error(message, action = 'Dismiss', duration = 5000) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.duration = duration;
    this.zone.run(() => {
      this.snackBar.open(message, action, this.snackBarConfig);
    })
  }

  public success(message, action = 'Dismiss', duration = 5000) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.duration = duration;
    this.zone.run(() => {
      this.snackBar.open(message, action, this.snackBarConfig);
    })
  }


  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  apiAlert(alert: any) {
    let body: any;

    // api alerts contain a _body element that needs to be parsed as JSON
    body = JSON.parse(alert._body);

    if (body.result && body.result.error) {
      this.error(body.result.message);
    } else if (body.error) {
      this.error(body.message);
    } else {
      this.success(body.result.message);
    }
  }
}

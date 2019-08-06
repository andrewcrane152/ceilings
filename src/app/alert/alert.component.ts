import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  message: any;

  constructor(private alert: AlertService, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.alert.getMessage().subscribe(message => {
      const config = new MatSnackBarConfig();
      config.panelClass = message.type === 'error' ? ['ceilings-alert-error'] : ['ceilings-alert-success'];
      config.duration = message.type === 'success' ? 1000 : null;
      config.announcementMessage = message.text;
      this.snackBar.open(message.text, 'dismiss', config);
    });
  }
}

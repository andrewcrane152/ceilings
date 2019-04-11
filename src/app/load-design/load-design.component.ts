import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Feature } from '../_features/feature';
import { User } from '../_models/user';
import { AlertService } from '../_services/alert.service';
import { ApiService } from '../_services/api.service';
import { DebugService } from '../_services/debug.service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-load-design',
  templateUrl: './load-design.component.html',
  styleUrls: ['./load-design.component.scss']
})
export class LoadDesignComponent implements OnInit {
  public designs: Array<Feature>;

  constructor(
    private router: Router,
    private alert: AlertService,
    private api: ApiService,
    private debug: DebugService,
    public dialog: MatDialog,
    public feature: Feature,
    public user: User,
    public dialogRef: MatDialogRef<LoadDesignComponent>
  ) {}

  ngOnInit() {}

  load(id: number) {
    this.debug.log('load-design', 'loading id: ' + id);
    this.router.navigate([this.feature.feature_type + '/design', id]);
    this.feature.onDesignLoaded.emit();
    this.dialogRef.close();
  }

  delete(id: number, target: any) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, new MatDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.debug.log('load-design', 'User has confirmed delete');
        this.api.deleteDesign(id).subscribe(
          response => {
            if (this.feature.id === id) {
              this.debug.log('load-design', 'Deleting the design we are currently on');
              this.router.navigate([this.feature.feature_type, 'design']);
            }
            target.remove();
            this.alert.success('Design ID: ' + id + ' has been deleted');
          },
          error => {
            if (error) {
              this.alert.apiAlert(error);
            }
          }
        );
      }
    });
  }
}

import { Feature } from 'app/_features/feature';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SeeyondFeature } from 'app/_features/seeyond-feature';

@Component({
  selector: 'app-confirm-duplicate',
  templateUrl: './confirm-duplicate.component.html',
  styleUrls: ['./confirm-duplicate.component.scss']
})
export class ConfirmDuplicateComponent implements OnInit {
  orderType = 'design';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDuplicateComponent>,
    public feature: Feature,
    public seeyond: SeeyondFeature
  ) { }

  ngOnInit() {
    this.orderType = this.feature.is_quantity_order ? 'order' : 'design';
  }

  confirmDuplicate() {
    this.feature.feature_type === 'seeyond' ? this.seeyond.duplicateOrder() : this.feature.duplicateOrder();
    this.dialogRef.close('cancel')
  }

  cancelDuplicate() {
    this.dialogRef.close('confirm')
  }
}

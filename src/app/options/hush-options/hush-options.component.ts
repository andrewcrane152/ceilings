import { Component, OnInit, Input, Output } from '@angular/core';
import { OptionsComponent } from 'app/options/options.component';

@Component({
  selector: 'app-hush-options',
  templateUrl: './hush-options.component.html',
  styleUrls: ['../../options/options.component.scss', './hush-options.component.scss']
})
export class HushOptionsComponent extends OptionsComponent implements OnInit {
  modifyToolsArray = ['remove'];
  validateMessage: string;
  showMessage = false;
  timer: any;

  hushValidateOptions() {
    let isValid = false;
    if (!!this.feature.width && !!this.feature.length && !!this.feature.design_name) {
      isValid = true;
    }
    return isValid;
  }

  closeDialog() {
    let newWidth = Math.floor(this.feature.width / 24) * 24;
    let newLength = Math.floor(this.feature.length / 24) * 24;
    if (newWidth === 0) {
      newWidth = 24;
      this.alert.error(`Width rounded up to 24`);
    }
    if (newLength === 0) {
      newLength = 24;
      this.alert.error(`Length rounded up to 24`);
    }
    if (this.feature.width % 24 !== 0 && this.feature.length % 24 !== 0) {
      this.feature.width = newWidth;
      this.feature.length = newLength;
      this.alert.error(`Width and Height rounded to ${newWidth}x${newLength}`);
    } else if (this.feature.width % 24 !== 0) {
      this.feature.width = newWidth;
      this.alert.error(`Width rounded down to ${newWidth}`);
    } else if (this.feature.length % 24 !== 0) {
      this.feature.length = newLength;
      this.alert.error(`Height rounded down to ${newLength}`);
    }
    this.dialogRef.close('start designing');
  }
}

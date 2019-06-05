import { Component, OnInit } from '@angular/core';
import { OptionsComponent } from './../options.component';
import { SeeyondFeature } from './../../_features/seeyond-feature';

@Component({
  selector: 'app-seeyond-options',
  templateUrl: './seeyond-options.component.html',
  styleUrls: ['../../options/options.component.scss', './seeyond-options.component.scss']
})
export class SeeyondOptionsComponent extends OptionsComponent {
  updateSelectedFeature(feature) {
    this.seeyond.updateSeeyondFeature(feature);
  }

  dimensionsDidChange() {
    this.seeyond.setMaxMinDimensions();
    this.seeyond.updateDimensions();
  }

  seeyondValidateOptions() {
    let isValid = false;
    if (!!this.seeyond.design_name) {
      isValid = true;
    }
    return isValid;
  }

  startDesigning() {
    this.seeyond.onDimensionsChange.emit();
    this.dialogRef.close('start designing');
  }
}

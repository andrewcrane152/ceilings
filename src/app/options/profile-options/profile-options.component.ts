import { Component, OnInit } from '@angular/core';
import { OptionsComponent } from '../options.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile-options',
  templateUrl: './profile-options.component.html',
  styleUrls: ['./profile-options.component.scss']
  // styleUrls: ['../../options/options.component.scss', './profile-options.component.scss']
})
export class ProfileOptionsComponent extends OptionsComponent implements OnInit {
  ngOnInit() {
    this.profile.$featureTypeChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      console.log('onFeatureTypeChange:', res);
    });
  }

  updateSelectedFeature(feature) {
    console.log('updateSelectedFeature:', feature);
    if (this.profile.tilesFeatures.includes(feature)) {
      if (this.router.url.indexOf('tiles') < 0) {
        this.location.go(`${this.router.url}/tiles/${feature}`);
      }
    }
    this.profile.updateProfileFeature(feature);

    // this.seeyond.updateSeeyondFeature(feature);zz
  }

  dimensionsDidChange() {
    console.log('dimensionsDidChange');
    // this.seeyond.setMaxMinDimensions();
    // this.seeyond.updateDimensions();
  }

  seeyondValidateOptions() {
    console.log('seeyondValidateOptions');
    // let isValid = false;
    // if (!!this.seeyond.design_name) { isValid = true; }
    // return isValid;
  }

  startDesigning() {
    console.log('startDesigning');
    this.profile.buildFeatureGrid();
    this.dialogRef.close();
  }
}

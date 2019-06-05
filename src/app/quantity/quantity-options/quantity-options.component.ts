import { ProfileFeature } from './../../_features/profile-feature';
import { Router } from '@angular/router';
import { ClarioGridsService } from './../../_services/clario-grids.service';
import { Location } from '@angular/common';
import { MatDialogRef } from '@angular/material';
import { Feature } from './../../_features/feature';
import { Component, OnInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-quantity-options',
  templateUrl: './quantity-options.component.html',
  styleUrls: ['../../options/options.component.scss', './quantity-options.component.scss']
})
export class QuantityOptionsComponent implements OnInit, AfterContentChecked {
  title = 'Order By Quantity';
  showProfileFeatureSelection = false;
  showClarioTileSizes = false;

  constructor(
    public router: Router,
    public feature: Feature,
    public dialogRef: MatDialogRef<QuantityOptionsComponent>,
    public location: Location,
    public clarioGrids: ClarioGridsService,
    public profile: ProfileFeature
  ) {}

  ngOnInit() {}

  ngAfterContentChecked() {
    switch (this.feature.feature_type) {
      case 'clario':
        this.showClarioTileSizes = true;
        break;
      case 'profile':
        this.showProfileFeatureSelection = true;
        break;
    }
    const featureType = this.feature.getFeatureHumanName();
    this.title = `${featureType} Tiles By Quantity`;
  }

  clarioGridSizeChanged(selection) {
    this.clarioGrids.gridSizeSelected(selection);
  }

  clarioTileSizeChanged(selection) {
    this.clarioGrids.tileSizeSelected(selection);
    this.clarioGrids.setGridTileSizeOptions();
  }

  goToLanding() {
    this.dialogRef.close('cancel');
    this.feature.navToLanding();
  }

  validateOptions() {
    let valid = !!this.feature.design_name;
    if (this.feature.feature_type === 'clario') {
      valid = valid && !!this.feature.grid_type && !!this.clarioGrids.selectedTileSize;
    }
    return valid;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  goToDesign() {
    const pathname = window.location.pathname.replace(/\/design/g, '/quantity');
    this.router.navigate([pathname]);
    this.dialogRef.close('cancel');
  }

  updateSelectedProfileFeature(feature) {
    // console.log('updateSelectedFeature:', feature);
    if (this.profile.tilesFeatures.includes(feature)) {
      if (this.router.url.indexOf('tiles') < 0) {
        this.location.go(`${this.router.url}/tiles/${feature}`);
      }
    }
    this.profile.updateProfileFeature(feature);
  }
}

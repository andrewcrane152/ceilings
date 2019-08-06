import { DebugService } from '../_services/debug.service';
import { Feature } from './feature';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileFeature {
  feature_type = 'swoon';
  feature_type_tile = '';
  $featureTypeChange = new EventEmitter();
  onBuildSwoonGrid = new EventEmitter();
  tilesFeatures = ['verve', 'subway', 'glide', 'quarry', 'swoon', 'flank'];

  constructor(private debug: DebugService) {}

  updateProfileFeature(feature) {
    this.feature_type = feature;
    this.$featureTypeChange.emit(feature);
  }

  buildFeatureGrid() {
    switch (this.feature_type) {
      case 'swoon':
        this.onBuildSwoonGrid.emit();
        break;
      default:
        this.debug.log('profile-feature', `buildFeatureGrid ${this.feature_type} not found`);
        break;
    }
  }
}

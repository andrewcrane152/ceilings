import { DesignComponent } from './../../design.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design-design',
  templateUrl: './design-design.component.html',
  styleUrls: ['../../design.component.scss', './design-design.component.scss']
})
export class DesignMaterialsComponent extends DesignComponent implements OnInit {
  showTileSelection = true;
  showApplyAllButton = true;
  ngOnInit() {
    this.materials = this.feature.getFeatureMaterials();
    this.featureTiles = this.feature.tilesArray[this.feature.feature_type];
    switch (this.feature.feature_type) {
      case 'hush':
        this.showTileSelection = false;
        break;
      case 'velo':
        this.showApplyAllButton = false;
        break;
      case 'clario-cloud':
        this.showTileSelection = false;
        this.showApplyAllButton = false;
        break;

    }
  }
}

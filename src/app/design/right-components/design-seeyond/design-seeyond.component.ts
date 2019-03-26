import { DesignComponent } from './../../design.component';
import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-design-seeyond',
  templateUrl: './design-seeyond.component.html',
  styleUrls: ['../../design.component.scss', './design-seeyond.component.scss']
})
export class DesignSeeyondComponent extends DesignComponent implements OnInit, AfterContentInit, OnDestroy {
  selectedTessellation = this.seeyond.tessellation;
  pattern_strength: number;
  seeyondMaterials = this.feature.materials.felt.sola;
  strengths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  patternRelief = 'both';
  dimensionsString: string;
  patternReliefOptions = [
    {
      value: 'both',
      name: 'front & back'
    },
    {
      value: 'front',
      name: 'front'
    },
    {
      value: 'back',
      name: 'back'
    }
  ];
  ngOnInit() {
    this.seeyond.onDimensionsChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.dimensionsString = this.seeyond.getDimensionString(this.feature.units);
      // this.patternRelief = this.getPatternReliefString();
    });
  }

  ngAfterContentInit() {
    // subscribe to the onFeatureUpdated event to update the price.
    this.seeyond.onFeatureUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.seeyond.updateEstimatedAmount();
    });

    this.seeyond.$outdatedMaterial.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (this.seeyond.materialObj.status === 'inactive') {
        this.alert.error(
          `The color \"${this.seeyond.materialObj.name_str}\" is being discontinued.  It will be available until ${
            this.seeyond.materialObj.available_until
          } or while supplies last.`
        );
      }
      if (this.seeyond.materialObj.status === 'discontinued') {
        this.alert.error(`The color \"${this.seeyond.materialObj.name_str}\" has been discontinued.  Select a new color to proceed.`);
        this.feature.canQuote = false;
      }
    });
    this.pattern_strength = this.seeyond.pattern_strength;
    this.patternRelief = this.getPatternReliefString();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  seeyondDimensionsDidChange() {
    this.seeyond.setMaxMinDimensions();
    this.seeyond.updateDimensions();
  }

  seeyondUpdateSelectedFeature(selectedFeature) {
    this.seeyond.updateSeeyondFeature(selectedFeature);
  }

  updateSelectedTessellation(tessellationName: string) {
    if (this.seeyond.quoted) {
      this.alertQuoted();
      return;
    }
    this.seeyond.tessellationStr = tessellationName;
    const tessellation = this.seeyond.getTesslationNumber(tessellationName);
    this.selectedTessellation = this.seeyond.tessellation = tessellation;

    // update the visualization
    this.seeyond.reloadVisualization();
  }

  updatePatternStrength() {
    this.pattern_strength = Number(this.seeyond.pattern_strength);

    // update the visualization
    this.seeyond.reloadVisualization();
  }

  updatePatternRelief() {
    switch (this.patternRelief) {
      case 'front':
        this.seeyond.front_relief = true;
        this.seeyond.back_relief = false;
        break;

      case 'back':
        this.seeyond.front_relief = false;
        this.seeyond.back_relief = true;
        break;

      default:
        this.seeyond.front_relief = true;
        this.seeyond.back_relief = true;
        break;
    }

    this.debug.log('seeyond-design', this.seeyond.front_relief);
    this.debug.log('seeyond-design', this.seeyond.back_relief);

    // update the visualization
    this.seeyond.reloadVisualization();
  }

  updateSelectedMaterial(material) {
    if (this.seeyond.quoted) {
      this.alertQuoted();
      return;
    }
    this.seeyond.material = material.material;
    this.seeyond.sheet_part_id = material.sheet_part_id;
    this.seeyond.canQuote = true;

    // update the visualization
    this.seeyond.redrawVisualization();
  }

  getPatternReliefString() {
    if (this.seeyond.front_relief === true && this.seeyond.back_relief === true) {
      return 'both';
    }

    if (this.seeyond.front_relief === true && this.seeyond.back_relief === false) {
      return 'front';
    }

    if (this.seeyond.front_relief === false && this.seeyond.back_relief === true) {
      return 'back';
    }
  }
}

import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { DesignComponent } from './../design.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NavigationEnd } from '@angular/router/src/events';

@Component({
  selector: 'app-seeyond-design',
  templateUrl: './seeyond-design.component.html',
  styleUrls: ['../design.component.scss', './seeyond-design.component.scss']
})
export class SeeyondDesignComponent extends DesignComponent implements OnInit, OnDestroy, AfterContentInit {
  seeyondMaterials = this.feature.materials.felt.sola;
  pattern_strength = this.seeyond.pattern_strength;
  strengths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedTessellation = this.seeyond.tessellation;
  selectedMaterial = this.feature.material;
  estimated_amount: any;
  params: any;
  selectedFeature: any;
  dimensionsString: string;
  patternRelief: string;
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
      this.patternRelief = this.getPatternReliefString();
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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  alertQuoted() {
    this.alert.error('This design has been quoted.  To make changes you must first save it as a new design.');
  }

  public updateSelectedTessellation(tessellationName: string) {
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

  public updateSelectedMaterial(material) {
    if (this.seeyond.quoted) {
      this.alertQuoted();
      return;
    }
    this.selectedMaterial = this.seeyond.material = material.material;
    this.seeyond.sheet_part_id = material.sheet_part_id;
    this.seeyond.canQuote = true;

    // update the visualization
    this.seeyond.redrawVisualization();
  }

  public updatePatternStrength(strength: number) {
    this.pattern_strength = this.seeyond.pattern_strength = strength;

    // update the visualization
    this.seeyond.reloadVisualization();
  }

  public updateUnits(units) {
    if (this.seeyond.quoted) {
      this.alertQuoted();
      return;
    }
    this.seeyond.units = units;
    this.seeyond.convertDimensionsUnits(units);
    this.dimensionsString = this.seeyond.getDimensionString(units);
  }

  public toggleCoveLighting() {
    if (this.seeyond.quoted) {
      this.alertQuoted();
      return;
    }
    this.seeyond.cove_lighting = !this.seeyond.cove_lighting;
    if (this.seeyond.cove_lighting) {
      this.seeyond.calcLightingFootage();
    }
    this.seeyond.updateEstimatedAmount();
  }

  public updatePatternRelief() {
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

  private getPatternReliefString() {
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

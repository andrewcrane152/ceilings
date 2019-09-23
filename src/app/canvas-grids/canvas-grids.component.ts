import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { DebugService } from '../_services/debug.service';
import { ProfileFeature } from './../_features/profile-feature';
import { Feature } from '../_features/feature';
import { AlertService } from '../_services/alert.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-canvas-grids',
  templateUrl: './canvas-grids.component.html',
  styleUrls: ['./canvas-grids.component.scss']
})
export class CanvasGridsComponent implements OnInit, OnDestroy {
  context: CanvasRenderingContext2D;
  ngUnsubscribe: Subject<any> = new Subject();
  strokeStyle = '#cdcdcd';
  fillStyle = '#ffffff';

  newDesign = true;
  doingGridSizeAdjust = false;
  rows = 10;
  columns = 13;
  rulerMultiplier = 24;
  hRulerSections = 33;
  hRulerLabels = [];
  vRulerSections = 20;
  vRulerLabels = [];

  // css bindings
  canvasWidth = 826;
  canvasHeight = 500;
  guideTop = 10;
  guideLeft = 10;
  rulerBackgroundSize = '50px 15px';
  labelWidth = '50px';
  rulerHeight = '';
  rulerWidth = '';
  // rulerImgBackgroundWidth adjusts the size of each ruler section
  rulerImgBackgroundWidth = 50;

  constructor(
    public debug: DebugService,
    public alert: AlertService,
    public sanitizer: DomSanitizer,
    public feature: Feature,
    public route: ActivatedRoute,
    public profile: ProfileFeature
  ) {}

  ngOnInit() {
    this.setGridDisplayValues();
    this.feature.onZoomGrid.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.updateGridDisplay();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public setGridDisplayValues() {
    this.debug.log('canvas-grids', `setting grid display values for ${this.feature.feature_type}`);
    // set multiplier
    switch (this.feature.feature_type) {
      case 'velo':
        this.rulerMultiplier = this.feature.units === 'inches' ? 24 : 61;
        this.rulerImgBackgroundWidth = 49;
        this.vRulerSections = 11;
        this.hRulerSections = 17;
        break;
      case 'clario-cloud':
        // the base grid is 5 rows and 8 columns
        this.rulerMultiplier = this.feature.units === 'inches' ? 24 : 61;
        this.rulerImgBackgroundWidth = 49;
        this.vRulerSections = !!this.feature.canvasGridRows ? (this.feature.canvasGridRows * 2 + 1) : 11;
        this.hRulerSections = !!this.feature.canvasGridColumns ? (this.feature.canvasGridColumns * 2 + 1) : 17;
        break;
    }
    this.updateGridDisplay();
  }

  public updateGridDisplay() {
    // set number of ruler sections
    const rulerSectionWidth = Math.round(this.rulerImgBackgroundWidth * this.feature.canvasGridScale);

    switch (this.feature.feature_type) {
      case 'velo':
        this.canvasWidth = 96 * this.columns;
        this.canvasHeight = 52 * this.rows;
        this.rulerBackgroundSize = `${rulerSectionWidth}px 15px`;
        this.rulerHeight = `${rulerSectionWidth * this.vRulerSections - (rulerSectionWidth - 5)}px`;
        this.rulerWidth = `${rulerSectionWidth * this.hRulerSections - (rulerSectionWidth - 5)}px`;
        this.labelWidth = `${rulerSectionWidth}px`;
        break;
      case 'clario-cloud':
        const ninetySix = Math.round(96 * this.feature.canvasGridScale);
        const fourtyEight = Math.round(48 * this.feature.canvasGridScale);
        this.canvasWidth = ninetySix * this.columns;
        this.canvasHeight = ninetySix * this.rows;
        this.rulerBackgroundSize = `${fourtyEight}px 15px`;
        this.rulerHeight = `${fourtyEight * this.vRulerSections - (fourtyEight - 5)}px`;
        this.rulerWidth = `${fourtyEight * this.hRulerSections - (fourtyEight - 5)}px`;
        this.labelWidth = `${fourtyEight}px`;
        break;
      case 'hushSwoon':
        this.canvasWidth = 59 * this.columns + 27;
        this.canvasHeight = 50 * this.rows + 27;
        break;
    }

    // horizontal labels
    this.hRulerLabels = [];
    for (let ii = 0; ii < this.hRulerSections; ii++) {
      this.hRulerLabels.push(ii * this.rulerMultiplier);
    }

    // vertical labels
    this.vRulerLabels = [];
    for (let jj = 0; jj < this.vRulerSections; jj++) {
      this.vRulerLabels.push(jj * this.rulerMultiplier);
    }
  }

  getDesignDecisions() {
    const userSelections = [];
    // Get new r&c
    this.debug.log('canvas-grids', this.feature.gridData);
    this.feature.gridData.map(tile => {
      if (tile && !!tile.texture) {
        userSelections.push(tile);
      }
    });
    return userSelections;
  }

  applySelectionsToNewGrid(selections) {
    this.debug.log('canvas-grids-selections', selections);
    selections.map(selection => {
      for (let i = 0; i < this.feature.gridData.length; i++) {
        if (this.feature.gridData[i].column === selection.column && this.feature.gridData[i].row === selection.row) {
          this.feature.gridData[i] = selection;
        }
      }
    })
  }

  trackByFn(index, item) {
    return index;
  }

  public moveGuide(event: any) {
    const x = event.offsetX;
    const y = event.offsetY;

    this.guideTop = y + 10;
    this.guideLeft = x + 10;
  }

  public toRadians(angle) {
    return (angle * Math.PI) / 180;
  }

  public toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  public isOdd(num: number) {
    return num % 2;
  }

  public rotateCoords(cx, cy, x, y, angle) {
    // calculates the new locations of x y after a rotation is applied
    // cx and cy are the point around which the x and y are rotated
    const rad = (angle * Math.PI) / 180.0;
    const nx = Math.cos(rad) * (x - cx) - Math.sin(rad) * (y - cy) + cx;
    const ny = Math.sin(rad) * (x - cx) + Math.cos(rad) * (y - cy) + cy;

    return [Math.round(nx), Math.round(ny)];
  }
}

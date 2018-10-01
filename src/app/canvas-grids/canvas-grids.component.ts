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
  canvasWidth = 826;
  canvasHeight = 500;

  newDesign = true;
  gridType: string;
  rulerMultiplier = 24;
  hRulerSections = 33;
  hRulerLabels = [];
  vRulerSections = 20;
  vRulerLabels = [];

  // css bindings
  guideTop = 10;
  guideLeft = 10;
  rulerBackgroundSize = '50px 15px';
  labelWidth = '50px';
  rulerHeight = '';
  rulerWidth = '';

  constructor(
    public debug: DebugService,
    public alert: AlertService,
    public sanitizer: DomSanitizer,
    public feature: Feature,
    public route: ActivatedRoute,
    public profile: ProfileFeature
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['type']) {
        this.gridType = params['type'];
        if (this.gridType === 'profile') {
          this.gridType = typeof params['param2'] === 'undefined' || !params['params2'] ? 'swoon' : params['param2'];
        }
        if (this.gridType === 'hush-swoon') {
          this.gridType = 'hushSwoon';
        }
      }
      this.setGridDisplayValues();
    });
    this.debug.log('canvas-grids', this.gridType);
    this.feature.onZoomGrid.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.setGridDisplayValues();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public setGridDisplayValues() {
    this.debug.log('canvas-grids', 'setting grid display values');
    // backgroundWidth adjusts the size of each ruler section
    let backgroundWidth = 50;
    // set multiplier
    switch (this.gridType) {
      case 'velo':
        this.rulerMultiplier = this.feature.units === 'inches' ? 24 : 61;
        backgroundWidth = 50;
        this.vRulerSections = 11;
        this.hRulerSections = 18;
        break;
      case 'hushSwoon':
        this.rulerMultiplier = this.feature.units === 'inches' ? 12 : 31;
        this.vRulerSections = 20;
        this.hRulerSections = 34;
        backgroundWidth = 79;
        break;
      default:
        this.rulerMultiplier = this.feature.units === 'inches' ? 24 : 61;
        backgroundWidth = 50;
        break;
    }
    backgroundWidth = Math.round(backgroundWidth * this.feature.canvasGridScale);
    this.rulerBackgroundSize = `${backgroundWidth}px 15px`;
    this.rulerHeight = `${backgroundWidth * this.vRulerSections - (backgroundWidth - 5)}px`;
    this.rulerWidth = `${backgroundWidth * this.hRulerSections - (backgroundWidth - 5)}px`;
    this.labelWidth = `${backgroundWidth}px`;
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
}

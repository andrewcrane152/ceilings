import { Location } from '@angular/common';
import { SeeyondService } from './../_services/seeyond.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { DebugService } from './../_services/debug.service';
import { ApiService } from './../_services/api.service';
import { AlertService } from './../_services/alert.service';
import { Feature } from '../_features/feature';
import { User } from '../_models/user';
import { SeeyondFeature } from '../_features/seeyond-feature';

@Component({
  selector: 'app-quote-dialog',
  templateUrl: './quote-dialog.component.html',
  styleUrls: ['./quote-dialog.component.scss']
})
export class QuoteDialogComponent implements OnInit, AfterContentChecked {
  public tilesArray: any;
  public tileType: string;
  public units: string;
  private uiType = 'design';

  isSeeyond = false;
  isQuantityOrder = false;

  featureType: string;
  estimatedTotal: number;
  formattedWidth: string;
  formattedLength: string;
  formattedRadius: string;
  formattedCeilingLength: string;
  seeyondTessellation: string;
  seeyondPatternStrength: number;
  seeyondMaterial: string;
  seeyondCoveLighting: string;

  constructor(
    private router: Router,
    private debug: DebugService,
    private api: ApiService,
    private alert: AlertService,
    public feature: Feature,
    public dialog: MatDialog,
    public user: User,
    public dialogRef: MatDialogRef<QuoteDialogComponent>,
    public seeyond: SeeyondFeature,
    public seeyondApi: SeeyondService,
    public location: Location
  ) {}

  ngOnInit() {
    this.debug.log('quote-dialog', 'init quote-dialog');
    this.tilesArray = this.feature.getTilesPurchasedObj();
    this.tileType = this.feature.getTileType('plural');
    this.units = this.feature.units === 'inches' ? '"' : 'cm';
    this.setTemplateValues();
  }

  ngAfterContentChecked() {}

  setTemplateValues() {
    this.debug.log('quote-dialog', 'got here');
    this.isSeeyond = this.feature.getFeatureNameForUrl() === 'seeyond';
    this.isQuantityOrder = this.feature.is_quantity_order;
    this.featureType = this.feature.getFeatureHumanName();
    if (this.featureType === 'Seeyond') {
      this.estimatedTotal = this.seeyond.estimated_amount * this.feature.quantity;
      this.formattedWidth = `${this.seeyond.width}${this.units}`;
      this.formattedLength = `${this.seeyond.height}${this.units}`;
      this.formattedRadius = this.seeyond.seeyond_feature_type === 'curved-partition' ? `${this.seeyond.radius}${this.units}` : '';
      this.formattedCeilingLength = this.seeyond.seeyond_feature_type === 'wall-to-ceiling' ? `${this.seeyond.ceiling_length}${this.units}` : '';
      this.seeyondTessellation = this.seeyond.getTessellationName(this.seeyond.tessellation);
      this.seeyondPatternStrength = this.seeyond.pattern_strength;
      this.seeyondMaterial = `${this.seeyond.material}`;
      this.seeyondCoveLighting =
        this.seeyond.seeyond_feature_type === 'wall-to-ceiling' || this.seeyond.seeyond_feature_type === 'ceiling'
          ? this.seeyond.cove_lighting
            ? 'Yes'
            : 'No'
          : '';
    } else {
      this.estimatedTotal = this.feature.estimated_amount * this.feature.quantity;
      this.formattedWidth = `${this.feature.width}${this.units}`;
      this.formattedLength = `${this.feature.length}${this.units}`;
    }
  }

  multiplesChanged() {
    this.debug.log('quote-dialog', `multiples: ${this.feature.quantity}`);
    this.setTemplateValues();
  }

  validInputs() {
    let isValid = false;
    // if (this.feature.feature_type !== 'seeyond') {
    isValid = !!this.feature.project_name && !!this.feature.specifier;
    // } else {
    //   isValid = !!this.seeyond.project_name && !!this.seeyond.specifier;
    // }
    return isValid;
  }

  public quoteConfirmed() {
    if (this.feature.feature_type === 'seeyond') {
      this.seeyondQuoteConfirmed();
      return;
    }
    if (this.feature.is_quantity_order) {
      this.uiType = 'quantity';
    }
    // mark the design as quoted and save
    if (this.feature.id) {
      this.feature.quoted = true;
      this.api.updateDesign().subscribe(feature => {
        // send ceilings design email after we have saved.
        this.api.sendEmail().subscribe(response => {
          this.debug.log('quote-dialog', response);
        });
        // navigate if the current path isn't already right
        const url = this.router.createUrlTree([`${this.feature.getFeatureNameForUrl()}/${this.uiType}/${this.feature.id}`]).toString();
        if (url !== this.router.url) {
          this.router.navigate([`${this.feature.getFeatureNameForUrl()}/${this.uiType}/${this.feature.id}`]);
        }
        this.alert.success('Your quote request has been sent.');
      });
    } else {
      if (!this.feature.design_name) {
        // set the design name to something simple
        this.feature.design_name = this.feature.feature_type + ' - ' + this.getToday();
      }
      this.feature.quoted = true;
      this.api.saveDesign().subscribe(feature => {
        // send ceilings design email after we have saved.
        this.feature.id = feature.ceiling.id;
        this.api.sendEmail().subscribe(response => {
          this.debug.log('quote-dialog', response);
        });
        // redirect to the URL of the saved design.
        this.alert.success('We saved your design so we can quote it and you can load it later.');
        this.location.go(`${this.feature.getFeatureNameForUrl()}/${this.uiType}/${this.feature.id}`);
      });
    }
    this.dialogRef.close();
  }

  seeyondQuoteConfirmed() {
    // mark the design as quoted and save
    this.seeyond.quoted = true;
    this.seeyond.project_name = this.feature.project_name;
    this.seeyond.specifier = this.feature.specifier;
    if (this.seeyond.id) {
      this.seeyondApi.updateFeature().subscribe(feature => {
        // send seeyond design email after we have saved.
        this.seeyondApi.sendEmail().subscribe(response => {
          this.debug.log('quote-dialog', response);
        });
        // redirect to the new URL if we aren't already there.
        const url = this.router.createUrlTree([`${this.feature.feature_type}/${this.uiType}/${this.feature.id}`]).toString();
        if (url !== this.router.url) {
          this.router.navigate([`seeyond/design/${feature.seeyond.name}/${feature.seeyond.id}`]);
        }
        this.alert.success('Your quote request has been sent.');
      });
    } else {
      // set the design name to something simple
      this.seeyond.design_name = this.seeyond.seeyond_feature_type + ' - ' + this.getToday();
      this.seeyondApi.saveFeature().subscribe(feature => {
        // send seeyond design email after we have saved.
        // set the feature to what was returned.
        this.seeyond.id = feature.seeyond.id;
        this.seeyondApi.sendEmail().subscribe(response => {
          this.debug.log('quote-dialog', response);
        });
        // redirect to the URL of the saved design.
        this.alert.success('We saved your design so we can quote it and you can load it later.');
        this.location.go(`seeyond/design/${feature.seeyond.name}/${feature.seeyond.id}`);
      });
    }
    this.dialogRef.close();
  }

  private getToday() {
    const today = new Date();
    let todayString: string;
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    todayString = mm + '/' + dd + '/' + yyyy;
    return todayString;
  }
}

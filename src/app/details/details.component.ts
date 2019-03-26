import { SeeyondFeature } from 'app/_features/seeyond-feature';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DebugService } from './../_services/debug.service';
import { ApiService } from './../_services/api.service';
import { Feature } from '../_features/feature';
import { SeeyondService } from '../_services/seeyond.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterContentInit {
  public rep: any;
  public tilesArray: any;
  public tileArraySize: number;
  public design: any;
  public isSeeyond = false;
  public tessellationStr: string;
  public featureHumanName: string;
  public dimensionStr: string;
  public totalUsed: number;
  public totalReceiving: number;
  public totalUnused: number;
  public tilesSoldString: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private debug: DebugService,
    private api: ApiService,
    public feature: Feature,
    public location: Location,
    public seeyondApi: SeeyondService,
    public seeyond: SeeyondFeature,
    public alert: AlertService
  ) {}

  ngOnInit() {
    this.feature.showMainNavbar.emit(false);
    this.route.params.subscribe(params => {
      if (params['type'] === 'hush') {
        this.location.go(this.router.url.replace(/hush\/design/g, 'hush-blocks/design'));
      }
      const designId = parseInt(params['param1'], 10) || parseInt(params['param2'], 10);
      if (!!designId) {
        if (params['type'] === 'seeyond') {
          this.isSeeyond = true;
          this.seeyondApi.loadFeature(designId).subscribe(design => {
            if (!design.quoted) {
              // not quoted
              const pathname = window.location.pathname.replace(/\/details/g, '');
              this.router.navigate([pathname]);
            } else {
              this.design = design;
              this.tessellationStr = this.seeyond.getTessellationName(design.tessellation);
              this.debug.log('seeyond', design);
              // load the quoted design
              this.api.getUserRep(design.uid).subscribe(rep => {
                this.rep = rep;
                this.setTemplateValues();
              });
            }
          });
        } else {
          this.api.loadDesign(designId).subscribe(design => {
            if (design.is_quantity_order) {
              const newUrl = window.location.pathname.replace(/design/, 'quantity');
              this.router.navigate([newUrl]);
            }
            if (!design.quoted) {
              // not quoted
              this.alert.error('Details are not available until a request for a quote is processed.');
              this.router.navigate([design.feature_type, 'design', design.id]);
            } else {
              // load the quoted design
              this.api.getUserRep(design.uid).subscribe(rep => {
                this.rep = rep;
                this.feature.setDesign(design);
                this.tilesArray = this.feature.getTilesPurchasedObj();
                this.tileArraySize = Object.keys(this.tilesArray).length;
                this.debug.log('details-component', this.tileArraySize);
                this.setTemplateValues();
              });
            }
          });
        }
      }
    });
  }

  ngAfterContentInit() {}

  setTemplateValues() {
    this.featureHumanName = this.feature.getFeatureHumanName();
    this.dimensionStr = this.setDimensionStr();
    this.tilesSoldString = this.feature.packageInformation();
    this.getTotals();
  }

  setDimensionStr() {
    const unitAbbreviation = this.feature.units === 'inches' ? `\"` : `cm`;
    switch (this.feature.feature_type) {
      case 'tetria':
      case 'hush':
      case 'clario':
      case 'hushSwoon':
        return `${this.feature.width}${unitAbbreviation} W x ${this.feature.length}${unitAbbreviation} L`;
      default:
        return `TODO CREATE DEFAULT`;
    }
  }

  print() {
    window.print();
  }

  backToDesign() {
    const newUrl = window.location.pathname.replace(/details/, '');
    this.router.navigate([newUrl]);
  }

  getTotals() {
    // similar to tile-usage-component
    let totalReceiving = 0;
    let totalUsed = 0;
    let totalUnused = 0;
    let incrementReceiving;
    let incrementUsed;
    let incrementUnused;
    const purchased = this.feature.getTilesPurchasedObj();
    this.debug.log('details-component', purchased);
    for (const tileType in purchased) {
      if (purchased.hasOwnProperty(tileType)) {
        incrementReceiving = purchased[tileType].purchased;
        totalReceiving += incrementReceiving;
        incrementUsed = purchased[tileType].used;
        totalUsed += incrementUsed;
        incrementUnused = purchased[tileType].purchased - purchased[tileType].used;
        totalUnused += incrementUnused;
      }
    }
    this.totalUsed = totalUsed;
    this.totalReceiving = totalReceiving;
    this.totalUnused = totalUnused;
  }
}

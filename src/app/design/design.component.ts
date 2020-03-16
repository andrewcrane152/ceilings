import { ConfirmDuplicateComponent } from './../confirm-duplicate/confirm-duplicate.component';
import { MaterialsService } from './../_services/materials.service';
import { SeeyondService } from './../_services/seeyond.service';
import { SeeyondFeature } from '../_features/seeyond-feature';
import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { DebugService } from './../_services/debug.service';
import { ApiService } from './../_services/api.service';
import { OptionsComponent } from '../options/options.component';
import { LoadDesignComponent } from '../load-design/load-design.component';
import { SaveDesignComponent } from '../save-design/save-design.component';
import { LoginComponent } from '../login/login.component';
import { VisualizationComponent } from '../visualization/visualization.component';
import { TileUsageComponent } from '../tile-usage/tile-usage.component';
import { VeloTileUsageComponent } from '../velo-tile-usage/velo-tile-usage.component';
import { QuoteDialogComponent } from '../quote-dialog/quote-dialog.component';
import { Feature } from '../_features/feature';
import { User } from '../_models/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as FileSaver from 'file-saver';
import * as html2canvas from 'html2canvas';
import { AlertService } from 'app/_services/alert.service';
import { ClarioGridsService } from '../_services/clario-grids.service';

@Component({
  // selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit, OnDestroy {
  syd_v = require('syd-visualization');
  ngUnsubscribe: Subject<any> = new Subject();
  optionsDialogRef: MatDialogRef<any>;
  loadDesignDialogRef: MatDialogRef<any>;
  saveDesignDialogRef: MatDialogRef<any>;
  loginDialogRef: MatDialogRef<any>;
  view3dDialogRef: MatDialogRef<any>;
  tileUsageDialogRef: MatDialogRef<any>;
  position = 'above';
  FileSaver = FileSaver;
  featureTiles: any;
  materials: any;
  tryingRequestQuote = false;
  canQtyOrder = false;
  canvasGridFeatures = ['velo', 'clario-cloud', 'profile', 'hushSwoon'];
  useCanvasGrid = false;
  useSeeyondGrid = false;
  useRepeatingGrid = false;
  designFeatures = ['seeyond', 'tetria', 'clario', 'velo', 'hush', 'profile', 'hushSwoon', 'clario-cloud'];

  // right side expansion panels
  showDesign = false;
  showSeeyondOptions = false;
  showProfileFeatureSelection = false;
  showProfileSelectionPalette = false;
  showModify = false;
  showClarioDimensions = false;
  showDimensions = false;
  showCanvasGridControls = false;

  quantitiesString = '';
  gridRequirementsString = '';
  showGuidesCheckbox = true;
  show3DViewButton = true;
  designViewType = '';

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public debug: DebugService,
    public api: ApiService,
    public feature: Feature,
    public dialog: MatDialog,
    public user: User,
    public seeyond: SeeyondFeature,
    public seeyondService: SeeyondService,
    public alert: AlertService,
    public location: Location,
    public materialsService: MaterialsService,
    public clarioGrids: ClarioGridsService,
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('accordian_open', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tools/accordian-open.svg'));
    iconRegistry.addSvgIcon('accordian_close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/tools/accordian-close.svg'));
  }

  ngOnInit() {
    this.debug.log('design-component', 'init');
    this.feature.showMainNavbar.emit(true);
    this.route.params.subscribe(params => {
      // default the feature type
      let featureType;
      if (params['type']) {
        featureType = this.feature.feature_type = this.feature.setFeatureType(params['type']);
        if (featureType === 'hush') {
          this.location.go(this.router.url.replace(/hush\/design/g, 'hush-blocks/design'));
        } else if (featureType === 'hushSwoon') {
          this.location.go(this.router.url.replace(/hushSwoon\/design/g, 'hush-swoon/design'));
        }
        this.setCanQtyOrder();
      }
      this.setVisualProperties(featureType);
      if (!this.designFeatures.includes(featureType)) {
        this.feature.navToLanding();
        return;
      }
      if (featureType === 'seeyond') {
        this.useSeeyondGrid = true;
        this.setSeeyondFeature(params);
        return;
      }

      this.debug.log('design', `featureType: ${featureType}`);
      if (this.canvasGridFeatures.includes(featureType)) {
        this.useCanvasGrid = true;
        this.useRepeatingGrid = false;
      } else {
        this.useCanvasGrid = false;
        this.useRepeatingGrid = true;
      }

      // if one of the params are an integer we need to load the design
      const designId = parseInt(params['param1'], 10) || parseInt(params['param2'], 10) || parseInt(params['param3'], 10);
      if (!!designId) {
        // if designId is truthy
        this.api.loadDesign(designId).subscribe(
          design => {
            if (design == null) {
              // design not found redirect to the design url
              this.debug.log('design-component', 'design not found');
              this.router.navigate([params['type'], 'design']);
            } else {
              // design was found so load it.
              this.feature.loadedDesign = design;
              this.feature.is_quantity_order = design.is_quantity_order;
              if (design.is_quantity_order) {
                this.router.navigate([`${design.feature_type}/quantity`, design.id]);
                return;
              }
              const designFeature = this.feature.setFeatureType(design.feature_type);
              if (designFeature === params['type']) {
                this.debug.log('design-component', 'setting the design.');
                design.feature_type = designFeature;
                this.feature.setDesign(design);
                this.featureTiles = this.feature.tilesArray[featureType];
                this.materials = this.feature.getFeatureMaterials();
                switch (this.feature.feature_type) {

                  case 'clario':
                    this.feature.grid_type = design.grid_type;
                    this.feature.tile_size = design.tile_size;
                    this.feature.clairoTileSizeType = this.feature.getClarioGridType(design.tile_size);
                    this.clarioGrids.gridSizeSelected(design.grid_type);
                    this.clarioGrids.loadSelectedTileSize(design.tile_size);
                    // Clario needs to have tiles set before the grid can be built properly.
                    this.feature.buildGrid();
                    break;

                  case 'velo':
                    if (JSON.parse(design.grid_data).length === 360) {
                      this.feature.useOldVeloGrid = true;
                    }
                    this.feature.checkVeloOldMaterials();
                    this.feature.updateSelectedTile(this.materialsService.tilesArray.velo[0]);
                    this.feature.material = 'jasper';
                    this.feature.materialHex = '#932926';
                    this.feature.materialType = 'felt';
                    this.feature.toolsArray = ['remove'];
                    break;

                  case 'clario-cloud':
                    this.feature.material = 'jasper'
                    this.feature.toolsArray = ['remove', 'pattern-direction'];
                    break;

                  case 'hush':
                    this.feature.updateSelectedTile(this.materialsService.tilesArray.hush[0]);
                    this.feature.toolsArray = ['remove'];
                    break;

                  case 'tetria':
                    this.feature.updateSelectedTile(this.materialsService.tilesArray.tetria[0]);
                    break;
                }
              } else {
                this.router.navigate([design.feature_type, 'design', design.id]);
              }
            }
            this.feature.checkForDeprecatedMaterials();
            this.feature.checkUrlForDuplicate();
          },
          err => this.api.handleError(err)
        );
      } else {
        setTimeout(() => {
          this.feature.feature_type = this.feature.setFeatureType(params['type']);
          // set the default values for tile and material
          this.debug.log('design-component', `feature_type: ${this.feature.feature_type}`);
          if (this.feature.feature_type === 'tetria') {
            this.feature.updateSelectedTile(this.materialsService.tilesArray.tetria[0]);
            this.feature.material = 'jasper';
          } else if (this.feature.feature_type === 'hush') {
            this.feature.updateSelectedTile(this.materialsService.tilesArray.hush[0]);
            this.feature.material = 'nickel';
            this.feature.toolsArray = ['remove'];
          } else if (this.feature.feature_type === 'seeyond') {
            this.setSeeyondFeature(params);
          } else if (this.feature.feature_type === 'clario') {
            this.clarioGrids.gridSizeSelected('15/16');
            this.feature.updateSelectedTile(this.materialsService.tilesArray.clario[1]);
            this.feature.material = 'nickel';
          } else if (this.feature.feature_type === 'velo') {
            this.feature.updateSelectedTile(this.materialsService.tilesArray.velo[0]);
            this.feature.toolsArray = ['remove'];
            this.feature.material = 'jasper';
            this.feature.materialHex = '#932926';
            this.feature.materialType = 'felt';
          } else if (this.feature.feature_type === 'clario-cloud') {
            this.feature.material = 'jasper'
            this.feature.toolsArray = ['remove', 'pattern-direction'];
          }
          this.materials = this.feature.getFeatureMaterials();
          this.debug.log('design-component', this.materials);
          this.debug.log('design-component', this.feature);
          this.featureTiles = this.feature.tilesArray[this.feature.feature_type];
          this.editOptions();
        }, 500);
      }
    });

    // subscribe to the saved event to close the save dialog
    this.api.onSaved.pipe(takeUntil(this.ngUnsubscribe)).subscribe(success => {
      this.feature.isDuplicating = false;
      if (this.saveDesignDialogRef) {
        this.saveDesignDialogRef.close();
      }
    });

    // subscribe to the loadDesigns event to handle it all here.
    // this will come from the options component
    this.feature.onLoadDesigns
      // .takeUntil(this.ngUnsubscribe)
      .subscribe(success => {
        this.debug.log('design-component', 'loading design event subscription');
        this.loadDesigns();
      });

    // subscribe to the loaded event to close the load dialog
    this.api.onLoaded
      // .takeUntil(this.ngUnsubscribe)
      .subscribe(success => {
        if (this.loadDesignDialogRef) {
          this.loadDesignDialogRef.close();
        }
        if (this.optionsDialogRef) {
          this.optionsDialogRef.close();
        }
      });

    // subscribe to the loggedIn event and set the user attributes
    this.api.onUserLoggedIn.subscribe(data => {
      this.user.uid = data.uid;
      this.user.email = data.email;
      this.user.firstname = data.firstname;
      this.user.lastname = data.lastname;
      this.setVisualProperties(this.feature.feature_type);
    });

    // subscribe to the onView3d event and build the dialog
    this.feature.onView3d.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.debug.log('design-component', 'view 3d event');
      this.view3d();
    });
  } // end ngOnInit()

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setVisualProperties(feature) {
    this.api.checkToShowPricing();
    this.designViewType = this.feature.getViewType();
    switch (feature) {
      case 'seeyond':
        this.showSeeyondOptions = true;
        this.showGuidesCheckbox = false;
        this.show3DViewButton = false;
        break;
      case 'profile':
        this.showProfileFeatureSelection = true;
        this.showProfileSelectionPalette = true;
        this.showDesign = true;
        this.showModify = true;
        break;
      case 'clario':
        this.showClarioDimensions = true;
        this.showDesign = true;
        this.showModify = true;
        this.gridRequirementsString = `A 15/16\" or 9/16\" grid system is required for this product.`;
        this.quantitiesString = this.getClarioQuantityStr();
        break;
      case 'tetria':
        this.showDimensions = true;
        this.showDesign = true;
        this.showModify = true;
        this.gridRequirementsString = `A 15/16\" or 9/16\" grid system is required for this product.`;
        this.quantitiesString = 'Tetria tiles are sold in quantities of 4.';
        break;
      case 'velo':
        this.showDesign = true;
        this.showModify = true;
        this.showCanvasGridControls = true;
        this.quantitiesString = 'Velo tiles are sold in quantities of 8.';
        break;
      case 'hush':
        this.showDimensions = true;
        this.showDesign = true;
        this.showModify = true;
        break;
      case 'clario-cloud':
        this.showDesign = true;
        this.showModify = true;
        this.showCanvasGridControls = true;
        // this.showCanvasGridControls = false;
        this.show3DViewButton = false;
        break;
      case 'hushSwoon':
        this.showDesign = true;
        this.showModify = true;
        this.showCanvasGridControls = true;
        this.showGuidesCheckbox = false;
        break;
    }
  }

  getClarioQuantityStr() {
    let smallBaffle = '24x24';
    let largeBaffle = '24x48';
    if (!!this.clarioGrids.selectedTileSize) {
      smallBaffle = this.clarioGrids.selectedTileSize['24'];
      largeBaffle = this.clarioGrids.selectedTileSize['48'];
    }
    return `${smallBaffle} baffles are sold in qty of 4, and ${largeBaffle} baffles are sold in qty of 2.`;
  }

  public editOptions() {
    // load a dialog to edit the options
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.height = '90%';
    config.width = '80%';
    this.optionsDialogRef = this.dialog.open(OptionsComponent, config);
    this.optionsDialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.updateGrid();
      });
  }

  public loadDesigns() {
    if (this.feature.feature_type === 'seeyond') {
      this.loadSeeyondDesigns();
      return;
    }
    // If the user is not logged in then present the login dialog
    if (!this.user.isLoggedIn()) {
      this.loginDialog(true);
    } else {
      // let loadDialog: MatDialog;
      this.api
        .getMyDesigns()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(designs => {
          this.loadDesignDialogRef = this.dialog.open(LoadDesignComponent, new MatDialogConfig());
          this.loadDesignDialogRef.componentInstance.designs = designs;
        });
    }
  }

  public loadSeeyondDesigns() {
    // If the user is not logged in then present the login dialog
    if (!this.user.isLoggedIn()) {
      this.loginDialog(true);
    } else {
      // let loadDialog: MatDialog;
      this.seeyondService
        .getMyFeatures()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(designs => {
          this.loadDesignDialogRef = this.dialog.open(LoadDesignComponent, new MatDialogConfig());
          this.loadDesignDialogRef.componentInstance.designs = designs;
        });
    }
  }

  public saveDesign() {
    this.saveDesignDialogRef = this.dialog.open(SaveDesignComponent, new MatDialogConfig());
  }

  public loginDialog(load: boolean = false) {
    this.debug.log('design-component', 'displaying login dialog');
    const config = new MatDialogConfig();
    config.disableClose = true;
    this.loginDialogRef = this.dialog.open(LoginComponent, config);
    this.loginDialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result === 'cancel') {
          this.tryingRequestQuote = false;
          // we need to close the savedDialog too if it's open.
          if (this.saveDesignDialogRef) {
            this.saveDesignDialogRef.close();
            return;
          }
        } else if (load) {
          // the user should be logged in now, so show the load dialog
          this.loadDesigns();
        }
        if (this.tryingRequestQuote) {
          this.tryingRequestQuote = false;
          this.requestQuote();
        }
      });
  }

  viewDetails() {
    let path = window.location.pathname;
    path = `${path}/details`;
    this.router.navigate([path]);
  }

  duplicateDesign() {
    const config = new MatDialogConfig()
    config.width = '600px';
    const dialogRef = this.dialog.open(ConfirmDuplicateComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.feature.duplicateOrder();
      }
    })
  }

  public logout() {
    this.api.logout();
    this.user = new User();
  }

  public view3d() {
    this.debug.log('design-component', 'displaying 3d dialog');
    // display the dialog where the 3d visualization will be rendered
    this.view3dDialogRef = this.dialog.open(VisualizationComponent, new MatDialogConfig());
  }

  public tileUsage() {
    const config = new MatDialogConfig();
    if (this.feature.feature_type === 'velo') {
      this.tileUsageDialogRef = this.dialog.open(VeloTileUsageComponent, config);
    } else {
      this.tileUsageDialogRef = this.dialog.open(TileUsageComponent, config);
    }
  }

  public downloadGridGuide() {
    this.debug.log('design-component', 'generating grid guide');
    const _this = this;
    html2canvas(document.getElementById('grid'), {
      onrendered: function(canvas) {
        const theCanvas = canvas;
        const dataURL = theCanvas.toDataURL();
        _this.debug.log('design-guide-data-url', dataURL);
        _this.feature.design_data_url = dataURL;
      }
    });
  }

  public requestQuote() {
    if (!this.user.isLoggedIn()) {
      this.tryingRequestQuote = true;
      this.loginDialog();
      return;
    }
    if (this.feature.canvasGridScale !== 1) {
      this.zoomCanvasGrid('default');
    }
    // get the grid with guides
    // make sure the guide is set to true
    this.feature.showGuide = true;
    if (this.feature.feature_type === 'velo') {
      const veloCanvas = document.querySelector('canvas');
      const dataURL = veloCanvas.toDataURL();
      this.feature.design_data_url = dataURL;
    } else if (this.feature.feature_type === 'clario-cloud') {
      const ccCanvas = document.querySelector('canvas');
      const dataURL = ccCanvas.toDataURL();
      this.feature.design_data_url = dataURL;
    } else if (this.feature.feature_type === 'seeyond') {
      this.seeyond.seeyondProfileImage();
    } else {
      this.downloadGridGuide();
    }
    // load the dialog to confirm the design we will be sending
    const config = new MatDialogConfig();
    config.maxHeight = '90vh';
    const dialogRef = this.dialog.open(QuoteDialogComponent, config);
  }

  adjustGridDimensions(tool) {
    let sizeIncrement = 24;
    if (this.feature.feature_type === 'clario') {
      switch (this.clarioGrids.selectedTileSize.tile_size_type) {
        case 'metric':
          sizeIncrement = 60;
          break;
        case 'german':
          sizeIncrement = 62.5;
          break;
        default:
          sizeIncrement = 24;
          break;
      }
    }
    switch (tool) {
      case 'addColumn':
        this.feature.width = Number(this.feature.width) + sizeIncrement;
        break;
      case 'removeColumn':
        this.feature.width = Number(this.feature.width) - sizeIncrement;
        break;
      case 'addRow':
        this.feature.length = Number(this.feature.length) + sizeIncrement;
        break;
      case 'removeRow':
        this.feature.length = Number(this.feature.length) - sizeIncrement;
        break;
      default:
        break;
    }
    this.feature.buildGrid();
  }

  adjustCanvasGridSize(selection) {
    switch (this.feature.feature_type) {
      case 'clario-cloud':
        this.feature.onAdjustClarioCloudGridSize.emit(selection);
        break;
      case 'velo':
        this.feature.onAdjustVeloGridSize.emit(selection);
        break;
    }
  }

  zoomCanvasGrid(direction) {
    if (direction === 'in') {
      if (this.feature.canvasGridScale >= 2.0) {
        return;
      }
      this.feature.canvasGridScale = Math.min(Number((this.feature.canvasGridScale + 0.1).toFixed(1)), 2);
    } else if (direction === 'out') {
      if (this.feature.canvasGridScale <= 0.5) {
        return;
      }
      this.feature.canvasGridScale = Math.max(Number((this.feature.canvasGridScale - 0.1).toFixed(1)), 0.4);
    } else if (direction === 'default') {
      this.feature.canvasGridScale = 1.0;
    }
    this.feature.onZoomGrid.emit();
    this.feature.buildGrid();
  }

  setCanQtyOrder() {
    const featuresWithQtyOrder = ['hush', 'clario', 'tetria', 'hushSwoon'];
    const featureType = this.feature.feature_type;
    this.canQtyOrder = featuresWithQtyOrder.includes(featureType);
  }

  goToQtyOrder() {
    this.router.navigate([`${this.feature.feature_type}/quantity`]);
    this.feature.reset();
  }

  setSeeyondFeature(urlParams) {
    this.seeyondService.getPrices().subscribe(prices => {
      this.seeyond.prices = prices;
      this.api.getPartsSubstitutes().subscribe(partsSubs => {
        this.materialsService.parts_substitutes = partsSubs;
        const params = Object.assign({}, urlParams);
        const designId = parseInt(params['param1'], 10) || parseInt(params['param2'], 10);
        if (!!designId) {
          // load requested id
          this.seeyondService.loadFeature(designId).subscribe(design => {
            const loadedDesign = design as any;
            this.location.go(`seeyond/design/${loadedDesign.name}/${loadedDesign.id}`);
            this.seeyond.loadSeeyondDesign(design);
            this.seeyond.checkUrlForDuplicate();
          });
        } else {
          // Set default param to wall if not specified
          if (params['type'] === 'seeyond' && !(params['param1'] || params['param2'])) {
            params['param1'] = 'wall';
          }

          // Determine the seeyond feature to load
          let seeyondFeature;
          const seeyondFeaturesList = this.seeyond.seeyond_features;
          Object.keys(seeyondFeaturesList).forEach(key => {
            if (
              Object.keys(params)
                .map(feature => params[feature])
                .indexOf(seeyondFeaturesList[key]['name']) > -1
            ) {
              seeyondFeature = seeyondFeaturesList[key]['name'];
            }
          });
          this.materials = this.feature.getFeatureMaterials();
          this.featureTiles = this.feature.tilesArray[this.feature.feature_type];
          this.editOptions();
          this.seeyond.updateSeeyondFeature(seeyondFeature);
        }
      });
    });
  }

  updateGridUnits(units: string) {
    this.debug.log('options-component', 'update grid units: ' + units);
    this.feature.units = units;
    if (this.feature.feature_type === 'seeyond') {
      this.seeyond.convertDimensionsUnits(units);
      this.seeyond.setMaxMinDimensions(units);
    }
    this.feature.updateGridUnits(units);
    if (this.feature.feature_type === 'hush') {
      this.adjustHushGrid();
    }
    this.updateGrid();
  }

  updateCanvasUnits(units: string) {
    this.debug.log('options-component', 'update grid units: ' + units);
    this.feature.units = units;
    this.updateGrid();
  }

  toggleCoveLighting() {
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

  alertQuoted() {
    this.alert.error('This design has been quoted and can not be altered.  To make changes, duplicate the design and submit a new request with your changes.');
  }

  updateGrid() {
    this.feature.buildGrid();
    this.feature.updateSelectedTile(this.feature.selectedTile);
  }

  adjustHushGrid() {
    let newWidth = Math.floor(this.feature.width / 24) * 24;
    let newLength = Math.floor(this.feature.length / 24) * 24;
    if (newWidth === 0) {
      newWidth = 24;
      this.alert.error(`Width rounded up to 24`);
    }
    if (newLength === 0) {
      newLength = 24;
      this.alert.error(`Length rounded up to 24`);
    }
    if (this.feature.width % 24 !== 0 && this.feature.length % 24 !== 0) {
      this.feature.width = newWidth;
      this.feature.length = newLength;
      this.alert.error(`Width and Height rounded to ${newWidth}x${newLength}`);
    } else if (this.feature.width % 24 !== 0) {
      this.feature.width = newWidth;
      this.alert.error(`Width rounded down to ${newWidth}`);
    } else if (this.feature.length % 24 !== 0) {
      this.feature.length = newLength;
      this.alert.error(`Height rounded down to ${newLength}`);
    }
  }

  clarioGridSizeChanged(selection) {
    if (!!this.feature.gridData) {
      this.feature.clearGridData();
    }
    this.clarioGrids.gridSizeSelected(selection);
    this.updateGrid();
  }

  clarioTileSizeChanged(selection) {
    if (!!this.feature.gridData) {
      this.feature.clearGridData();
    }
    this.clarioGrids.tileSizeSelected(selection);
    this.updateGrid();
  }
}

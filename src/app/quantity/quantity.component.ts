import { QuantityOptionsComponent } from './quantity-options/quantity-options.component';
import { ClarioGridsService } from './../_services/clario-grids.service';
import { QuoteDialogComponent } from './../quote-dialog/quote-dialog.component';
import { LoadDesignComponent } from './../load-design/load-design.component';
import { LoginComponent } from './../login/login.component';
import { SaveDesignComponent } from './../save-design/save-design.component';
import { User } from 'app/_models/user';
import { RemoveQuantityComponent } from './remove-quantity/remove-quantity.component';
import { MatDialog, MatDialogRef, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { AddQuantityComponent } from './add-quantity/add-quantity.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { AlertService } from '../_services/alert.service';
import { ApiService } from './../_services/api.service';
import { DebugService } from './../_services/debug.service';
import { Feature } from '../_features/feature';
import { Location } from '@angular/common';
import { QuantityService } from './quantity.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class TableDataSource extends MatTableDataSource<any> {
  constructor(private subject: BehaviorSubject<Order[]>) {
    super();
  }
}

export interface Order {
  material: any;
  qty: number;
  size: string;
  type: string;
}

export interface TileRow {
  purchased: number;
  image: string;
  used: number;
  material: string;
  tile: any;
}

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss']
})
export class QuantityComponent implements OnInit, AfterContentInit, OnDestroy {
  ngUnsubscribe: Subject<any> = new Subject();
  materials: any;
  order: any;
  orderName = '';
  addQtyDialogRef: MatDialogRef<any>;
  removeQtyDialogRef: MatDialogRef<any>;
  saveQtyDialogRef: MatDialogRef<any>;
  loadQtyDialogRef: MatDialogRef<any>;
  loginDialogRef: MatDialogRef<any>;
  quoteDialogRef: MatDialogRef<any>;
  clarioGridDialogRef: MatDialogRef<any>;
  sqFootage: number;
  sqMeters: number;
  tilesNeeded: number;
  tryingRequestQuote = false;
  quantityFeatures = ['tetria', 'clario', 'hush-blocks', 'profile', 'hush-swoon'];
  showQuantityEstimator = true;
  showDesignYourFeatureButton = true;
  soldInSingleQuantities = false;

  // Table Properties
  dataSource: TableDataSource | null;
  dataSubject = new BehaviorSubject<Order[]>([]);
  displayedColumns = ['material', 'used', 'receiving', 'unused', 'edit'];

  featureTitle = '';
  dimensionsText = '';
  dimensionsImgUrl = '';
  packageQtyInfo = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private debug: DebugService,
    private api: ApiService,
    public feature: Feature,
    private alert: AlertService,
    private location: Location,
    private dialog: MatDialog,
    public qtySrv: QuantityService,
    public user: User,
    public clarioGrids: ClarioGridsService
  ) {}

  ngOnInit() {
    this.feature.is_quantity_order = true;
    if (!this.feature.grid_type) {
      this.clarioGrids.gridSizeSelected('15/16');
    }
    this.route.params.subscribe(params => {
      // initial setup
      switch (params['type']) {
        case 'hush':
          this.location.go(this.router.url.replace(/hush\/quantity/g, 'hush-blocks/quantity'));
          break;
        case 'hushSwoon':
          this.location.go(this.router.url.replace(/hushSwoon\/quantity/g, 'hush-swoon/quantity'));
          break;
      }
      if (!this.quantityFeatures.includes(params['type'])) {
        this.debug.log('quantity', `params['type'] = ${params['type']}`);
        this.feature.navToLanding();
        return;
      }
      this.feature.feature_type = this.feature.setFeatureType(params['type']);
      this.materials = this.feature.getFeatureMaterials();
      this.setComponentProperties();
      this.order = this.qtySrv.order;

      if (this.feature.feature_type === 'hush') {
        this.feature.updateSelectedTile(this.feature.tilesArray.hush[0]);
      } else if (this.feature.feature_type === 'hushSwoon') {
        this.feature.updateSelectedTile(this.feature.tilesArray.hushSwoon[0]);
      } else if (this.feature.feature_type === 'tetria') {
        this.feature.updateSelectedTile(this.feature.tilesArray.tetria[0]);
      }

      // load saved if included in params
      const qtyId = parseInt(params['param1'], 10) || parseInt(params['param2'], 10);
      if (!!qtyId) {
        this.api.loadDesign(qtyId).subscribe(qtyOrder => this.loadQtyOrder(qtyOrder));
      } else {
        setTimeout(() => {
          this.goToOptions();
        }, 500);
      }

      this.clarioGrids.onTileSizeChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        // reset table data if the selected tile dimensions change
        this.order.data = [];
        this.qtySrv.updateSummary();
      });

      // subscribe to the loggedIn event and set the user attributes
      this.api.onUserLoggedIn.subscribe(data => {
        this.user.uid = data.uid;
        this.user.email = data.email;
        this.user.firstname = data.firstname;
        this.user.lastname = data.lastname;
        this.setComponentProperties();
      });
    });

    this.dataSource = new TableDataSource(this.dataSubject);
    this.dataSource.connect();
    this.feature.is_quantity_order = true;
    this.feature.showMainNavbar.emit(true);

    this.api.onUserLoggedIn.subscribe(apiUser => {
      this.user.uid = apiUser.uid;
      this.user.email = apiUser.email;
      this.user.firstname = apiUser.firstname;
      this.user.lastname = apiUser.lastname;
    });
  }

  ngAfterContentInit() {
    this.featureTitle = `${this.feature.getFeatureHumanName()} Quantity Order`;
    this.packageQtyInfo = this.feature.packageInformation();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadQtyOrder(qtyOrder) {
    this.debug.log('quantity', qtyOrder);
    if (!qtyOrder.is_quantity_order) {
      this.router.navigate([`${qtyOrder.feature_type}/design`, qtyOrder.id]);
    }
    if (qtyOrder.feature_type !== this.feature.feature_type) {
      this.location.go(`${qtyOrder.feature_type}/quantity/${qtyOrder.id}`);
    }
    if (this.feature.feature_type === 'hush') {
      const tilesObj = JSON.parse(qtyOrder.tiles);
      if (!!tilesObj) {
        for (const tileType in tilesObj) {
          // if (tilesObj.hasOwnProperty(tileType)) {
            // console.log('tilesObj:', tilesObj);
            // if (typeof tilesObj !== 'undefined' && tilesObj[tileType].tile.tile === '00') {
            if (tilesObj[tileType].tile.tile === '00') {
              tilesObj[tileType].tile.tile = '2-2-2';
              tilesObj[tileType].tile.tile_size = '2-2-2';
              tilesObj[tileType].tile.name = '2-2-2';
            }
          // }
        }
      }
      qtyOrder.tiles = JSON.stringify(tilesObj);
    }
    // this.feature.showMainNavbar.emit(true);
    this.qtySrv.order.data = [];
    this.feature.id = qtyOrder.id;
    this.feature.uid = qtyOrder.uid;
    this.feature.design_name = qtyOrder.design_name;
    this.feature.tiles = qtyOrder.tiles;
    this.feature.material = qtyOrder.material;
    this.feature.quoted = qtyOrder.quoted;
    if (this.feature.feature_type === 'clario') {
      this.clarioGrids.gridSizeSelected(qtyOrder.grid_type);
      this.clarioGrids.loadSelectedTileSize(qtyOrder.tile_size);
    } else {
      this.feature.selectedTile = this.materials;
    }
    const tilesObj = JSON.parse(qtyOrder.tiles);
    const rowsToAdd = Object.keys(tilesObj).map(key => tilesObj[key]);
    rowsToAdd.map(row => {
      const newRow = { [`${row.material}-${row.tile.tile}`]: row };
      this.qtySrv.doAddRow(newRow);
    });
  }

  goToOptions() {
    const config = new MatDialogConfig();
    config.height = '70%';
    config.width = '60%';
    config.disableClose = true;
    this.clarioGridDialogRef = this.dialog.open(QuantityOptionsComponent, config);
    // this.clarioGridDialogRef.afterClosed()
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(result => {
    //     console.log('result:', result);
    //   });
  }

  setComponentProperties() {
    this.api.checkToShowPricing();

    switch (this.feature.feature_type) {
      case 'hush':
        this.displayedColumns = ['hush-material', 'hush-receiving', 'edit'];
        this.showQuantityEstimator = false;
        this.showDesignYourFeatureButton = false;
        this.soldInSingleQuantities = true;
        break;
      case 'hushSwoon':
        this.displayedColumns = ['hush-material', 'hush-receiving', 'edit'];
        this.dimensionsText = 'Hush Swoon tiles are 8.66" wide x 5.21" high x 1" deep';
        this.dimensionsImgUrl = '/assets/images/tiles/hush-swoon/hush-swoon-measurement.png';
        this.showDesignYourFeatureButton = false;
        break;
      case 'profile':
        this.displayedColumns = ['profile-material', 'used', 'receiving', 'unused', 'edit'];
        this.dimensionsText = 'Swoon tiles are 8.66" wide x 5.21" high x 1" deep'; // TODO FOR DIFFERENT PROFILE TYPES
        this.dimensionsImgUrl = '/assets/images/tiles/hush-swoon/hush-swoon-measurement.png'; // TODO: get a profile one
        break;
      case 'clario':
        break;
      case 'tetria':
        break;
    }
  }

  backToDesign(reset?) {
    this.router.navigate([this.feature.feature_type, 'design']);
    if (reset === 'reset') {
      this.feature.reset();
    }
  }

  addToOrder() {
    const config = new MatDialogConfig();
    config.maxHeight = '90vh';
    this.addQtyDialogRef = this.dialog.open(AddQuantityComponent, config);
    this.addQtyDialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(requestedRow => {
        if (!!requestedRow) {
          let isMultiple = false;
          const res = requestedRow[Object.keys(requestedRow)[0]];
          this.qtySrv.order.data.map(row => {
            const rowStr = JSON.stringify(row);
            const newRow: TileRow = JSON.parse(rowStr);
            if (newRow.image === res.image) {
              isMultiple = true;
              this.qtySrv.combineRows(row, requestedRow);
            }
          });
          if (!isMultiple) {
            this.qtySrv.doAddRow(requestedRow);
          }
        }
      });
  }

  editRow(index, row) {
    const config = new MatDialogConfig();
    config.data = row;
    config.maxHeight = '90vh';

    this.addQtyDialogRef = this.dialog.open(AddQuantityComponent, config);
    this.addQtyDialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (!!result) {
          this.qtySrv.doEditRow(index, result);
          this.qtySrv.checkAndFixDuplicates();
        }
      });
  }

  deleteRow(index, row) {
    const removeRow = { index: index, row: row };
    this.removeQtyDialogRef = this.dialog.open(RemoveQuantityComponent, { data: removeRow });
    this.removeQtyDialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result === 'remove') {
          this.qtySrv.order.data.splice(index, 1);
        }
        this.qtySrv.order.data = this.qtySrv.order.data.slice();
        this.qtySrv.updateSummary();
      });
  }

  requestQuote() {
    if (!this.user.isLoggedIn()) {
      this.tryingRequestQuote = true;
      this.loginDialog();
      return;
    }
    const config = new MatDialogConfig();
    config.maxHeight = '90vh';
    this.quoteDialogRef = this.dialog.open(QuoteDialogComponent, config);
  }

  viewDetails() {
    let path = window.location.pathname;
    path = `${path}/details`;
    this.router.navigate([path]);
  }

  calcSqFootage() {
    switch (this.feature.feature_type) {
      case 'hushSwoon':
        this.tilesNeeded = Math.ceil(this.sqFootage / this.qtySrv.getTileSqArea());
        break;
      default:
        this.tilesNeeded = Math.ceil(this.sqFootage / 4);
        break;
    }
  }

  calcSqMeters() {
    if (this.feature.feature_type === 'clario') {
      if (this.clarioGrids.selectedTileSize.tile_size.type === 'meters') {
        // one 600x600mm tile is 0.36 Sq m
        this.tilesNeeded = Math.ceil(this.sqMeters / 0.36);
      }
      if (this.clarioGrids.selectedTileSize.tile_size.type === 'german') {
        // one 625x625mm tile is 0.390625 Sq m
        this.tilesNeeded = Math.ceil(this.sqMeters / 0.390625);
      }
    }
    // one 24x24in tile is 0.371612 Sq m
    this.tilesNeeded = Math.ceil(this.sqMeters / 0.371612);
  }

  public saveQuantity() {
    this.saveQtyDialogRef = this.dialog.open(SaveDesignComponent, new MatDialogConfig());
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
          if (this.saveQtyDialogRef) {
            this.saveQtyDialogRef.close();
            return;
          }
        } else if (load) {
          // the user should be logged in now, so show the load dialog
          this.loadQuantity();
        }
        if (this.tryingRequestQuote) {
          this.tryingRequestQuote = false;
          this.requestQuote();
        }
      });
  }

  public loadQuantity() {
    // If the user is not logged in then present the login dialog
    if (!this.user.isLoggedIn()) {
      this.loginDialog(true);
    } else {
      this.api
        .getMyDesigns()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(designs => {
          this.loadQtyDialogRef = this.dialog.open(LoadDesignComponent, new MatDialogConfig());
          this.loadQtyDialogRef.componentInstance.designs = designs;
        });
    }
  }
}

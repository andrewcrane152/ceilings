import { ClarioGridsService } from './../../_services/clario-grids.service';
import { DebugService } from './../../_services/debug.service';
import { QuantityService } from './../../quantity/quantity.service';
import { BehaviorSubject } from 'rxjs';
import { TableDataSource, Order } from './../../quantity/quantity.component';
import { Feature } from './../../_features/feature';
import { AlertService } from './../../_services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_services/api.service';

@Component({
  selector: 'app-quantity-details',
  templateUrl: './quantity-details.component.html',
  styleUrls: ['./quantity-details.component.scss']
})
export class QuantityDetailsComponent implements OnInit {
  public rep: any;
  public qtyOrder: any;

  dataSource: TableDataSource | null;
  dataSubject = new BehaviorSubject<Order[]>([]);
  // displayedColumns = ['ordered', 'material', 'total'];
  displayedColumns = ['used', 'receiving', 'unused', 'material', 'total'];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private alert: AlertService,
    public feature: Feature,
    public qtySrv: QuantityService,
    private debug: DebugService,
    private clarioGrids: ClarioGridsService
  ) {}

  ngOnInit() {
    if (!window.location.pathname.includes('quantity')) {
      this.location.go(window.location.pathname || '');
      return;
    }
    this.route.params.subscribe(params => {
      if (params['type'] === 'hush') {
        this.location.go(this.router.url.replace(/hush\/design/g, 'hush-blocks/design'));
      }
      this.feature.feature_type = this.feature.setFeatureType(params['type']);
      if (this.feature.feature_type === 'hush') {
        this.displayedColumns = ['hush-receiving', 'hush-material', 'total'];
      }
      const orderId = parseInt(params['param1'], 10) || parseInt(params['param2'], 10);
      if (!!orderId) {
        this.api.loadDesign(orderId).subscribe(qtyOrder => {
          this.debug.log('quantity', qtyOrder);
          if (!qtyOrder.is_quantity_order) {
            const newUrl = window.location.pathname.replace(/quantity/, 'design');
            this.router.navigate([newUrl]);
          }
          if (!qtyOrder.quoted) {
            this.alert.error('Details are not available until a request for a quote is processed.');
            this.router.navigate([qtyOrder.feature_type, 'quantity', qtyOrder.id]);
          } else {
            this.api.getUserRep(qtyOrder.uid).subscribe(rep => {
              this.rep = rep;
              if ( !this.qtySrv.order || this.qtySrv.order.data.length <= 0 ) {
                this.setOrderData(qtyOrder);
              }
            });
          }
          this.clarioGrids.gridSizeSelected(qtyOrder.grid_type);
          this.clarioGrids.loadSelectedTileSize(qtyOrder.tile_size);
          this.dataSource = new TableDataSource(this.dataSubject);
          this.dataSource.connect();
          this.feature.is_quantity_order = true;
          this.qtyOrder = this.qtySrv.order;
        });
      }
    });
  }

  setOrderData(qtyOrder) {
    this.feature.is_quantity_order = true;
    this.feature.project_name = qtyOrder.project_name;
    this.feature.specifier = qtyOrder.specifier;
    this.feature.id = qtyOrder.id;
    this.feature.uid = qtyOrder.uid;
    this.feature.design_name = qtyOrder.design_name;
    this.feature.tiles = qtyOrder.tiles;
    this.feature.material = qtyOrder.material;
    this.feature.quoted = qtyOrder.quoted;

    if (this.qtyOrder.data.length < 1) {
      const tilesObj = JSON.parse(qtyOrder.tiles);
      const rowsToAdd = Object.keys(tilesObj).map(key => tilesObj[key]);
      rowsToAdd.map(row => {
        const newRow = { [`${row.material}-${row.tile.tile}`]: row };
        this.qtySrv.doAddRow(newRow);
      });
    }
  }

  backToDesign() {
    const newUrl = window.location.pathname.replace(/details/, '');
    this.router.navigate([newUrl]);
  }

  print() {
    window.print();
  }
}

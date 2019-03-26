import { MatDialogRef } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { DebugService } from './../_services/debug.service';
import { Feature } from '../_features/feature';

@Component({
  selector: 'app-tile-usage',
  templateUrl: './tile-usage.component.html',
  styleUrls: ['./tile-usage.component.scss']
})
export class TileUsageComponent implements OnInit {
  @Input()
  isImbedded = false;
  public purchasedTiles: any;
  public position = 'above';
  public totalUsed: number;
  public totalReceiving: number;
  public totalUnused: number;

  showUsedColumn = true;
  showReceivingColumn = true;
  showUnusedColumn = true;
  showQuantityColumn = false;

  constructor(private debug: DebugService, public feature: Feature, public dialogRef: MatDialogRef<TileUsageComponent>) {}

  ngOnInit() {
    this.purchasedTiles = this.feature.getTilesPurchasedObj();
    this.getTotals();
    this.setTableProperties();
  }

  setTableProperties() {
    switch (this.feature.feature_type) {
      case 'hush':
      case 'hushSwoon':
        this.showUsedColumn = false;
        this.showReceivingColumn = false;
        this.showUnusedColumn = false;
        this.showQuantityColumn = true;
        break;
      default:
        this.showUsedColumn = true;
        this.showReceivingColumn = true;
        this.showUnusedColumn = true;
        this.showQuantityColumn = false;
    }
  }

  getTotals() {
    // similiar to details-component
    let totalReceiving = 0;
    let totalUsed = 0;
    let totalUnused = 0;
    let incrementReceiving;
    let incrementUsed;
    let incrementUnused;
    const purchased = this.purchasedTiles;
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

  public tooltip(tile) {
    return `${tile.material}-${tile.tile}`;
  }
}

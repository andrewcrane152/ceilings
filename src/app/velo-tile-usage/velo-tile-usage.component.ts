import { MatDialogRef } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { DebugService } from './../_services/debug.service';
import { Feature } from '../_features/feature';

@Component({
  selector: 'app-velo-tile-usage',
  templateUrl: './velo-tile-usage.component.html',
  styleUrls: ['../tile-usage/tile-usage.component.scss', './velo-tile-usage.component.scss']
})
export class VeloTileUsageComponent implements OnInit {
  @Input()
  isImbedded = false;
  public feltTiles: {};
  public variaTiles: {};
  public position = 'above';
  public totalFeltConvex: number;
  public totalFeltConcave: number;
  public totalFeltUnused: number;
  public totalFeltReceiving: number;
  public totalVariaConvex: number;
  public totalVariaConcave: number;
  public totalVariaUnused: number;
  public totalVariaReceiving: number;
  hasTotals = false;

  constructor(private debug: DebugService, public feature: Feature, public dialogRef: MatDialogRef<VeloTileUsageComponent>) {}

  ngOnInit() {
    this.feltTiles = this.feature.getPurchasedVeloTiles('felt');
    this.variaTiles = this.feature.getPurchasedVeloTiles('varia');
    this.getTotals();
  }

  getTotals() {
    let totalFeltConvex = 0;
    let totalFeltConcave = 0;
    let totalFeltUnused = 0;
    let totalFeltReceiving = 0;
    let totalVariaConvex = 0;
    let totalVariaConcave = 0;
    let totalVariaUnused = 0;
    let totalVariaReceiving = 0;
    let incrementTotalFeltConvex;
    let incrementTotalFeltConcave;
    let incrementTotalFeltUnused;
    let incrementTotalFeltReceiving;
    let incrementTotalVariaConvex;
    let incrementTotalVariaConcave;
    let incrementTotalVariaUnused;
    let incrementTotalVariaReceiving;
    const purchasedFelt = this.feltTiles;
    const purchasedVaria = this.variaTiles;
    for (const felt in purchasedFelt) {
      if (purchasedFelt.hasOwnProperty(felt)) {
        incrementTotalFeltConvex = purchasedFelt[felt].convex;
        incrementTotalFeltConcave = purchasedFelt[felt].concave;
        incrementTotalFeltUnused = purchasedFelt[felt].purchased - (purchasedFelt[felt].concave + purchasedFelt[felt].convex);
        incrementTotalFeltReceiving = purchasedFelt[felt].purchased;
        totalFeltConvex += incrementTotalFeltConvex;
        totalFeltConcave += incrementTotalFeltConcave;
        totalFeltUnused += incrementTotalFeltUnused;
        totalFeltReceiving += incrementTotalFeltReceiving;
      }
    }
    for (const varia in purchasedVaria) {
      if (purchasedVaria.hasOwnProperty(varia)) {
        incrementTotalVariaConvex = purchasedVaria[varia].convex;
        incrementTotalVariaConcave = purchasedVaria[varia].concave;
        incrementTotalVariaUnused = purchasedVaria[varia].purchased - (purchasedVaria[varia].concave + purchasedVaria[varia].convex);
        incrementTotalVariaReceiving = purchasedVaria[varia].purchased;
        totalVariaConvex += incrementTotalVariaConvex;
        totalVariaConcave += incrementTotalVariaConcave;
        totalVariaUnused += incrementTotalVariaUnused;
        totalVariaReceiving += incrementTotalVariaReceiving;
      }
    }
    this.totalFeltConvex = totalFeltConvex;
    this.totalFeltConcave = totalFeltConcave;
    this.totalFeltUnused = totalFeltUnused;
    this.totalFeltReceiving = totalFeltReceiving;
    this.totalVariaConvex = totalVariaConvex;
    this.totalVariaConcave = totalVariaConcave;
    this.totalVariaUnused = totalVariaUnused;
    this.totalVariaReceiving = totalVariaReceiving;
  }

  public variaTooltip(tile) {
    if (tile.diffusion) {
      return tile.material + ' + ' + tile.diffusion;
    } else {
      return tile.material;
    }
  }

  public diffusionString(diffusion: string) {
    let humanString: string;
    switch (diffusion) {
      case 'avalanche_d01':
        humanString = 'Avalanche D01';
        break;
      case 'vapor_w05':
        humanString = 'Vapor W05';
        break;
      default:
        humanString = 'None';
        break;
    }
    return humanString;
  }
}

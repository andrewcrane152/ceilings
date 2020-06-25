import { HushBlocksShippingService } from './../_services/hush-blocks-shipping.service';
import { ClarioGridsService } from './../_services/clario-grids.service';
import { MatTableDataSource } from '@angular/material';
import { TileRow } from './quantity.component';
import { Feature } from './../_features/feature';
import { DebugService } from './../_services/debug.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class QuantityService {
  qtyTilesArray = <TileObj[]>[];
  estimatedPrice = 0;
  tilesSelected = 0;
  sqAreaUsed = 0;
  sqAreaReceiving = 0;
  order = new MatTableDataSource();
  rowIndexNum = 1;

  constructor(private debug: DebugService, public feature: Feature, private route: ActivatedRoute, private clarioGrids: ClarioGridsService, private hushBlocksShippingService: HushBlocksShippingService) {}

  doAddRow(row) {
    this.debug.log('quantity', 'doAddRowInvoked');
    this.debug.log('quantity', row);
    const newRow = this.setRowData(row);
    this.order.data.push(newRow);
    this.order.data = this.order.data.slice(); // refreshes the table
    this.updateSummary();
  }

  setRowData(row) {
    this.debug.log('quantity', 'setRowDataInvoked');
    this.debug.log('quantity', row);
    this.getRowEstimate(row); // sets feature.estimated_amount
    const newRow = row[Object.keys(row)[0]];
    this.feature.material = newRow.material;
    this.feature.tile_image_type = newRow.tile_image_type === '48' ? 48 : 24;
    // newRow.tile = this.feature.feature_type === 'clario' ? this.clarioGrids.selectedTileSize.tile_size : newRow.tile_image_type;
    newRow.total = this.feature.estimated_amount;
    newRow.tileSqArea = this.getTileSqArea(newRow.tile);
    newRow.id = this.rowIndexNum++;
    newRow.material_size = this.setMaterialSize(newRow);
    newRow.material_type = this.setMaterialType();
    if (this.feature.feature_type === 'hush') {
      newRow.humanized_size = this.hushBlocksShippingService.humanizeHushBlocksSizes(newRow.material_size);
    }
    return newRow;
  }

  combineRows(matchedRow, requestedRow) {
    // matchedRow is kept
    const pkgQty = this.feature.getPackageQty(matchedRow.tile.tile);
    const requestedRowConfigured = this.setRowData(requestedRow);
    matchedRow.used += requestedRowConfigured.used;
    matchedRow.purchased = pkgQty * Math.ceil(matchedRow.used / pkgQty);
    const objectKey = `${matchedRow.material}-${matchedRow.tile.tile}`;
    const matchedRowFmtd = { [objectKey]: matchedRow };
    this.getRowEstimate(matchedRowFmtd); // sets feature.estimated_amount
    matchedRow.total = this.feature.estimated_amount;
    matchedRow.id = this.rowIndexNum++;
    matchedRow.material_size = this.setMaterialSize(matchedRow);
    matchedRow.material_type = this.setMaterialType();
    this.updateSummary();
  }

  checkAndFixDuplicates() {
    const untypedData: any[] = this.order.data.slice();
    const dataImagesArr = untypedData.map(rowData => rowData.image);
    // new array of objects with number of instances of each image
    const dataImagesCounted = dataImagesArr.reduce((a, b) => Object.assign(a, { [b]: (a[b] || 0) + 1 }), {});
    // an array of all the image values that have duplicates
    const duplicatedValue = Object.keys(dataImagesCounted).filter(a => dataImagesCounted[a] > 1)[0];
    let duplicateIds = [];
    if (!!duplicatedValue) {
      untypedData.map(row => {
        // send duplicated values to combineRows()
        if (row.image === duplicatedValue) {
          duplicateIds.push(row.id);
        }
        if (duplicateIds.length === 2) {
          const objectKey = `${row.material}-${row.tile.tile}`;
          const row1 = untypedData.filter(obj => obj.id === duplicateIds[0]);
          const row2 = { [objectKey]: untypedData.filter(obj => obj.id === duplicateIds[1])[0] };

          this.combineRows(row1[0], row2);
          const indexToRemove = untypedData.findIndex(x => x.id === row2[objectKey].id);
          this.order.data.splice(indexToRemove, 1);
          this.order.data = this.order.data.slice();
          this.updateSummary();
          duplicateIds = [];
        }
      });
    }
  }

  doEditRow(index, row) {
    this.getRowEstimate(row); // sets feature.estimated_amount
    const editRow = row[Object.keys(row)[0]];
    editRow.total = this.feature.estimated_amount;
    editRow.tileSqArea = this.getTileSqArea(editRow.tile);
    editRow.id = this.rowIndexNum++;
    editRow.material_size = this.setMaterialSize(editRow);
    editRow.material_type = this.setMaterialType();
    this.order.data[index] = editRow;
    this.order.data = this.order.data.slice(); // refreshes the table
    this.updateSummary();
  }

  setMaterialSize(row) {
    const materialSize = typeof row.tile === 'string' ? row.tile : row.tile.tile;
    return materialSize;
  }

  setMaterialType() {
    const materialType = typeof this.feature.selectedTile === 'string' ? this.feature.selectedTile : this.feature.selectedTile.name;
    return materialType;
  }

  getRowEstimate(row) {
    switch (this.feature.feature_type) {
      case 'hush':
        this.feature.getHushBlocksEstimate(row);
        break;
      case 'tetria':
        this.feature.getTetriaEstimate(row);
        break;
      case 'clario':
        this.feature.getClarioEstimate(row);
        break;
      case 'hushSwoon':
        this.feature.getHushSwoonEstimate(row);
        break;
    }
    this.feature.applyDealerPricing();
  }

  updateSummary() {
    const summary = this.order.data;
    this.debug.log('quantity', summary);
    let estTotal = 0;
    let tilesUsed = 0;
    let tilesReceiving = 0;
    let sqAreaUsed = 0;
    let sqAreaReceiving = 0;
    summary.map((row: any) => {
      estTotal += row.total;
      tilesUsed += row.used;
      tilesReceiving += row.purchased;
      sqAreaUsed += row.used * row.tileSqArea;
      sqAreaReceiving += row.purchased * row.tileSqArea;
    });
    this.estimatedPrice = estTotal;
    this.feature.qtyTilesReceiving = tilesReceiving;
    this.feature.qtyTilesUsed = tilesUsed;
    this.sqAreaUsed = Math.round(sqAreaUsed * 100) / 100;
    this.sqAreaReceiving = Math.round(sqAreaReceiving * 100) / 100;
    this.tilesSelected = Math.round(sqAreaUsed / 4) || null;
    if (this.feature.feature_type === 'clario' && !!this.clarioGrids.selectedTileSize) {
      const tileForArea = this.clarioGrids.selectedTileSize.tile_size / 2;
      const tileArea = this.getTileSqArea(tileForArea.toString());
      this.tilesSelected = Math.round(sqAreaUsed / tileArea);
    }
    this.updateTilesArr();
  }

  updateTilesArr() {
    const data = this.order.data;
    const tilesArr = {};
    data.map(row => {
      const rowStr = JSON.stringify(row);
      const newRow: TileRow = JSON.parse(rowStr);
      const newObj = <TileRow>{};
      newObj.purchased = newRow.purchased;
      newObj.image = newRow.image;
      newObj.used = newRow.used;
      newObj.material = newRow.material;
      newObj.tile = typeof newRow.tile === 'string' ? newRow.tile : newRow.tile.tile;
      const objectKey = this.feature.feature_type === 'hushSwoon' ? `${newObj.material}` : `${newObj.material}-${newObj.tile}`;
      if (!tilesArr[objectKey]) {
        tilesArr[objectKey] = newObj;
      } else {
        // if tiles are already selected just add to the totals
        tilesArr[objectKey].purchased += newObj.purchased;
        tilesArr[objectKey].used += newObj.used;
      }
    });

    this.getRowEstimate(tilesArr); // updates feature.ts with the totals
    this.feature.tiles = tilesArr;
    this.debug.log('quantity', this.feature.tiles);
  }

  getTileSqArea(tile?) {
    if (this.feature.feature_type === 'hushSwoon') {
      // hushSwoon is a rhombus that is 8.66" wide and 5.21" high
      // based off this, the total square area is 22.56 sq inches, or 0.15667 sq ft.
      return 0.15667;
    }
    let tileSize = tile;
    if (typeof tileSize !== 'string' && typeof tileSize !== 'undefined') {
      tileSize = tile.tile_size;
    }
    switch (tileSize) {
      // Clario tiles
      case '24':
        return 4;
      case '48':
        return 8;
      case '600':
        return 0.36;
      case '1200':
        return 0.36 * 2;
      case '625':
        return 0.390625;
      case '1250':
        return 0.390625 * 2;

      // Hush blocks tiles
      case '1-1-2':
        return 1;
      case '1-2-2':
        return 2;
      case '1-3-2':
        return 3;
      case '1-4-2':
        return 4;
      case '2-2-2':
        return 4;
      case '2-2-2-t':
        return 2;

      // default
      default:
        return 4;
    }
  }
}

export interface TileObj {
  purchased: number;
  image: string;
  used: number;
  material: string;
  tile: string;
}

import { element } from 'protractor';
import { MaterialsService } from './../_services/materials.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DebugService } from './../_services/debug.service';
import { Feature } from '../_features/feature';
import { GridSection } from './../_models/grid-section';
import { AlertService } from '../_services/alert.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();
  public rows: any;
  public columns: any;
  public mouseIsDown = false;
  public gridTileNumber = 0;
  showGridRoomGuide = true;

  constructor(
    private debug: DebugService,
    private sanitizer: DomSanitizer,
    private alert: AlertService,
    public feature: Feature,
    private materials: MaterialsService
  ) {}

  ngOnInit() {
    // subscribe to the buildGrid event
    this.debug.log('grid-component', 'setting grid Subscription');
    this.feature.onBuildGrid.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.debug.log('grid-component', 'building the grid');
      this.updateGrid();
    });

    // subscribe to the applyAll event
    this.feature.onApplyAll.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.debug.log('grid-component', 'applying all');
      this.updateGrid(true);
    });

    if (this.feature.feature_type === 'hush') {
      this.showGridRoomGuide = false;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateGrid(applyAll: boolean = false) {
    this.rows = new Array(this.feature.getRows());
    this.columns = new Array(this.feature.getColumns());
    this.showGridRoomGuide = this.feature.feature_type !== 'hush';
    // new design
    if (typeof this.feature.gridData === 'undefined') {
      this.feature.gridData = [];
      this.debug.log('grid-component', 'gridData is undefined');
      for (let r = 0; r < this.rows.length; r++) {
        this.feature.gridData[r] = [];
        for (let c = 0; c < this.columns.length; c++) {
          this.feature.gridData[r][c] = new GridSection(r, c);
        }
      }
    } else {
      // existing data
      // Remove extra rows or columns from grid
      this.feature.gridData.splice(this.feature.getRows());
      for (let i = 0; i < this.feature.gridData.length; i++) {
        this.feature.gridData[i].splice(this.feature.getColumns());
      }

      // Loaded design or design with gridData already set.
      for (let r = 0; r < this.rows.length; r++) {
        if (typeof this.feature.gridData[r] === 'undefined') {
          // create new row
          this.feature.gridData[r] = [];
        }
        for (let c = 0; c < this.columns.length; c++) {
          if (applyAll) {
            // de-select any tools just in case
            this.feature.selectedTool = '';
            if (this.feature.selectedTile.tile_size === '48') {
              const needs24Tile = this.feature.getColumns() % 2 !== 0;
              const smallTileLocation = needs24Tile && this.isPerfectGridWidth() ? this.feature.getColumns() - 1 : this.feature.getColumns() - 2;
              if (needs24Tile && c === smallTileLocation) {
                this.use24TileInstead(r, c);
              }
              if (!this.feature.gridData[r][c].backgroundImage) {
                this.setFlag(r, c);
                this.removeFlag(r, c);
              }
            } else {
              this.setFlag(r, c);
              this.removeFlag(r, c);
            }
          } else {
            if (typeof this.feature.gridData[r][c] === 'undefined') {
              // create a new record for the column
              this.debug.log('grid-component', 'the row does not exist. create a new one.');
              this.feature.gridData[r][c] = new GridSection(r, c);
            } else {
              this.feature.gridData[r][c] = new GridSection(
                r,
                c,
                this.feature.gridData[r][c]['backgroundImage'],
                this.feature.gridData[r][c]['texture'],
                this.feature.gridData[r][c]['rotation'],
                this.feature.gridData[r][c]['material'],
                this.feature.gridData[r][c]['tile'],
                this.feature.gridData[r][c]['tileSize'],
                this.feature.gridData[r][c]['tileNumber']
              );
            }
          }
        }
      }
      this.feature.updateEstimatedAmount();
    } // end existing data
  }

  setFlag(row, column) {
    this.debug.log('grid-component', 'setting flag');
    this.mouseIsDown = true;
    this.updateTile(row, column);
  }

  removeFlag(row, column) {
    this.debug.log('grid-component', 'removing flag');
    this.mouseIsDown = false;
  }

  updateTile(row, column) {
    if (this.mouseIsDown) {
      if (this.feature.quoted) {
        this.alert.error('This design has been quoted.  To make changes you must first save it as a new design.');
        return;
      }
      this.debug.log('grid-component', 'updating tile: ' + row + ' | ' + column);
      this.debug.log('grid-component', 'tool: ' + this.feature.selectedTool);
      this.debug.log('grid-component', 'tile: ' + this.feature.selectedTile.tile);
      this.debug.log('grid-component', 'material: ' + this.feature.material);
      // give each tile a unique identifier
      this.gridTileNumber++;

      switch (this.feature.selectedTool) {
        case 'rotate':
          if (this.feature.gridData[row][column].tileSize === '48') {
            this.alert.error('Rectangular baffles can not be rotated.');
            return;
          }
          let rotation = this.feature.gridData[row][column].rotation;
          rotation = rotation + 90 === 360 ? 0 : rotation + 90;
          this.feature.gridData[row][column].setRotation(rotation);
          this.debug.log('grid-component', rotation);
          break;

        case 'remove':
          this.feature.gridData[row].map(c => {
            if (this.feature.gridData[row][column].gridTileID === c.gridTileID) {
              this.feature.gridData[row][c.column] = new GridSection(row, c.column);
            }
          });
          this.feature.gridData[row][column] = new GridSection(row, column);
          this.debug.log('grid-component', this.feature.gridData[row][column]);
          break;

        case 'vent':
          this.feature.gridData[row][column].setBackgroundImage('url(/assets/icons/tools/vent.png)');
          this.feature.gridData[row][column].setTexture('/assets/icons/tools/vent-white.png');
          this.feature.gridData[row][column].setTile('');
          this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
          this.debug.log('grid-component', this.feature.gridData[row][column]);
          break;

        case 'light':
          this.feature.gridData[row][column].setBackgroundImage(
            'url(/assets/icons/tools/light.png), url(/assets/images/tiles/00/' + this.feature.material + '.png'
          );
          this.feature.gridData[row][column].setTexture('/assets/images/tiles/00/light/' + this.feature.material + '.png');
          this.feature.gridData[row][column].setTile('00');
          this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
          this.feature.gridData[row][column].setMaterial(this.feature.material);
          this.feature.gridData[row][column].setTileSize('00');
          this.debug.log('grid-component', this.feature.gridData[row][column]);
          break;

        case 'sprinkler':
          this.feature.gridData[row][column].setBackgroundImage(
            `url(/assets/icons/tools/sprinkler.png), url('/assets/images/tiles/00/${this.feature.material}.png')`
          );
          this.feature.gridData[row][column].setTexture('/assets/images/tiles/00/sprinkler/' + this.feature.material + '.png');
          this.feature.gridData[row][column].setTile('00');
          this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
          this.feature.gridData[row][column].setMaterial(this.feature.material);
          this.feature.gridData[row][column].setTileSize('00');
          this.debug.log('grid-component', this.feature.gridData[row][column]);
          break;

        // when no tool is selected
        default:
          // outside edges can only be flat tiles
          switch (this.feature.feature_type) {
            case 'clario':
              this.updateClarioTile(row, column);
              break;
            case 'tetria':
              this.updateTetriaTile(row, column);
              break;
            case 'hush':
              this.updateHushTile(row, column);
              break;
            default:
              this.debug.log('grid-component', 'hit default');
              break;
          }
          break;
      }
      if (this.feature.selectedTool !== 'rotate') {
        // update the estimated amount
        this.feature.updateEstimatedAmount();
      }
    }
  }

  updateTetriaTile(row, column) {
    if (this.isEdgeTile(row, column)) {
      this.setFlatTile(row, column);
      return;
    }
    this.feature.gridData[row][column].setBackgroundImage(
      'url(/assets/images/tiles/' + this.feature.selectedTile.tile + '/' + this.feature.material + '.png)'
    );
    this.feature.gridData[row][column].setTexture('/assets/images/tiles/00/' + this.feature.material + '.png');
    this.feature.gridData[row][column].setTile(this.feature.selectedTile.tile);
    this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
    this.feature.gridData[row][column].setMaterial(this.feature.material);
    this.feature.gridData[row][column].setTileSize(this.feature.selectedTile.tile_size);
    this.debug.log('grid-component', this.feature.gridData[row][column]);
  }

  updateHushTile(row, column) {
    this.feature.gridData[row][column].setBackgroundImage(`url(/assets/images/materials/felt/sola/${this.feature.material}.png)`);
    this.feature.gridData[row][column].setTexture('/assets/images/tiles/00/' + this.feature.material + '.png');
    this.feature.gridData[row][column].setTile(this.feature.selectedTile.tile);
    this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
    this.feature.gridData[row][column].setMaterial(this.feature.material);
    this.feature.gridData[row][column].setTileSize(this.feature.selectedTile.tile_size);
    this.debug.log('grid-component', this.feature.gridData[row][column]);
  }

  updateClarioTile(row, column) {
    if (this.isEdgeTile(row, column)) {
      this.setFlatTile(row, column);
      return;
    }
    if (this.feature.gridData[row][column].gridTileID !== 0) {
      this.feature.gridData[row].map(col => {
        if (col.gridTileID === this.feature.gridData[row][column].gridTileID && col.gridTileID !== 0) {
          this.feature.gridData[col.row][col.column] = new GridSection(col.row, col.column);
        }
      });
    }
    if (this.feature.selectedTile.tile_size !== '48' && this.feature.gridData[row][column].gridTileID !== 0) {
      // look to see if the left or right tile was part of a '48' tile
      const tile48Match = this.feature.gridData[row][column].tileNumber;
      const leftTileNumber = !!this.feature.gridData[row][column - 1] ? this.feature.gridData[row][column - 1].tileNumber : -1;
      const rightTileNumber = !!this.feature.gridData[row][column + 1] ? this.feature.gridData[row][column + 1].tileNumber : -1;
      const leftMatch: boolean = tile48Match === leftTileNumber;
      const rightMatch: boolean = tile48Match === rightTileNumber;
      if (leftMatch) {
        this.feature.gridData[row][column - 1] = new GridSection(row, column);
        this.debug.log('grid-component', 'left side removed');
      }
      if (rightMatch) {
        this.feature.gridData[row][column + 1] = new GridSection(row, column);
        this.debug.log('grid-component', 'right side removed');
      }
    }
    if (this.feature.selectedTile.tile_size === '00') {
      this.feature.gridData[row][column].setBackgroundImage(`url(/assets/images/tiles/00/${this.feature.material}.png`);
      this.feature.gridData[row][column].setTile('00');
      this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
      this.feature.gridData[row][column].setTile(this.feature.selectedTile.tile);
      this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
      this.feature.gridData[row][column].setMaterial(this.feature.material);
      this.feature.gridData[row][column].setTileSize('00');
      this.debug.log('grid-component', this.feature.gridData[row][column]);
    } else if (this.feature.selectedTile.tile_size === '24') {
      // 24x24 baffle
      this.feature.gridData[row][column].setBackgroundImage(
        `url(/assets/images/baffles/${this.feature.selectedTile.tile_size}/${this.feature.material}.png`
      );
      // the 3D view just needs the flat tile for the texture to be applied to the
      // geometry that it creates.
      this.feature.gridData[row][column].setTexture(`/assets/images/tiles/00/${this.feature.material}.png`);

      this.feature.gridData[row][column].setTile(this.feature.selectedTile.tile);
      this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
      this.feature.gridData[row][column].setMaterial(this.feature.material);
      this.feature.gridData[row][column].setTileSize(this.feature.selectedTile.tile_size);
      // for 24x24 tiles in a 24x48 grid
      if (this.feature.tile_image_type === 48) {
        this.feature.gridData[row][column].setRotation(270);
      }
      this.debug.log('grid-component', this.feature.gridData[row][column]);
    } else if (this.feature.selectedTile.tile_size === '48') {
      // 24x48 baffle
      this.debug.log('grid-component', 'is perfect grid width: ' + this.isPerfectGridWidth());
      this.debug.log('grid-component', 'is perfect grid height: ' + this.isPerfectGridHeight());
      this.debug.log('grid-component', 'is column odd: ' + this.isOdd(column));
      if (this.isLastFullColumn(column) && this.isFirstFullColumn(column)) {
        this.use24TileInstead(row, column, false);
      } else if (this.isLastFullColumn(column)) {
        this.debug.log('grid-component', 'this and column to left');
        this.set48TileLeft(row, column);
      } else {
        this.set48TileRight(row, column);
        this.debug.log('grid-component', 'this and column to right');
      }
    }
  }

  isEdgeTile(row, column) {
    if (this.feature.feature_type === 'clario') {
      if (!this.isClarioPerfectGrid('length') && (row === 0 || row === this.feature.getRows() - 1)) {
        return true;
      }
      if (!this.isClarioPerfectGrid('width') && (column === 0 || column === this.feature.getColumns() - 1)) {
        return true;
      }
      return false;
    } else {
      return (
        (this.getGridHeight() !== this.getRoomGuideHeight() && (row === 0 || row === this.feature.getRows() - 1)) ||
        (this.getGridWidth() !== this.getRoomGuideWidth() && (column === 0 || column === this.feature.getColumns() - 1))
      );
    }
  }

  setFlatTile(row, column) {
    this.feature.gridData[row][column].setBackgroundImage('url(/assets/images/tiles/00/' + this.feature.material + '.png)');
    this.feature.gridData[row][column].setTexture('/assets/images/tiles/00/' + this.feature.material + '.png');
    this.feature.gridData[row][column].setTile('00');
    this.feature.gridData[row][column].setgridTileID(this.gridTileNumber);
    this.feature.gridData[row][column].setMaterial(this.feature.material);
    this.feature.gridData[row][column].setTileSize('00');
    this.alert.error('Tiles on the outside must be flat.');
  }
  /**
   * Returns the background image style value.
   * Because we send 2 urls for the background images whenever they choose a
   * light or a sprinkler, we need to ignore the style sanitation.
   * @param number row    the row number
   * @param number column the column number
   * @return safe style string for the background image.
   */
  getTileBackgroundImage(row, column) {
    return this.sanitizer.bypassSecurityTrustStyle(this.feature.gridData[row][column].backgroundImage);
  }

  getTileRotation(row, column) {
    return this.feature.gridData[row][column].rotation;
  }

  getGridWidth() {
    return this.feature.getColumns() * 48;
  }

  getGridHeight() {
    return this.feature.getRows() * 48;
  }

  getRoomGuideWidth() {
    let guideWidth: number;
    if (this.feature.units === 'inches') {
      guideWidth = (this.feature.width / 12 / 2) * 48;
    } else {
      guideWidth = (this.feature.convertCMtoIN(this.feature.width) / 12 / 2) * 48;
    }
    if (this.feature.feature_type === 'clario') {
      if (this.isPerfectGridHeight()) {
        guideWidth = this.getGridWidth();
      }
    }
    return guideWidth;
  }

  getRoomGuideHeight() {
    let guideHeight: number;
    if (this.feature.units === 'inches') {
      guideHeight = (this.feature.length / 12 / 2) * 48;
    } else {
      guideHeight = (this.feature.convertCMtoIN(this.feature.length) / 12 / 2) * 48;
    }
    if (this.feature.feature_type === 'clario') {
      if (this.isPerfectGridHeight()) {
        guideHeight = this.getGridHeight();
      }
    }
    return guideHeight;
  }

  getRoomGuideLeftAdjustment() {
    return (this.getGridWidth() - this.getRoomGuideWidth()) / 2;
  }

  getRoomGuideTopAdjustment() {
    return (this.getGridHeight() - this.getRoomGuideHeight()) / 2;
  }

  isPerfectGridWidth() {
    if (this.feature.feature_type === 'clario') {
      return this.isClarioPerfectGrid('width');
    }
    return this.getGridWidth() === this.getRoomGuideWidth();
  }

  isPerfectGridHeight() {
    if (this.feature.feature_type === 'clario') {
      return this.isClarioPerfectGrid('length');
    }
    return this.getGridHeight() === this.getRoomGuideHeight();
  }

  isClarioPerfectGrid(dimension) {
    let isPerfect = false;
    if (!!this.feature.selectedTile) {
      switch (this.feature.selectedTile.tile_size_type) {
        case 'standard':
          isPerfect = this.feature[dimension] % 24 === 0;
          break;
        case 'metric':
          isPerfect = (this.feature[dimension] * 10) % 600 === 0;
          break;
        case 'german':
          isPerfect = (this.feature[dimension] * 10) % 625 === 0;
          break;
      }
    }
    return isPerfect;
  }

  isOdd(column: number) {
    return column % 2;
  }

  isLastFullColumn(column: number) {
    const numOfCols = this.feature.getColumns();
    const lastFullCol = this.isPerfectGridWidth() ? numOfCols : numOfCols - 1;
    // column + 1 due to column being the index
    return lastFullCol === column + 1;
  }

  isFirstFullColumn(column: number) {
    const firstFullColumn = this.isPerfectGridWidth() ? 0 : 1;
    return firstFullColumn === column;
  }

  use24TileInstead(row, column, reset = true) {
    const currentTile = JSON.stringify(this.feature.selectedTile);
    const storedCurrentTile = JSON.parse(currentTile);
    const tileOptions = this.feature.tilesArray.clario;
    for (const tile in tileOptions) {
      if (tileOptions.hasOwnProperty(tile)) {
        if (tileOptions[tile].tile_size_type === storedCurrentTile.tile_size_type && tileOptions[tile].tile_size === '24') {
          this.feature.updateSelectedTile(tileOptions[tile]);
          this.setFlag(row, column);
          this.removeFlag(row, column);
          if (reset) {
            this.feature.updateSelectedTile(storedCurrentTile);
          }
        }
      }
    }
  }

  set48TileRight(row, column) {
    // this and the column to the right must match
    if (column + 1 === this.feature.getColumns() - 1 && !this.isPerfectGridWidth()) {
      this.debug.log('grid-component', 'the column to the right of this must be flat, so this can not be 48 tile');
      this.alert.error('This tile must be a 24x24 tile');
      return;
    }
    if (!!this.feature.gridData[row][column + 1] && !!this.feature.gridData[row][column + 2]) {
      if (
        this.feature.gridData[row][column + 1].gridTileID === this.feature.gridData[row][column + 2].gridTileID &&
        this.feature.gridData[row][column + 2].gridTileID !== 0
      ) {
        this.feature.gridData[row][column + 2] = new GridSection(row, column);
      }
    }
    this.setClarioTile(this.feature.gridData[row][column]);
    this.setClarioTile(this.feature.gridData[row][column + 1]);
  }

  set48TileLeft(row, column) {
    if (!!this.feature.gridData[row][column - 1] && !!this.feature.gridData[row][column - 2]) {
      if (
        this.feature.gridData[row][column - 1].gridTileID === this.feature.gridData[row][column - 2].gridTileID &&
        this.feature.gridData[row][column - 2].gridTileID !== 0
      ) {
        this.feature.gridData[row][column - 2] = new GridSection(row, column);
      }
    }
    this.setClarioTile(this.feature.gridData[row][column]);
    this.setClarioTile(this.feature.gridData[row][column - 1]);
  }

  setClarioTile(gridTile) {
    gridTile.setBackgroundImage('url(/assets/images/baffles/' + this.feature.selectedTile.tile_size + '/' + this.feature.material + '.png)');
    gridTile.setTexture('/assets/images/tiles/00/' + this.feature.material + '.png');
    gridTile.setTile(this.feature.selectedTile.tile);
    gridTile.setgridTileID(this.gridTileNumber);
    gridTile.setMaterial(this.feature.material);
    gridTile.setTileSize(this.feature.selectedTile.tile_size);
    this.debug.log('grid-component', gridTile);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasGridsComponent } from '../canvas-grids.component';
// import * as pip from 'point-in-polygon';
import * as pip from 'robust-point-in-polygon';

(String.prototype as any).capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

@Component({
  selector: 'app-velo-grid',
  templateUrl: './velo-grid.component.html',
  styleUrls: ['../canvas-grids.component.scss', './velo-grid.component.scss']
})
export class VeloGridComponent extends CanvasGridsComponent implements OnInit {
  rows = 23;
  columns = 18;
  adjustmentX = 96;
  adjustmentY = 48;
  tilesOutsideBoundary = [];
  tileIndex = 0;

  @ViewChild('veloCanvas', { static: true })
  canvas;

  ngOnInit() {
    // subscribe to the buildVeloGrid event
    this.debug.log('velo-grid', 'setting veloGrid Subscription');
    this.feature.onBuildVeloGrid.subscribe(result => {
      this.debug.log('velo-grid-component', 'building the velo grid');
      this.renderVeloGrid();
    });
    this.feature.onAdjustVeloGridSize.subscribe(result => {
      this.adjustVeloGridSize(result);
    });
  }

  adjustVeloGridSize(adjustment) {
    this.doingGridSizeAdjust = true;
    switch (adjustment) {
      case 'addColumn':
        this.columns++;
        break;
      case 'removeColumn':
        this.columns = Math.max(this.columns - 1, 5);
        break;
      case 'addRow':
        this.rows++;
        break;
      case 'removeRow':
        this.rows = Math.max(this.rows - 1, 5);
        break;
    }
    const currentSelections = this.getDesignDecisions();
    this.updateGridDisplay();
    this.renderVeloGrid();
    this.applySelectionsToNewGrid(currentSelections);
    this.doingGridSizeAdjust = false;
  }

  renderVeloGrid() {
    this.debug.log('velo-grid-component', 'rendering the velo grid');
    const canvas = this.canvas.nativeElement;
    canvas.width = 96 * this.columns * this.feature.canvasGridScale;
    canvas.height = 52 * this.rows * this.feature.canvasGridScale;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    this.setTilesOutsideBoundary();
    // new design
    if (typeof this.feature.gridData === 'undefined') {
      this.feature.gridData = [];
      this.newDesign = true;
    } else {
      this.newDesign = false;
    }
    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.columns; ++c) {
        this.createPentagonSection(
          ctx,
          c * this.adjustmentX * this.feature.canvasGridScale,
          r * this.adjustmentY * this.feature.canvasGridScale,
          this.isOdd(r),
          r,
          c
        );
      }
    }
    // reset index counter after completion
    this.tileIndex = 0;
  }

  veloGridClick(event: any) {
    if (this.feature.quoted) {
      this.alert.error('This design has been quoted and can not be altered.  To make changes, duplicate the design and submit a new request with your changes.');
      return;
    }
    this.debug.log('velo-grid', event);
    let x = event.offsetX;
    let y = event.offsetY;
    x = Math.round(x / this.feature.canvasGridScale);
    y = Math.round(y / this.feature.canvasGridScale);
    let foundTile = false;
    this.debug.log('velo-grid', 'you clicked on x: ' + x + ' and y: ' + y);
    for (const el in this.feature.gridData) {
      if (!foundTile && pip(this.feature.gridData[el].pentagon, [x, y]) === -1) {
        // removing a tile
        if (this.feature.selectedTool === 'remove') {
          // reset the texture for the 3D view.
          this.feature.gridData[el].texture = '';
          // reset the tile
          this.feature.gridData[el].tile = '';
          // reset material
          this.feature.gridData[el].material = '';
          // reset materialType
          this.feature.gridData[el].materialType = '';
          // reset hex color value
          this.feature.gridData[el].hex = '';
          // reset the diffusion
          this.feature.gridData[el].diffusion = '';
          this.debug.log('velo-grid', this.feature.gridData[el]);
          // set the tile found true so we don't "find" another one that's close
          foundTile = true;
        } else {
          // set the texture for the 3D view.
          this.feature.gridData[el].texture = '/assets/images/tiles/00/' + this.feature.material + '.png';
          // set the tile
          this.feature.gridData[el].tile = this.feature.selectedTile.tile;
          // set material
          this.feature.gridData[el].material = this.feature.material;
          // set materialType
          this.feature.gridData[el].materialType = this.feature.materialType;
          // set hex color value
          this.feature.gridData[el].hex = this.feature.materialHex;
          // set the diffusion if one is selected and material type is varia
          if (this.feature.materialType === 'varia') {
            this.feature.gridData[el].diffusion = this.feature.diffusion;
          } else {
            this.feature.gridData[el].diffusion = '';
          }
          // set the tile found true so we don't "find" another one that's close
          foundTile = true;
          for (const neighbor in this.feature.gridData[el].neighbors) {
            if (this.feature.gridData[el].neighbors.hasOwnProperty(neighbor)) {
              const index = this.feature.findVeloTileAt(
                this.feature.gridData[el].neighbors[neighbor][0],
                this.feature.gridData[el].neighbors[neighbor][1]
              );
            }
          }
        }
        this.debug.log('velo-grid', this.feature.gridData[el]);
        // render the canvas again
        this.renderVeloGrid();
        // update the estimated amount
        this.feature.updateEstimatedAmount();
      }
    }
  }

  private createPentagonSection(ctx, adjustmentX, adjustmentY, isOdd, row, column) {
    const xAdjustment = 16;

    if (isOdd) {
      // start off 48px off canvas
      this.drawPentagon(
        ctx,
        (18 - xAdjustment) * this.feature.canvasGridScale + adjustmentX,
        33 * this.feature.canvasGridScale + adjustmentY,
        -Math.PI / 2,
        row,
        column
      );
      this.drawPentagon(
        ctx,
        (50 - xAdjustment) * this.feature.canvasGridScale + adjustmentX,
        17 * this.feature.canvasGridScale + adjustmentY,
        Math.PI,
        row,
        column
      );
      this.drawPentagon(
        ctx,
        (50 - xAdjustment) * this.feature.canvasGridScale + adjustmentX,
        49 * this.feature.canvasGridScale + adjustmentY,
        2 * Math.PI,
        row,
        column
      );
      this.drawPentagon(
        ctx,
        (82 - xAdjustment) * this.feature.canvasGridScale + adjustmentX,
        33 * this.feature.canvasGridScale + adjustmentY,
        Math.PI / 2,
        row,
        column
      );
    } else {
      this.drawPentagon(
        ctx,
        (-30 - xAdjustment) * this.feature.canvasGridScale + adjustmentX,
        33 * this.feature.canvasGridScale + adjustmentY,
        -Math.PI / 2,
        row,
        column
      );
      this.drawPentagon(
        ctx,
        (2 - xAdjustment) * this.feature.canvasGridScale + adjustmentX,
        17 * this.feature.canvasGridScale + adjustmentY,
        Math.PI,
        row,
        column
      );
      this.drawPentagon(
        ctx,
        (2 - xAdjustment) * this.feature.canvasGridScale + adjustmentX,
        49 * this.feature.canvasGridScale + adjustmentY,
        2 * Math.PI,
        row,
        column
      );
      this.drawPentagon(
        ctx,
        (34 - xAdjustment) * this.feature.canvasGridScale + adjustmentX,
        33 * this.feature.canvasGridScale + adjustmentY,
        Math.PI / 2,
        row,
        column
      );
    }
  }

  private drawPentagon(ctx, x, y, rotateAngle, row, column) {
    // console.log(`row: ${Math.floor(index / 9)}`);
    // console.log(`index: ${index}, column: ${index % 10}`);
    // pentagon points
    let xcoords = [0, -23.9, -15.95, 15.95, 23.9];
    let ycoords = [15.94, 7.96, -15.94, -15.94, 7.96];
    const index = this.tileIndex++;

    xcoords = xcoords.map(xpoint => xpoint * this.feature.canvasGridScale);
    ycoords = ycoords.map(ypoint => ypoint * this.feature.canvasGridScale);

    // set the grid section information
    // add x,y to all the pentagon points
    const pentagon = [];
    for (let i = 0; i < xcoords.length; ++i) {
      pentagon[i] = [xcoords[i] + x, ycoords[i] + y];
    }

    if (this.newDesign || this.doingGridSizeAdjust) {
      this.feature.gridData.push({
        index: index,
        row: row,
        column: column,
        x: x,
        y: y,
        pentagon: pentagon,
        texture: '',
        rotation: this.toDegrees(rotateAngle),
        material: '',
        tile: '',
        diffusion: '',
        neighbors: this.getNeighbors(x, y, index, this.toDegrees(rotateAngle)),
        width: this.getTileWidth(this.toDegrees(rotateAngle)),
        height: this.getTileHeight(this.toDegrees(rotateAngle))
      });
    }

    // save the current canvas state
    ctx.save();
    if (!this.tilesOutsideBoundary.includes(index)) {
      // start drawing
      ctx.beginPath();
      // move to the new x,y coordinates (setting a new 0,0 at x,y)
      ctx.translate(x, y);
      // rotate to fit in the tesselation
      ctx.rotate(rotateAngle);
      // move to the start of the pentagon and then set the lines
      ctx.moveTo(xcoords[0], ycoords[0]);
      ctx.lineTo(xcoords[1], ycoords[1]);
      ctx.lineTo(xcoords[2], ycoords[2]);
      ctx.lineTo(xcoords[3], ycoords[3]);
      ctx.lineTo(xcoords[4], ycoords[4]);
      // close the path
      ctx.closePath();
      // set the strokestyle
      ctx.strokeStyle = this.strokeStyle;

      // if the design is not new, then we can set fill style from gridData
      if (!this.newDesign && !!this.feature.gridData[index] && this.feature.gridData[index].texture !== '') {
        // set the fillstyle
        ctx.fillStyle = this.feature.gridData[index].hex;
        // fill the pentagon
        ctx.fill();
        if (this.feature.showGuide) {
          this.labelTiles(ctx, rotateAngle, index);
        }
      } else {
        ctx.fillStyle = this.fillStyle;
        // fill the pentagon
        ctx.fill();
      }

      // DEBUGGING
      // ctx.rotate(-rotateAngle);
      // ctx.fillStyle = '#00E1E1';
      // ctx.font = '14px Blue';
      // ctx.fillText(index, -8, -0);

      // stroke all the pentagon lines
      ctx.stroke();
    }
    // restore the context so that we can draw the next pentagon.
    ctx.restore();
  }

  setTilesOutsideBoundary() {
    if (this.feature.feature_type === 'velo') {
      this.tilesOutsideBoundary = this.feature.useOldVeloGrid ? this.oldBoundaryArr() : this.outsideBoundaryArr();
    }
  }

  private tileAbbreviation(tile) {
    return tile === 'concave'
      ? 'CC'
      : 'CV';
  }

  private materialTypeAbbreviation(tile) {
    return (this.feature.checkVeloOldMaterials())
      ? (tile.materialType === 'felt') ? 'Felt' : 'Var'
      : tile.material.substring(0, 3).capitalize();
  }

  private diffusionAbbreviation(diffusion) {
    let abbreviation: string;
    switch (diffusion) {
      case 'avalanche_d01':
        abbreviation = 'D01';
        break;

      case 'vapor_w05':
        abbreviation = 'W05';
        break;

      default:
        this.alert.error('Unknown diffusion type: ' + diffusion);
        break;
    }
    return abbreviation;
  }

  private labelTiles(ctx, rotateAngle, index) {
    // rotate back so the text is always top down
    ctx.rotate(-rotateAngle);
    // change fillStyle for the font (cyan)
    ctx.fillStyle = '#00E1E1';
    ctx.font = '10px Arial';
    ctx.fillText(this.materialTypeAbbreviation(this.feature.gridData[index]), -10, -2);
    ctx.font = '10px Arial';
    ctx.fillText(this.tileAbbreviation(this.feature.gridData[index].tile), -8, 7);
    if (this.feature.gridData[index].diffusion) {
      ctx.font = '10px Arial';
      ctx.fillText(this.diffusionAbbreviation(this.feature.gridData[index].diffusion), -10, 12);
    }
  }

  private getNeighbors(x, y, index, rotateAngle) {
    const neighbors: any = [];
    let neighbor1: any = [];
    let neighbor2: any = [];
    let neighbor3: any = [];
    let neighbor4: any = [];
    let neighbor5: any = [];

    if (rotateAngle === -90) {
      neighbor1 = [x + 32, y - 16];
      neighbors.push(neighbor1);
      neighbor2 = [x + 32, y + 16];
      neighbors.push(neighbor2);
      neighbor3 = [x - 16, y + 32];
      neighbors.push(neighbor3);
      neighbor4 = [x - 32, y];
      neighbors.push(neighbor4);
      neighbor5 = [x - 16, y - 32];
      neighbors.push(neighbor5);
    }
    if (rotateAngle === 180) {
      neighbor1 = [x - 16, y - 32];
      neighbors.push(neighbor1);
      neighbor2 = [x + 16, y - 32];
      neighbors.push(neighbor2);
      neighbor3 = [x + 32, y + 16];
      neighbors.push(neighbor3);
      neighbor4 = [x, y + 32];
      neighbors.push(neighbor4);
      neighbor5 = [x - 32, y + 16];
      neighbors.push(neighbor5);
    }
    if (rotateAngle === 360) {
      neighbor1 = [x + 16, y + 32];
      neighbors.push(neighbor1);
      neighbor2 = [x - 16, y + 32];
      neighbors.push(neighbor2);
      neighbor3 = [x - 32, y - 16];
      neighbors.push(neighbor3);
      neighbor4 = [x, y - 32];
      neighbors.push(neighbor4);
      neighbor5 = [x + 32, y - 16];
      neighbors.push(neighbor5);
    }
    if (rotateAngle === 90) {
      neighbor1 = [x - 32, y + 16];
      neighbors.push(neighbor1);
      neighbor2 = [x - 32, y - 16];
      neighbors.push(neighbor2);
      neighbor3 = [x + 16, y - 32];
      neighbors.push(neighbor3);
      neighbor4 = [x + 32, y];
      neighbors.push(neighbor4);
      neighbor5 = [x + 16, y + 32];
      neighbors.push(neighbor5);
    }
    return neighbors;
  }

  getTileWidth(rotateAngle) {
    if (rotateAngle === -90 || rotateAngle === 90) {
      return 15.5;
    }
    if (rotateAngle === 180 || rotateAngle === 360) {
      return 23.5;
    }
  }

  getTileHeight(rotateAngle) {
    if (rotateAngle === -90 || rotateAngle === 90) {
      return 23.5;
    }
    if (rotateAngle === 180 || rotateAngle === 360) {
      return 15.5;
    }
  }

  outsideBoundaryArr() {
    return [
      71,141,142,143,215,285,286,287,359,429,430,431,503,573,574,575,647,717,718,719,791,861,862,863,935,1005,1006,1007,1079,1149,1150,1151,1223,1293,1294,1295,1367,1437,1438,1439,1511,1581,1582,1583,0,1,2,72,146,145,144,216,290,289,288,360,434,433,432,504,578,577,576,648,722,721,720,792,866,865,864,936,1010,1009,1008,1080,1154,1153,1152,1224,1298,1297,1296,1298,1442,1441,1440,1512,1586,1585,1584,1368,1655
    ];
    return [
      0,
      1,
      2,
      79,
      80,
      157,
      158,
      159,
      160,
      161,
      162,
      239,
      240,
      317,
      318,
      319,
      320,
      321,
      322,
      399,
      400,
      477,
      478,
      479,
      480,
      481,
      482,
      559,
      560,
      637,
      638,
      639,
      640,
      641,
      642,
      719,
      720,
      797,
      798,
      799,
      800,
      801,
      802,
      879,
      880,
      957,
      958,
      959,
      960,
      961,
      962,
      1039,
      1040,
      1117,
      1118,
      1119,
      1120,
      1121,
      1122,
      1199,
      1200,
      1277,
      1278,
      1279,
      1280,
      1281,
      1282,
      1359,
      1360,
      1437,
      1438,
      1439,
      1440,
      1441,
      1442,
      1519,
      1520,
      1597,
      1598,
      1599,
      1600,
      1601,
      1602,
      1679,
      1680,
      1757,
      1758,
      1759,
      1760,
      1761,
      1762,
      1839,
      1840,
      1917,
      1918,
      1919,
      1920,
      1921,
      1922,
      1999,
      2000,
      2077,
      2078,
      2079,
      2080,
      2081,
      2082,
      2159
    ]
  }

  oldBoundaryArr() {
    return [
      0,
      1,
      2,
      35,
      36,
      69,
      70,
      71,
      72,
      73,
      74,
      107,
      108,
      141,
      142,
      143,
      144,
      145,
      146,
      179,
      180,
      213,
      214,
      215,
      216,
      217,
      218,
      251,
      252,
      285,
      286,
      287,
      288,
      289,
      290,
      323,
      324,
      357,
      358,
      359
    ];
  }
}

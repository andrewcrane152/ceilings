import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasGridsComponent } from '../canvas-grids.component';
import * as pip from 'robust-point-in-polygon';

interface ClarioCloudNeighbor {
  count: number;
  adjacents: boolean;
  list: {
    0: boolean,
    1: boolean,
    2: boolean,
    3: boolean
  };
}

export interface ClarioCloudTile {
  index: number;
  row: number;
  column: number;
  x: number;
  y: number;
  square: Object;
  cloud_direction: string;
  img_grid_rotation: number;
  img: string;
  material: string;
  neighbors: ClarioCloudNeighbor;
  width: number;
  height: number;
}

@Component({
  selector: 'app-clario-cloud-grid',
  templateUrl: './clario-cloud-grid.component.html',
  styleUrls: ['../canvas-grids.component.scss', './clario-cloud-grid.component.scss']
})
export class ClarioCloudGridComponent extends CanvasGridsComponent implements OnInit {
  rows = 5;
  columns = 8;
  adjustmentX = 96;
  adjustmentY = 96;
  tilesOutsideBoundary = [];
  cloudDirection = 'right';

  @ViewChild('clarioCloudCanvas', { static: true })
  canvas;

  ngOnInit() {
    // subscribe to the buildClarioCloudGrid event
    this.debug.log('clario-cloud-grid', 'setting clarioCloudGrid Subscription');
    this.feature.onBuildClarioCloudGrid.subscribe(result => {
      this.debug.log('clario-cloud-grid', 'building the clario-cloud grid');
      this.renderClarioCloudGrid();
    });
    this.feature.onAdjustClarioCloudGridSize.subscribe(result => {
      this.adjustClarioCloudGridSize(result);
    });
  }

  adjustClarioCloudGridSize(adjustment) {
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
    this.updateGridDisplayValues();
    this.renderClarioCloudGrid();
    this.applySelectionsToNewGrid(currentSelections);
    this.doingGridSizeAdjust = false;
  }

  renderClarioCloudGrid() {
    const canvas = this.canvas.nativeElement;
    canvas.width = 96 * this.columns * this.feature.canvasGridScale + 10;
    canvas.height = 96 * this.rows * this.feature.canvasGridScale + 10;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    // new design
    if (typeof this.feature.gridData === 'undefined') {
      this.feature.gridData = [];
      this.newDesign = true;
    } else {
      this.newDesign = false;
    }
    let index = -1;
    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.columns; ++c) {
        index++;
        this.drawSquare(
          ctx,
          c * this.adjustmentX * this.feature.canvasGridScale + 2,
          r * this.adjustmentY * this.feature.canvasGridScale + 2,
          index,
          r,
          c
        );
      }
    }
  }


  clarioCloudGridClick(event: any) {
    if (this.feature.quoted) {
      this.alert.error('This design has been quoted.  To make changes you must first save it as a new design.');
      return;
    }
    this.debug.log('clario-cloud-grid', event);

    let x = event.offsetX;
    let y = event.offsetY;
    x = Math.round(x / this.feature.canvasGridScale);
    y = Math.round(y / this.feature.canvasGridScale);
    let foundTile = false;
    this.debug.log('clario-cloud-grid', 'you clicked on x: ' + x + ' and y: ' + y);
    for (const el in this.feature.gridData) {
      if (!foundTile && pip(this.feature.gridData[el].square, [x, y]) === -1) {
        // removing a tile
        if (this.feature.selectedTool === 'remove') {
          // reset the texture for the 3D view.
          this.feature.gridData[el].cloud_direction = '';
          this.feature.gridData[el].image_grid_rotation = '';
          this.feature.gridData[el].texture = '';
          this.feature.gridData[el].material = '';

          this.debug.log('clario-cloud-grid', this.feature.gridData[el]);
          // set the tile found true so we don't "find" another one that's close
          foundTile = true;
        } else {
          // set the texture for the 3D view.
          this.feature.gridData[el].texture = `/assets/images/clario_cloud/rc_0/${this.feature.material}/.png`;
          // set the tile found true so we don't "find" another one that's close
          foundTile = true;
        }
        this.debug.log('clario-cloud-grid', 'clicked tile');
        this.debug.log('clario-cloud-grid', this.feature.gridData[el]);
        // render the canvas again
        this.renderClarioCloudGrid();
        // update the estimated amount
        this.feature.updateEstimatedAmount();
      }
    }
    this.setGridNeighborData();
    this.setGridTileValues();
    // this.changeGridDimensions();
  }

  private drawSquare(ctx, x, y, index, row, column) {
    // square points
    let xcoords = [0, 0, 96, 96];
    let ycoords = [0, 96, 96, 0];

    xcoords = xcoords.map(xpoint => xpoint * this.feature.canvasGridScale);
    ycoords = ycoords.map(ypoint => ypoint * this.feature.canvasGridScale);

    // set the grid section information
    // add x,y to all the square points
    const square = [];
    for (let i = 0; i < xcoords.length; ++i) {
      square[i] = [xcoords[i] + x, ycoords[i] + y];
    }

    if (this.newDesign || this.doingGridSizeAdjust) {
      this.feature.gridData.push({
        index: index,
        row: row,
        column: column,
        x: x,
        y: y,
        square: square,
        cloud_direction: '',
        image_grid_rotation: '',
        texture: '',
        material: '',
        width: 96,
        height: 96,
        neighbors: this.getNeighborsData(column, row)
      });
    }

    // save the current canvas state
    ctx.save();
    // start drawing
    ctx.beginPath();
    // move to the new x,y coordinates (setting a new 0,0 at x,y)
    ctx.translate(x, y);
    // move to the start of the square and then set the lines
    ctx.moveTo(xcoords[0], ycoords[0]);
    ctx.lineTo(xcoords[1], ycoords[1]);
    ctx.lineTo(xcoords[2], ycoords[2]);
    ctx.lineTo(xcoords[3], ycoords[3]);
    // close the path
    ctx.closePath();
    // set the strokestyle
    ctx.strokeStyle = this.strokeStyle;

    // if the design is not new, then we can set fill style from gridData
    if (!this.newDesign && !!this.feature.gridData[index] && this.feature.gridData[index].texture !== '') {

      const bgImg = new Image();
      // TODO
      // // bgImg.src = this.feature.gridData[index].texture;
      bgImg.src = `/assets/images/clario_cloud/rc_0/ruby.png`;


      // async function drawBgImg() {
        bgImg.onload = function() {
          console.log('drawBgImg');
          // ctx.drawImage(bgImg, 1, 1, 96, 96);
        }
      // }

      // drawBgImg().then(res => {
        if (this.feature.showGuide) {
          this.labelTiles(ctx, index);
        }
      // })
    } else {
      ctx.fillStyle = this.fillStyle;
      // fill the square
      ctx.fill();
    }

    // DEBUGGING
    // ctx.rotate(-rotateAngle);
    // ctx.fillStyle = '#00E1E1';
    // ctx.font = '10px Arial';
    // ctx.fillText(index, -5, -5);
    // ctx.font = '8px Arial';
    // ctx.fillText(Math.round(x) + ', ' + Math.round(y), -15, 5);

    // stroke all the square lines
    ctx.stroke();

    // restore the context so that we can draw the next square.
    ctx.restore();
  }

  private labelTiles(ctx, index) {
    console.log('labelTiles');
    // change fillStyle for the font (cyan)
    ctx.fillStyle = '#00E1E1';
    ctx.font = '16px Arial';
    ctx.fillText(this.feature.gridData[index].tile, 44, 40);
    const arrowCoords = this.getArrowDirectionCoords();
    this.drawLineArrow(ctx, arrowCoords);
  }

  private setGridNeighborData() {
    this.feature.gridData.map(tile => {
      tile.neighbors = this.getNeighborsData(tile.column, tile.row);
    })
  }

  private setGridTileValues() {
    this.feature.gridData.map(tile => {
      if (!!tile.texture) {
        switch (tile.neighbors.count) {
          case 0:
            console.log('0 neighbors');
            tile.tile = 'S';
            break;
          case 1:
            console.log('1 neighbor');
            switch (tile.cloud_direction) {
              case 'right':
                if (!!tile.neighbors.neighbors[0]) {tile.tile = 'B'}
                if (!!tile.neighbors.neighbors[1]) {tile.tile = 'F'}
                if (!!tile.neighbors.neighbors[2]) {tile.tile = 'H'}
                if (!!tile.neighbors.neighbors[3]) {tile.tile = 'D'}
                break;
              case 'down':
                // TODO
                if (!!tile.neighbors.neighbors[0]) {tile.tile = 'D'}
                if (!!tile.neighbors.neighbors[1]) {tile.tile = 'F'}
                if (!!tile.neighbors.neighbors[2]) {tile.tile = 'H'}
                if (!!tile.neighbors.neighbors[3]) {tile.tile = 'D'}
                break;
              case 'left':
                // TODO
                if (!!tile.neighbors.neighbors[0]) {tile.tile = 'B'}
                if (!!tile.neighbors.neighbors[1]) {tile.tile = 'F'}
                if (!!tile.neighbors.neighbors[2]) {tile.tile = 'H'}
                if (!!tile.neighbors.neighbors[3]) {tile.tile = 'D'}
                break;
              case 'up':
                // TODO
                if (!!tile.neighbors.neighbors[0]) {tile.tile = 'B'}
                if (!!tile.neighbors.neighbors[1]) {tile.tile = 'F'}
                if (!!tile.neighbors.neighbors[2]) {tile.tile = 'H'}
                if (!!tile.neighbors.neighbors[3]) {tile.tile = 'D'}
                break;
            }
            break;
          case 2:
            console.log('2 neighbors');
            break;
          case 3: break;
          case 4:
              console.log('4 neighbors');
          break;
        }
      }
    })
  }

  private getNeighborsData(column, row) {
    let count = 0;
    let adjacents = false;

    const neighbors = [];
    neighbors.push(this.findTileByColumnAndRow(column, row - 1)); // TOP neighbor
    neighbors.push(this.findTileByColumnAndRow(column + 1, row)); // RIGHT neighbor
    neighbors.push(this.findTileByColumnAndRow(column, row + 1)); // BOTTOM neighbor
    neighbors.push(this.findTileByColumnAndRow(column - 1, row)); // LEFT neighbor

    for (let i = 0; i < neighbors.length; i++) {
      if (!!neighbors[i]) { count++; }
      if (!!neighbors[i] && !!neighbors[i + 1]) {
        adjacents = true;
      } else if (!!neighbors[0] && !!neighbors[neighbors.length - 1]) {
        adjacents = true;
      }
    }

    return {
      count: count,
      adjacents: adjacents,
      neighbors: neighbors
    }
  }

  getTileType() {
    // TODO
    const tileType = 'S'
    return tileType;
  }

  findTileByColumnAndRow(column, row) {
    if (column < 0 || row < 0) {
      return false;
    }
    let res = false;
    this.feature.gridData.map(tile => {
      if (tile.column === column) {
        if (tile.row === row) {
          if (tile.texture !== '') {
            res = tile;
          }
        }
      }
    });
    return res;
  }


  ///////////////////////////////
  ////// BEGIN DRAW ARROWS //////
  ///////////////////////////////

  drawFilledPolygon(ctx, shape) {
    ctx.beginPath();
    ctx.strokeStyle = 'cyan';
    ctx.fillStyle = 'cyan';
    ctx.moveTo(shape[0][0], shape[0][1]);

    shape.forEach(p => {
      ctx.lineTo(p[0], p[1]);
    });

    ctx.lineTo(shape[0][0], shape[0][1]);
    ctx.fill();
  }

  translateShape(shape, x, y) {
    const rv = [];
    // tslint:disable-next-line: forin
    shape.forEach(p => {
      rv.push([ p[0] + x, p[1] + y ]);
    });
    return rv;
  };

  rotateShape(shape, ang) {
    const rv = [];
    // tslint:disable-next-line: forin
    shape.forEach(p => {
      rv.push(this.rotatePoint(ang, p[0], p[1]));
    });
    return rv;
  };

  rotatePoint(ang, x, y) {
      return [
          (x * Math.cos(ang)) - (y * Math.sin(ang)),
          (x * Math.sin(ang)) + (y * Math.cos(ang))
      ];
  };

  drawLineArrow(ctx, arrowCoords) {
    const x1 = arrowCoords[0];
    const y1 = arrowCoords[1];
    const x2 = arrowCoords[2];
    const y2 = arrowCoords[3];
    const arrow = [
      [ 2, 0 ],
      [ -10, -4 ],
      [ -10, 4]
    ];

    ctx.beginPath();
    ctx.strokeStyle = 'cyan';
    ctx.fillStyle = 'cyan';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const ang = Math.atan2(y2 - y1, x2 - x1);
    const rotatedShape = this.rotateShape(arrow, ang);
    const translatedShape = this.translateShape(rotatedShape, x2, y2);
    this.drawFilledPolygon(ctx, translatedShape);
  };

  getArrowDirectionCoords() {
    switch (this.cloudDirection) {
      case 'right':
        return [30, 60, 60, 60];
      case 'down':
        return [50, 50, 50, 80];
      case 'left':
        return [60, 60, 60, 30];
      case 'up':
        return [50, 80, 50, 50];
    }
  }

  /////////////////////////////
  ////// END DRAW ARROWS //////
  /////////////////////////////



}

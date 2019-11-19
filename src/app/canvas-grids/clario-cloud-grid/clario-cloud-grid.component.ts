import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasGridsComponent } from '../canvas-grids.component';
import * as pip from 'robust-point-in-polygon';

interface ClarioCloudNeighbor {
  count: number;
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
  rows = 20;
  columns = 30;
  adjustmentX = 64;
  adjustmentY = 64;
  tilesOutsideBoundary = [];
  cloudDirection = 'right';

  @ViewChild('clarioCloudCanvas', { static: true })
  canvas;

  ngOnInit() {
    // subscribe to the buildClarioCloudGrid event
    this.feature.onBuildClarioCloudGrid.subscribe(result => {
      this.renderClarioCloudGrid();
    });
    this.feature.onAdjustClarioCloudGridSize.subscribe(result => {
      this.adjustClarioCloudGridSize(result);
    });
    this.feature.onRotateClarioCloudGrid.subscribe(result => {
      this.rotateClarioGrid();
    });
    this.feature.canvasGridColumns = this.columns;
    this.feature.canvasGridRows = this.rows;
  }

  rotateClarioGrid() {
    const directionArr = ['right', 'down', 'left', 'up'];
    const currentDirection = directionArr.findIndex(dir => dir === this.cloudDirection);
    const nextDirection = currentDirection === 3 ? 0 : currentDirection + 1;
    this.cloudDirection = directionArr[nextDirection];
    this.updateGridValues();
  }

  adjustClarioCloudGridSize(adjustment) {
    this.doingGridSizeAdjust = true;
    switch (adjustment) {
      case 'addColumn':
        this.columns++;
        this.feature.canvasGridColumns = this.columns;
        break;
      case 'removeColumn':
        this.columns = Math.max(this.columns - 1, 8);
        this.feature.canvasGridColumns = this.columns;
        break;
      case 'addRow':
        this.rows++;
        this.feature.canvasGridRows = this.rows;
        break;
      case 'removeRow':
        this.rows = Math.max(this.rows - 1, 5);
        this.feature.canvasGridRows = this.rows;
        break;
    }
    const currentSelections = this.getDesignDecisions();
    this.renderClarioCloudGrid();
    this.setGridDisplayValues();
    this.applySelectionsToNewGrid(currentSelections);
    // this.updateGridValues();
    this.doingGridSizeAdjust = false;
  }

  renderClarioCloudGrid() {
    const canvas = this.canvas.nativeElement;
    canvas.width = 64 * this.columns * this.feature.canvasGridScale + 10;
    canvas.height = 64 * this.rows * this.feature.canvasGridScale + 10;

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
    const ccCanvas = document.querySelector('canvas');
    const dataURL = ccCanvas.toDataURL();
    this.feature.design_data_url = dataURL;
  }


  clarioCloudGridClick(event: any) {
    if (this.feature.quoted) {
      this.alert.error('This design has been quoted and can not be altered.  To make changes, duplicate the design and submit a new request with your changes.');
      return;
    }
    this.debug.log('clario-cloud-grid', event);

    let x = event.offsetX;
    let y = event.offsetY;
    x = Math.round(x / this.feature.canvasGridScale);
    y = Math.round(y / this.feature.canvasGridScale);
    console.log(`you clicked on x: ${x}, y: ${y}`);
    let foundTile = false;
    for (const el in this.feature.gridData) {
      if (!foundTile && pip(this.feature.gridData[el].square, [x, y]) === -1) {
        if (this.feature.selectedTool === 'remove') {
          this.feature.gridData[el].material = '';
          foundTile = true;
        } else {
          this.feature.gridData[el].material = this.feature.material;
          foundTile = true;
        }
      }
    }
    this.updateGridValues();
  }

  private updateGridValues() {
    this.setGridNeighborData();
    this.setGridTileValues();
    this.renderClarioCloudGrid();
    this.feature.updateEstimatedAmount();
  }

  private drawSquare(ctx, x, y, index, row, column) {
    const canvasScale = this.feature.canvasGridScale;
    const cloudDirection = this.cloudDirection;
    const showGuide = this.feature.showGuide;
    const tile = this.feature.gridData[index];
    const square = [];
    const xcoords = [0 * canvasScale, 0 * canvasScale, 64 * canvasScale, 64 * canvasScale];
    const ycoords = [0 * canvasScale, 64 * canvasScale, 64 * canvasScale, 0 * canvasScale];

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
        cloud_direction: this.cloudDirection,
        texture: '',
        material: '',
        width: 64,
        height: 64,
        neighbors: this.getNeighborsData(column, row)
      });
    }

    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(xcoords[0], ycoords[0]);
    ctx.lineTo(xcoords[1], ycoords[1]);
    ctx.lineTo(xcoords[2], ycoords[2]);
    ctx.lineTo(xcoords[3], ycoords[3]);
    ctx.closePath();
    ctx.strokeStyle = this.strokeStyle;

    function labelTiles(ctx, xStart, yStart) {
      ctx.font = '20px Arial';
      const textXStart = (xStart + 24 * canvasScale);
      const textYStart = (yStart + 24 * canvasScale);
      ctx.fillStyle = 'white';
      ctx.fillRect(textXStart - 4, textYStart - 18, 24, 24);
      ctx.fillStyle = 'black';
      ctx.fillText(tile.tile, textXStart, textYStart);
      const arrowCoords = getArrowDirectionCoords(xStart, yStart);
      drawLineArrow(ctx, arrowCoords);
    }

    function drawLineArrow(ctx, arrowCoords) {
      const x1 = arrowCoords[0];
      const y1 = arrowCoords[1];
      const x2 = arrowCoords[2];
      const y2 = arrowCoords[3];
      const arrow = [
        [ 2 * canvasScale, 0 * canvasScale ],
        [ -10 * canvasScale, -4 * canvasScale ],
        [ -10 * canvasScale, 4 * canvasScale]
      ];
      const backgroundCoords = getArrowBackgroundCoords(x1, y1, x2, y2)
      ctx.fillStyle = 'white';
      ctx.fillRect(backgroundCoords.xStart, backgroundCoords.yStart, backgroundCoords.xLength, backgroundCoords.yLength);
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const ang = Math.atan2(y2 - y1, x2 - x1);
      const rotatedArrow = rotateArrow(arrow, ang);
      const translatedArrow = translateArrow(rotatedArrow, x2, y2);
      drawFilledPolygon(ctx, translatedArrow);
    };

    function getArrowBackgroundCoords(x1, y1, x2, y2) {
      const coords = {
        xStart: 0,
        yStart: 0,
        xLength: 0,
        yLength: 0,
      };

      switch (cloudDirection) {
        case 'right':
        case 'down':
          coords.xStart = x1 - 5;
          coords.yStart = y1 - 5;
          coords.xLength = x2 - x1 + 10;
          coords.yLength = y2 - y1 + 10;
          break;
        case 'left':
        case 'up':
          coords.xStart = x2 - 5;
          coords.yStart = y2 - 5;
          coords.xLength = x1 - x2 + 10;
          coords.yLength = y1 - y2 + 10;
          break;
      }
      return coords;
    }

    function drawFilledPolygon(ctx, shape) {
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'black';
      ctx.moveTo(shape[0][0], shape[0][1]);

      shape.forEach(p => {
        ctx.lineTo(p[0], p[1]);
      });

      ctx.lineTo(shape[0][0], shape[0][1]);
      ctx.fill();
    }

    function translateArrow(shape, x, y) {
      const rv = [];
      shape.forEach(p => {
        rv.push([ p[0] + x, p[1] + y ]);
      });
      return rv;
    };

    function rotateArrow(shape, ang) {
      const rv = [];
      shape.forEach(p => {
        rv.push(rotatePoint(ang, p[0], p[1]));
      });
      return rv;
    };

    function rotatePoint(ang, x, y) {
      return [
          (x * Math.cos(ang)) - (y * Math.sin(ang)),
          (x * Math.sin(ang)) + (y * Math.cos(ang))
      ];
    };

    function getArrowDirectionCoords(xStart, yStart) {
      let coords;
      switch (cloudDirection) {
        case 'right':
          coords = [20, 42, 42, 42];
          break;
        case 'down':
          coords = [32, 32, 32, 56];
          break;
        case 'left':
          coords = [42, 42, 20, 42];
          break;
        case 'up':
          coords = [32, 56, 32, 32];
          break;
      }
      for (let i = 0; i < coords.length; i++) {
        const xOrYStart = (i % 2 === 0) ? xStart : yStart;
        coords[i] = coords[i] * canvasScale + xOrYStart;
      }
      return coords;
    }

    function adjustedTileLabel () {
      switch (tile.tile) {
        case 'B':
        case 'D':
        case 'E':
        case 'F':
        case 'H':
        case 'L':
        case 'P':
          return 'b';
        default:
          return tile.tile.toLowerCase();
      }
    }

    // if the design is not new, then we can set fill style from gridData
    if (!this.newDesign && !!tile && !!tile.material) {
      const bgImg = new Image();
      bgImg.src = `/assets/images/clario-cloud/${tile.material}/${adjustedTileLabel()}-${tile.cloud_direction}-${tile.material}.png`.replace(/_/g, '-');

      bgImg.onload = function() {
        const xStart = Math.round((tile.square[0][0]) * canvasScale);
        const yStart = Math.round((tile.square[0][1]) * canvasScale);
        console.log(`xStart: ${xStart}, yStart: ${yStart}`);
        ctx.drawImage(bgImg, xStart, yStart, 64 * canvasScale, 64 * canvasScale);
        if (showGuide) {
          labelTiles(ctx, xStart, yStart);
        }
      }
    } else {
      ctx.fillStyle = this.fillStyle;
      ctx.fill();
    }

    ctx.stroke();
    ctx.restore();
  }

  private setGridNeighborData() {
    this.feature.gridData.map(tile => {
      tile.neighbors = this.getNeighborsData(tile.column, tile.row);
    })
  }

  private setGridTileValues() {
    this.feature.gridData.map(tile => {
      tile.cloud_direction = this.cloudDirection;
      if (!!tile.material) {
        switch (tile.neighbors.count) {
          case 0:
            tile.tile = 'S';
            break;
          case 1:
            switch (tile.cloud_direction) {
              case 'right':
                if (!!tile.neighbors.isNeighbor[0]) {tile.tile = 'M'}
                else if (!!tile.neighbors.isNeighbor[1]) {tile.tile = 'N'}
                else if (!!tile.neighbors.isNeighbor[2]) {tile.tile = 'K'}
                else if (!!tile.neighbors.isNeighbor[3]) {tile.tile = 'R'}
                break;
              case 'down':
                if (!!tile.neighbors.isNeighbor[0]) {tile.tile = 'R'}
                else if (!!tile.neighbors.isNeighbor[1]) {tile.tile = 'M'}
                else if (!!tile.neighbors.isNeighbor[2]) {tile.tile = 'N'}
                else if (!!tile.neighbors.isNeighbor[3]) {tile.tile = 'K'}
                break;
              case 'left':
                if (!!tile.neighbors.isNeighbor[0]) {tile.tile = 'K'}
                else if (!!tile.neighbors.isNeighbor[1]) {tile.tile = 'R'}
                else if (!!tile.neighbors.isNeighbor[2]) {tile.tile = 'M'}
                else if (!!tile.neighbors.isNeighbor[3]) {tile.tile = 'N'}
                break;
              case 'up':
                if (!!tile.neighbors.isNeighbor[0]) {tile.tile = 'N'}
                else if (!!tile.neighbors.isNeighbor[1]) {tile.tile = 'K'}
                else if (!!tile.neighbors.isNeighbor[2]) {tile.tile = 'R'}
                else if (!!tile.neighbors.isNeighbor[3]) {tile.tile = 'M'}
                break;
            }
            break;
          case 2:
            switch (tile.cloud_direction) {
              case 'right':
                if (!tile.neighbors.isNeighbor[0] && !tile.neighbors.isNeighbor[1]) {tile.tile = 'C'}
                else if (!tile.neighbors.isNeighbor[1] && !tile.neighbors.isNeighbor[2]) {tile.tile = 'J'}
                else if (!tile.neighbors.isNeighbor[2] && !tile.neighbors.isNeighbor[3]) {tile.tile = 'G'}
                else if (!tile.neighbors.isNeighbor[3] && !tile.neighbors.isNeighbor[0]) {tile.tile = 'A'}
                else if (!tile.neighbors.isNeighbor[0] && !tile.neighbors.isNeighbor[2]) {tile.tile = 'P'}
                else if (!tile.neighbors.isNeighbor[1] && !tile.neighbors.isNeighbor[3]) {tile.tile = 'L'}
                break;
              case 'down':
                if (!tile.neighbors.isNeighbor[0] && !tile.neighbors.isNeighbor[1]) {tile.tile = 'A'}
                else if (!tile.neighbors.isNeighbor[1] && !tile.neighbors.isNeighbor[2]) {tile.tile = 'C'}
                else if (!tile.neighbors.isNeighbor[2] && !tile.neighbors.isNeighbor[3]) {tile.tile = 'J'}
                else if (!tile.neighbors.isNeighbor[3] && !tile.neighbors.isNeighbor[0]) {tile.tile = 'G'}
                else if (!tile.neighbors.isNeighbor[0] && !tile.neighbors.isNeighbor[2]) {tile.tile = 'L'}
                else if (!tile.neighbors.isNeighbor[1] && !tile.neighbors.isNeighbor[3]) {tile.tile = 'P'}
                break;
              case 'left':
                if (!tile.neighbors.isNeighbor[0] && !tile.neighbors.isNeighbor[1]) {tile.tile = 'G'}
                else if (!tile.neighbors.isNeighbor[1] && !tile.neighbors.isNeighbor[2]) {tile.tile = 'A'}
                else if (!tile.neighbors.isNeighbor[2] && !tile.neighbors.isNeighbor[3]) {tile.tile = 'C'}
                else if (!tile.neighbors.isNeighbor[3] && !tile.neighbors.isNeighbor[0]) {tile.tile = 'J'}
                else if (!tile.neighbors.isNeighbor[0] && !tile.neighbors.isNeighbor[2]) {tile.tile = 'P'}
                else if (!tile.neighbors.isNeighbor[1] && !tile.neighbors.isNeighbor[3]) {tile.tile = 'L'}
                break;
              case 'up':
                if (!tile.neighbors.isNeighbor[0] && !tile.neighbors.isNeighbor[1]) {tile.tile = 'J'}
                else if (!tile.neighbors.isNeighbor[1] && !tile.neighbors.isNeighbor[2]) {tile.tile = 'G'}
                else if (!tile.neighbors.isNeighbor[2] && !tile.neighbors.isNeighbor[3]) {tile.tile = 'A'}
                else if (!tile.neighbors.isNeighbor[3] && !tile.neighbors.isNeighbor[0]) {tile.tile = 'C'}
                else if (!tile.neighbors.isNeighbor[0] && !tile.neighbors.isNeighbor[2]) {tile.tile = 'L'}
                else if (!tile.neighbors.isNeighbor[1] && !tile.neighbors.isNeighbor[3]) {tile.tile = 'P'}
                break;
            }
            break;
          case 3:
            switch (tile.cloud_direction) {
              case 'right':
                if (!tile.neighbors.isNeighbor[0]) {tile.tile = 'B'}
                else if (!tile.neighbors.isNeighbor[1]) {tile.tile = 'F'}
                else if (!tile.neighbors.isNeighbor[2]) {tile.tile = 'H'}
                else if (!tile.neighbors.isNeighbor[3]) {tile.tile = 'D'}
                break;
              case 'down':
                if (!tile.neighbors.isNeighbor[0]) {tile.tile = 'F'}
                else if (!tile.neighbors.isNeighbor[1]) {tile.tile = 'H'}
                else if (!tile.neighbors.isNeighbor[2]) {tile.tile = 'D'}
                else if (!tile.neighbors.isNeighbor[3]) {tile.tile = 'B'}
                break;
              case 'left':
                if (!tile.neighbors.isNeighbor[0]) {tile.tile = 'H'}
                else if (!tile.neighbors.isNeighbor[1]) {tile.tile = 'D'}
                else if (!tile.neighbors.isNeighbor[2]) {tile.tile = 'B'}
                else if (!tile.neighbors.isNeighbor[3]) {tile.tile = 'F'}
                break;
              case 'up':
                if (!tile.neighbors.isNeighbor[0]) {tile.tile = 'D'}
                else if (!tile.neighbors.isNeighbor[1]) {tile.tile = 'B'}
                else if (!tile.neighbors.isNeighbor[2]) {tile.tile = 'F'}
                else if (!tile.neighbors.isNeighbor[3]) {tile.tile = 'H'}
                break;
            }
            break;
          case 4:
              tile.tile = 'E';
          break;
        }
      }
    })
  }

  private getNeighborsData(column, row) {
    let count = 0;

    const neighbors = [];
    neighbors.push(!!this.findTileByColumnAndRow(column, row - 1)); // TOP neighbor
    neighbors.push(!!this.findTileByColumnAndRow(column + 1, row)); // RIGHT neighbor
    neighbors.push(!!this.findTileByColumnAndRow(column, row + 1)); // BOTTOM neighbor
    neighbors.push(!!this.findTileByColumnAndRow(column - 1, row)); // LEFT neighbor

    for (let i = 0; i < neighbors.length; i++) {
      if (!!neighbors[i]) { count++; }
    }

    return {
      count: count,
      isNeighbor: neighbors
    }
  }

  findTileByColumnAndRow(column, row) {
    if (column < 0 || row < 0) {
      return false;
    }
    let res = false;
    this.feature.gridData.map(tile => {
      if (tile.column === column) {
        if (tile.row === row) {
          if (tile.material !== '') {
            res = tile;
          }
        }
      }
    });
    return res;
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasGridsComponent } from '../canvas-grids.component';
import * as pip from 'robust-point-in-polygon';

@Component({
  selector: 'app-clario-cloud-grid',
  templateUrl: './clario-cloud-grid.component.html',
  styleUrls: ['../canvas-grids.component.scss', './clario-cloud-grid.component.scss']
})
export class ClarioCloudGridComponent extends CanvasGridsComponent implements OnInit {
  rows = 5;
  columns = 5;
  adjustmentX = 48;
  adjustmentY = 48;
  tilesOutsideBoundary = [];

  @ViewChild('clarioCloudCanvas')
  canvas;

  ngOnInit() {
        // subscribe to the buildClarioCloudGrid event
        this.debug.log('clario-cloud-grid', 'setting clarioCloudGrid Subscription');
        this.feature.onBuildClarioCloudGrid.subscribe(result => {
          this.debug.log('clario-cloud-grid-component', 'building the clario-cloud grid');
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
    this.debug.log('clario-cloud-grid-component', 'rendering the clario-cloud grid');
    const canvas = this.canvas.nativeElement;
    canvas.width = 52 * this.columns * this.feature.canvasGridScale;
    canvas.height = 52 * this.rows * this.feature.canvasGridScale;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    // new design
    if (typeof this.feature.gridData === 'undefined') {
      this.feature.gridData = [];
      this.newDesign = true;
    } else {
      this.newDesign = false;
    }
    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.columns; ++c) {
        this.createSquareSection(
          ctx,
          c * this.adjustmentX * this.feature.canvasGridScale,
          r * this.adjustmentY * this.feature.canvasGridScale,
          this.isOdd(r),
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

    return;

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
          this.debug.log('clario-cloud-grid', this.feature.gridData[el]);
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
              const index = this.feature.findClarioCloudTileAt(
                this.feature.gridData[el].neighbors[neighbor][0],
                this.feature.gridData[el].neighbors[neighbor][1]
              );
            }
          }
        }
        this.debug.log('clario-cloud-grid', this.feature.gridData[el]);
        // render the canvas again
        this.renderClarioCloudGrid();
        // update the estimated amount
        this.feature.updateEstimatedAmount();
      }
    }
    // this.changeGridDimensions();
  }

  private createSquareSection(ctx, adjustmentX, adjustmentY, isOdd, row, column) {
    const index = (row * 9 + column) * 4;
    const squareXval = 2 + adjustmentX * this.feature.canvasGridScale;
    const squareYval = 2 + adjustmentY * this.feature.canvasGridScale;

    this.drawSquare(
      ctx,
      squareXval,
      squareYval,
      -Math.PI / 2,
      row,
      column,
      index
    );
  }

  private drawSquare(ctx, x, y, rotateAngle, row, column, index) {
    console.log(`row: ${Math.floor(index / 9)}`);
    console.log(`index: ${index}, column: ${index % 10}`);
    // square points
    let xcoords = [0, 0, 48, 48];
    let ycoords = [0, 48, 48, 0];

    xcoords = xcoords.map(xpoint => xpoint * this.feature.canvasGridScale);
    ycoords = ycoords.map(ypoint => ypoint * this.feature.canvasGridScale);

    rotateAngle = 0;
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
        texture: '',
        rotation: this.toDegrees(rotateAngle),
        material: '',
        tile: '',
        diffusion: '',
        neighbors: this.getNeighbors(x, y, index, this.toDegrees(rotateAngle)),
        width: 48,
        height: 48
      });
    }

    // save the current canvas state
    ctx.save();
    // start drawing
    ctx.beginPath();
    // move to the new x,y coordinates (setting a new 0,0 at x,y)
    ctx.translate(x, y);
    // rotate to fit in the tesselation
    ctx.rotate(rotateAngle);
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
      // set the fillstyle
      ctx.fillStyle = this.feature.gridData[index].hex;
      // fill the square
      ctx.fill();
      if (this.feature.showGuide) {
        this.labelTiles(ctx, rotateAngle, index);
      }
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

  private tileAbbreviation(tile) {
    let abbreviation: string;
    switch (tile) {
      case 'concave':
        abbreviation = 'CC';
        break;

      case 'convex':
        abbreviation = 'CV';
        break;

      default:
        this.alert.error('Unknown tile: ' + tile);
        break;
    }
    return abbreviation;
  }

  private materialTypeAbbreviation(materialType) {
    let abbreviation: string;
    switch (materialType) {
      case 'felt':
        abbreviation = 'F';
        break;

      case 'varia':
        abbreviation = 'V';
        break;

      default:
        this.alert.error('Unknown material type: ' + materialType);
        break;
    }
    return abbreviation;
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
    ctx.fillText(this.materialTypeAbbreviation(this.feature.gridData[index].materialType), -4, -5);
    ctx.font = '10px Arial';
    ctx.fillText(this.tileAbbreviation(this.feature.gridData[index].tile), -8, 4);
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

}

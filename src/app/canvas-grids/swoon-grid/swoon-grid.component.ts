import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasGridsComponent } from './../canvas-grids.component';
import * as pip from 'robust-point-in-polygon';

@Component({
  selector: 'app-swoon-grid',
  templateUrl: './swoon-grid.component.html',
  styleUrls: ['../canvas-grids.component.scss', './swoon-grid.component.scss']
})
export class SwoonGridComponent extends CanvasGridsComponent implements OnInit {
  // rows = 10;
  // columns = 13;
  adjustmentX = 57;
  adjustmentY = 49;

  @ViewChild('swoonCanvas', { static: true })
  canvas;

  ngOnInit() {
    this.debug.log('swoon-grid', 'setting swoonGrid Subscription');
    this.feature.onBuildSwoonGrid.subscribe(result => {
      this.debug.log('swoon-grid-component', 'building the swoon grid');
      this.renderSwoonGrid();
    });
    this.feature.onAdjustSwoonGridSize.subscribe(result => {
      this.adjustSwoonGridSize(result);
    });
  }

  adjustSwoonGridSize(adjustment) {
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
    this.renderSwoonGrid();
    this.applySelectionsToNewGrid(currentSelections);
    this.doingGridSizeAdjust = false;
  }

  renderSwoonGrid() {
    this.debug.log('swoon-grid-component', 'rendering the swoon grid');
    const canvas = this.canvas.nativeElement;
    canvas.width = this.canvasWidth * this.feature.canvasGridScale;
    canvas.height = this.canvasHeight * this.feature.canvasGridScale;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;

    // new design
    if (typeof this.feature.gridData === 'undefined') {
      this.feature.gridData = [];
      this.newDesign = true;
    } else {
      this.newDesign = false;
    }
    // console.log(`rows: ${this.rows}, columns: ${this.columns}`);
    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.columns; ++c) {
        this.createSwoonSection(
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

  swoonGridClick(event: any) {
    if (this.feature.quoted) {
      this.alert.error('This design has been quoted and can not be altered.  To make changes, duplicate the design and submit a new request with your changes.');
      return;
    }
    const x = Math.round(event.offsetX / this.feature.canvasGridScale);
    const y = Math.round(event.offsetY / this.feature.canvasGridScale);
    let foundTile = false;

    this.debug.log('swoon-grid', `you clicked on x: ${x} and y: ${y}`);
    this.debug.log('swoon-grid', this.feature.gridData);
    for (const el in this.feature.gridData) {
      if (!foundTile && pip(this.feature.gridData[el].diamond, [x, y]) !== 1) {
        this.debug.log(
          'swoon-grid-component',
          `row: ${this.feature.gridData[el].row}, column: ${this.feature.gridData[el].column}, index: ${this.feature.gridData[el].index}`
        );
        // removing a tile
        if (this.feature.selectedTool === 'remove') {
          this.debug.log('swoon-grid', 'removing tile');
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
          this.debug.log('swoon-grid', this.feature.gridData[el]);
          // set the tile found true so we don't "find" another one that's close
          foundTile = true;
        } else {
          this.debug.log('swoon-grid', 'setting tile info');
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
        }
        this.debug.log('swoon-grid', this.feature.gridData[el]);
        // // render the canvas again
        this.renderSwoonGrid();
        // // update the estimated amount
        this.feature.updateEstimatedAmount();
      }
    }
  }

  private createSwoonSection(ctx, adjustmentX, adjustmentY, isOdd, row, column) {
    // this.debug.log(
    //   'swoon-section',
    //   `ctx: ${ctx}, adjustmentX: ${adjustmentX}, adjustmentY: ${adjustmentY}, isOdd: ${isOdd}, row: ${row}, column: ${column}`
    // );

    const index = (row * this.columns + column) * 3; // 3 is the number of diamonds needed to make a section

    // console.log(row, this.columns, column, index);

    const firstRotation = 30;
    const secondRotation = firstRotation - 60;
    const thirdRotation = firstRotation + 60;

    if (isOdd) {
      this.drawDiamond(
        ctx,
        58 * this.feature.canvasGridScale + adjustmentX,
        1 * this.feature.canvasGridScale + adjustmentY,
        firstRotation,
        row,
        column,
        index
      );
      this.drawDiamond(
        ctx,
        58 * this.feature.canvasGridScale + adjustmentX,
        34 * this.feature.canvasGridScale + adjustmentY,
        secondRotation,
        row,
        column,
        index + 1
      );
      this.drawDiamond(
        ctx,
        58 * this.feature.canvasGridScale + adjustmentX,
        34 * this.feature.canvasGridScale + adjustmentY,
        thirdRotation,
        row,
        column,
        index + 2
      );
    } else {
      this.drawDiamond(
        ctx,
        30 * this.feature.canvasGridScale + adjustmentX,
        1 * this.feature.canvasGridScale + adjustmentY,
        firstRotation,
        row,
        column,
        index
      );
      this.drawDiamond(
        ctx,
        30 * this.feature.canvasGridScale + adjustmentX,
        34 * this.feature.canvasGridScale + adjustmentY,
        secondRotation,
        row,
        column,
        index + 1
      );
      this.drawDiamond(
        ctx,
        30 * this.feature.canvasGridScale + adjustmentX,
        34 * this.feature.canvasGridScale + adjustmentY,
        thirdRotation,
        row,
        column,
        index + 2
      );
    }
  }

  private drawDiamond(ctx, x, y, rotateAngle, row, column, index) {
    // this.debug.log('draw-diamond', `x: ${x}, y: ${y}, rotation: ${rotateAngle}, row: ${row}, column: ${column}, index: ${index}`);

    // points to create a diamond
    let xcoords = [0, -260.5, 260.5, 521];
    let ycoords = [0, 451, 451, 0];
    const diamondScaleFactor = 0.063;

    xcoords = xcoords.map(xpoint => xpoint * diamondScaleFactor * this.feature.canvasGridScale);
    ycoords = ycoords.map(ypoint => ypoint * diamondScaleFactor * this.feature.canvasGridScale);

    // create the swoon section
    // add x,y to all the points on the diamond
    const diamond = [];
    for (let i = 0; i < xcoords.length; ++i) {
      diamond[i] = this.rotateCoords(x, y, xcoords[i] + x, ycoords[i] + y, rotateAngle);
    }

    const newDiamond = {
      index: index,
      row: row,
      column: column,
      x: x,
      y: y,
      diamond: diamond,
      texture: '',
      rotation: this.toRadians(rotateAngle),
      material: '',
      tile: '',
      diffusion: '',
      hex: ''
    };

    if (this.newDesign || this.doingGridSizeAdjust) {
      this.feature.gridData.push(newDiamond);
    }

    if (!this.feature.gridData[index]) {
      this.feature.gridData[index] = newDiamond;
    }
    // save current canvas state
    ctx.save();
    // start drawing
    ctx.beginPath();
    // move to the new x,y coordinates (setting a new 0,0 at x,y)
    ctx.translate(x, y);

    // rotate to fit the tesselation
    // ctx.rotate(rotateAngle);
    // this.debug.log('swoon-grid', rotateAngle);
    // this.debug.log('swoon-grid', this.toRadians(rotateAngle));
    ctx.rotate(this.toRadians(rotateAngle));
    // move to the start of the pentagon and then draw the lines
    ctx.moveTo(xcoords[0], ycoords[0]);
    ctx.lineTo(xcoords[1], ycoords[1]);
    ctx.lineTo(xcoords[2], ycoords[2]);
    ctx.lineTo(xcoords[3], ycoords[3]);
    // close the path
    ctx.closePath();
    // set the strokestyle
    ctx.strokeStyle = this.strokeStyle;

    // if the design is not new, then we can set the fill style from the gridData
    if (!this.newDesign && !!this.feature.gridData[index] && !!this.feature.gridData[index].texture) {
      // set the fillstyle
      ctx.fillStyle = this.feature.gridData[index].hex;
      // fill the diamond
      ctx.fill();
      if (this.feature.showGuide) {
        // this.labelTiles(ctx, rotateAngle, index);
      }
    } else {
      ctx.fillStyle = this.fillStyle;
      // fill the diamond
      ctx.fill();
    }

    // DEBUGGING
    // ctx.rotate(rotateAngle);
    // ctx.fillStyle = '#00E1E1';
    // ctx.font = '14px Arial';
    // ctx.fillText(row, -5, -5);
    // ctx.font = '8px Arial';
    // ctx.fillText(x + ', ' + y, -15, 5);

    // stroke all the pentagon lines
    ctx.stroke();
    // restore the context so that we can draw the next diamond
    ctx.restore();
  }
}

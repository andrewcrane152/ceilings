import { Feature } from './../_features/feature';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HushBlocksShippingService {
  public hushShippingData = {
    '1-1-2': {
      weight: 1.4,
      box_capacity: {
        oneByFour: 24,
        twoByTwo: 24
      }
    },
    '1-2-2': {
      weight: 2.4,
      box_capacity: {
        oneByFour: 12,
        twoByTwo: 12
      }
    },
    '1-3-2': {
      weight: 3.4,
      box_capacity: {
        oneByFour: 6,
        twoByTwo: null
      }
    },
    '1-4-2': {
      weight: 4.3,
      box_capacity: {
        oneByFour: 6,
        twoByTwo: null
      }
    },
    '2-2-2': {
      weight: 3.5,
      box_capacity: {
        oneByFour: null,
        twoByTwo: 6
      }
    },
    '2-2-2-t': {
      weight: 2.6,
      box_capacity: {
        oneByFour: null,
        twoByTwo: 12
      }
    }
  };

  private currentShippingInfo = {
    totalWeight: 0,
    boxesRecommended: {
      oneByFour: 0,
      twoByTwo: 0
    }
  };

  private purchasedTiles: any;
  private tilesRemaining: Object;

  hushBlocksShippingTotals(tileCount) {
    this.purchasedTiles = tileCount;
    this.tilesRemaining = JSON.parse(JSON.stringify(this.purchasedTiles));
    this.calcShippingBoxes();
    this.calcTotalWeight();
    return this.currentShippingInfo;
  }

  private calcShippingBoxes() {
    this.currentShippingInfo = {
      totalWeight: 0,
      boxesRecommended: {
        oneByFour: 0,
        twoByTwo: 0
      }
    };

    this.fillBoxes();
  }

  private fillBoxes() {
    this.fillFullBoxes();

    // fill partial boxes
    Object.entries(this.tilesRemaining).map(size => {
      if (size[1] > 0) {
        this.fillRemainingBoxes();
        return;
      }
    });
  }

  fillFullBoxes() {
    Object.keys(this.tilesRemaining).forEach(tileId => {
      const capacity1x4 = this.hushShippingData[tileId].box_capacity.oneByFour;
      const capacity2x2 = this.hushShippingData[tileId].box_capacity.twoByTwo;
      if (!!capacity1x4 && this.tilesRemaining[tileId] >= capacity1x4) {
        // console.log(`${tileId}: add ${Math.floor(this.tilesRemaining[tileId] / this.hushShippingData[tileId].box_capacity.oneByFour)} boxes`);
        this.currentShippingInfo.boxesRecommended.oneByFour += Math.floor(
          this.tilesRemaining[tileId] / this.hushShippingData[tileId].box_capacity.oneByFour
        );
        this.tilesRemaining[tileId] = this.tilesRemaining[tileId] % this.hushShippingData[tileId].box_capacity.oneByFour;
      }
      if (!!capacity2x2 && this.tilesRemaining[tileId] >= capacity2x2) {
        // console.log(`${tileId}: add ${Math.floor(this.tilesRemaining[tileId] / this.hushShippingData[tileId].box_capacity.twoByTwo)} boxes`);
        this.currentShippingInfo.boxesRecommended.twoByTwo += Math.floor(
          this.tilesRemaining[tileId] / this.hushShippingData[tileId].box_capacity.twoByTwo
        );
        this.tilesRemaining[tileId] = this.tilesRemaining[tileId] % this.hushShippingData[tileId].box_capacity.twoByTwo;
      }
    });
  }

  private fillRemainingBoxes() {
    const boxSizesNeeded = this.getBoxSizesNeeded();
    if (boxSizesNeeded.oneByFour) {
      this.fillAOneByFourBox();
      return;
    } else if (boxSizesNeeded.twoByTwo) {
      this.fillATwoByTwoBox();
      return;
    } else if (boxSizesNeeded.either) {
      this.fillEither();
      return;
    }
  }

  private getBoxSizesNeeded() {
    const sizesNeeded = {
      oneByFour: false,
      twoByTwo: false,
      either: false
    };
    Object.keys(this.tilesRemaining).forEach(tileId => {
      if (this.tilesRemaining[tileId] > 0) {
        switch (tileId) {
          case '1-1-2':
          case '1-2-2':
            sizesNeeded.either = true;
            break;
          case '1-3-2':
          case '1-4-2':
            sizesNeeded.oneByFour = true;
            break;
          case '2-2-2':
          case '2-2-2-t':
            sizesNeeded.twoByTwo = true;
            break;
        }
      }
    });
    return sizesNeeded;
  }

  private fillAOneByFourBox() {
    this.currentShippingInfo.boxesRecommended.oneByFour++;
    let boxCapacity = [4, 4, 4, 4, 4, 4];
    const sizesRemaining = this.getSizesRemaining('1');

    function fillSpaces(tilesRemaining) {
      // fill boxes with largest size first
      for (let i = sizesRemaining.length - 1; i >= 0; i--) {
        if (boxCapacity.includes(sizesRemaining[i])) {
          const tileId = `1-${sizesRemaining[i]}-2`;
          tilesRemaining[tileId]--;
          sizesRemaining.splice(i, 1);
          boxCapacity = boxCapacity.splice(boxCapacity.indexOf(sizesRemaining[i]), 1);
          if (sizesRemaining[i] === 3) {
            // TODO check for 1
            console.log('look for 1');
          }
        }
      }
    }

    const checkSizesToFill = [4, 3, 2, 1];
    if (boxCapacity.length > 0) {
      checkSizesToFill.map(size => {
        let newBox = [];
        switch (size) {
          case 4:
            newBox = [4, 4, 4, 4, 4, 4];
            boxCapacity = newBox.sort((a, b) => b - a);
            fillSpaces(this.tilesRemaining);
            break;
          case 3:
            boxCapacity.map(ii => {
              newBox.push(3);
              newBox.push(1);
            });
            boxCapacity = newBox.sort((a, b) => b - a);
            fillSpaces(this.tilesRemaining);
            break;
          case 2:
            boxCapacity.map(jj => {
              if (jj === 3) {
                newBox.push(2);
                newBox.push(2);
              }
            });
            boxCapacity = newBox.sort((a, b) => b - a);
            fillSpaces(this.tilesRemaining);
            break;
          case 1:
            const sum = boxCapacity.reduce((a, b) => a + b, 0);
            newBox = Array(sum).fill(1);
            boxCapacity = newBox.sort((a, b) => b - a);
            fillSpaces(this.tilesRemaining);
            break;
        }
      });
    }
    if (this.getSizesRemaining('1').length > 0) {
      this.fillRemainingBoxes();
    }
  }

  private getSizesRemaining(tileType) {
    let sizesRemaining = [];
    Object.keys(this.tilesRemaining).forEach(tileId => {
      switch (tileType) {
        case '1':
          if (tileId.slice(0, 1) === '1') {
            const size = parseInt(tileId.slice(2, 3), 10);
            const howMany = this.tilesRemaining[tileId];
            const tileSizeCount = Array(howMany).fill(size);
            sizesRemaining = sizesRemaining.concat(tileSizeCount);
          }
          break;
        case '2':
          if (tileId.slice(0, 1) === '2') {
            const size = !tileId.includes('t') ? 2 : 1;
            const howMany = this.tilesRemaining[tileId];
            const tileSizeCount = Array(howMany).fill(size);
            sizesRemaining = sizesRemaining.concat(tileSizeCount);
          }
          break;
        case 'small1xFor2xBox':
          if (tileId === '1-1-2' || tileId === '1-2-2') {
            const size = parseInt(tileId.slice(2, 3), 10);
            const howMany = this.tilesRemaining[tileId];
            const tileSizeCount = Array(howMany).fill(size);
            sizesRemaining = sizesRemaining.concat(tileSizeCount);
          }
          break;
      }
    });
    return this.sortHighToLow(sizesRemaining);
  }

  private fillATwoByTwoBox() {
    this.currentShippingInfo.boxesRecommended.twoByTwo++;
    let sizesRemaining = this.getSizesRemaining('2');
    let boxCapacity = [2, 2, 2, 2, 2, 2];

    function fillSpaces(tilesRemaining) {
      for (let i = sizesRemaining.length - 1; i >= 0; i--) {
        if (sizesRemaining[i] > 0) {
          const tileId = sizesRemaining[i] === 2 ? `2-2-2` : `2-2-2-t`;
          tilesRemaining[tileId]--;
          sizesRemaining.splice(i, 1);
          boxCapacity = boxCapacity.splice(boxCapacity.indexOf(sizesRemaining[i]), 1);
        }
      }
    }

    let checkSizesToFill = ['2-2-2', '2-2-2-t'];
    if (boxCapacity.length > 0) {
      checkSizesToFill.map(size => {
        let newBox = [];
        switch (size) {
          case '2-2-2':
            newBox = [2, 2, 2, 2, 2, 2];
            boxCapacity = newBox.sort((a, b) => b - a);
            fillSpaces(this.tilesRemaining);
            break;
          case '2-2-2-t':
            const sum = boxCapacity.reduce((a, b) => a + b, 0);
            newBox = Array(sum).fill(1);
            boxCapacity = newBox.sort((a, b) => b - a);
            fillSpaces(this.tilesRemaining);
            break;
        }
      });
    }

    if (this.getSizesRemaining('2').length > 0) {
      this.fillRemainingBoxes();
    }

    if (boxCapacity.length > 0) {
      sizesRemaining = this.getSizesRemaining('small1xFor2xBox');
      checkSizesToFill = ['1-2-2', '1-1-2'];

      for (let i = sizesRemaining.length - 1; i >= 0; i--) {
        checkSizesToFill.map(size => {
          if (this.tilesRemaining[size] > 0) {
            this.tilesRemaining[size]--;
            sizesRemaining.splice(i, 1);
            boxCapacity = boxCapacity.splice(boxCapacity.indexOf(sizesRemaining[i]), 1);
          }
        });
      }
    }
  }

  private fillEither() {
    const boxesRecommended = this.currentShippingInfo.boxesRecommended;
    if (boxesRecommended.oneByFour >= boxesRecommended.twoByTwo) {
      this.fillAOneByFourBox();
    } else {
      this.fillATwoByTwoBox();
    }
  }

  private calcTotalWeight() {
    let totalWeight = 0;
    Object.keys(this.purchasedTiles).forEach(tileId => {
      if (this.purchasedTiles[tileId] > 0) {
        totalWeight += this.hushShippingData[tileId].weight * this.purchasedTiles[tileId];
      }
    });
    this.currentShippingInfo.totalWeight = totalWeight;
  }

  private sortHighToLow(arr) {
    return arr.sort((a, b) => b - a);
  }

  public humanizeHushBlocksSizes(size) {
    switch (size) {
      case '1-1-2':
        return `1'x1'`;
      case '1-2-2':
        return `1'x2'`;
      case '1-3-2':
        return `1'x3'`;
      case '1-4-2':
        return `1'x4'`;
      case '2-2-2':
        return `2'x2'`;
      case '2-2-2-t':
        return `2'x2' triangle`;
    }
  }
}

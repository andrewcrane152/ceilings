import { Feature } from './../_features/feature';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HushBlocksShippingService {
  public hushShippingData = {
    '1-1-2': {
      'weight': 1.4,
      'box_capacity': {
        'oneByFour': 24,
        'twoByTwo': 24
      }
    },
    '1-2-2': {
      'weight': 2.4,
      'box_capacity': {
        'oneByFour': 12,
        'twoByTwo': 12
      }
    },
    '1-3-2': {
      'weight': 3.4,
      'box_capacity': {
        'oneByFour': 6,
        'twoByTwo': null
      }
    },
    '1-4-2': {
      'weight': 4.3,
      'box_capacity': {
        'oneByFour': 6,
        'twoByTwo': null
      }
    },
    '2-2-2': {
      'weight': 3.5,
      'box_capacity': {
        'oneByFour': null,
        'twoByTwo': 6
      }
    },
    '2-2-2-t': {
      'weight': 2.6,
      'box_capacity': {
        'oneByFour': null,
        'twoByTwo': 12
      }
    }
  }

  private currentShippingInfo = {
    totalWeight: 0,
    boxesRecommended: {
      'oneByFour': 0,
      'twoByTwo': 0
    }
  }

  private purchasedTiles = {};
  private tilesRemaining = {};

  hushBlocksShippingTotals(tileCount) {
    // console.warn(tileCount);
    this.purchasedTiles = tileCount;
    this.tilesRemaining = JSON.parse(JSON.stringify(this.purchasedTiles));
    this.calcShippingBoxes();
    this.calcTotalWeight();
    return this.currentShippingInfo;
  }

  private calcShippingBoxes () {
    this.currentShippingInfo = {
      totalWeight: 0,
      boxesRecommended: {
        'oneByFour': 0,
        'twoByTwo': 0
      }
    }

    this.fillFullBoxes();
    this.fillRemainingBoxes();
  }

  private fillFullBoxes() {
    // fill full boxes first
    Object.keys(this.tilesRemaining).forEach(tileId => {
      const capacity1x4 = this.hushShippingData[tileId].box_capacity.oneByFour;
      const capacity2x2 = this.hushShippingData[tileId].box_capacity.twoByTwo;
      if (!!capacity1x4 && this.tilesRemaining[tileId] >= capacity1x4) {
        console.log(`${tileId}: add ${Math.floor(this.tilesRemaining[tileId] / this.hushShippingData[tileId].box_capacity.oneByFour)} boxes`);
        this.currentShippingInfo.boxesRecommended.oneByFour += Math.floor(this.tilesRemaining[tileId] / this.hushShippingData[tileId].box_capacity.oneByFour);
        this.tilesRemaining[tileId] = this.tilesRemaining[tileId] % this.hushShippingData[tileId].box_capacity.oneByFour;
      }
      if (!!capacity2x2 && this.tilesRemaining[tileId] >= capacity2x2) {
        console.log(`${tileId}: add ${Math.floor(this.tilesRemaining[tileId] / this.hushShippingData[tileId].box_capacity.twoByTwo)} boxes`);
        this.currentShippingInfo.boxesRecommended.twoByTwo += Math.floor(this.tilesRemaining[tileId] / this.hushShippingData[tileId].box_capacity.twoByTwo);
        this.tilesRemaining[tileId] = this.tilesRemaining[tileId] % this.hushShippingData[tileId].box_capacity.twoByTwo;
      }
    });
    console.log('Shipping Info:', this.currentShippingInfo);
  }

  private fillRemainingBoxes() {
    const boxSizesNeeded = this.getBoxSizesNeeded();
    if (boxSizesNeeded.oneByFour) {
      this.fillAOneByFourBox();
      return;
    } else if (boxSizesNeeded.twoByTwo) {
      this.fillATwoByTwoBox()
      return;
    } else if (boxSizesNeeded.either) {
      this.fillEither();
      return;
    }
  }

  private getBoxSizesNeeded() {
    const sizesNeeded = {
      'oneByFour': false,
      'twoByTwo': false,
      'either': false
    }
    Object.keys(this.tilesRemaining).forEach(tileId => {
      if (this.tilesRemaining[tileId] > 0 ) {
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
    const tilesUsed = [];

    for (let i = sizesRemaining.length - 1; i >= 0; i--) {
      if (boxCapacity.includes(sizesRemaining[i])) {
        tilesUsed.push(sizesRemaining[i]);
        sizesRemaining.splice(i, 1);
        boxCapacity = boxCapacity.splice(boxCapacity.indexOf(sizesRemaining[i]), 1);
      }
    }
    if (boxCapacity.length > 0) {
      const newBox = [];
      let sizeAdjustment = 1;
      boxCapacity.map(size => {
        newBox.push(size - sizeAdjustment);
        newBox.push(sizeAdjustment);
      })
      boxCapacity = newBox;
    }

    boxCapacity = this.sortHighToLow(boxCapacity);
    console.log('sizesRemaining:', sizesRemaining);
    console.log('box:', boxCapacity);

    //remove the tiles
    tilesUsed.map(tileSize => {
      let tileId =`1-${tileSize}-2`;
      this.tilesRemaining[tileId]--;
    })
  }

  private getSizesRemaining(tileType) {
    let sizesRemaining = [];
    Object.keys(this.tilesRemaining).forEach(tileId => {
      console.log('tileId:', tileId);
      switch (tileType) {
        case '1':
          if (tileId.slice(0, 1) === '1') {
            const size = parseInt(tileId.slice(2, 3), 10);
            const howMany = this.tilesRemaining[tileId];
            const tileSizeCount = Array(howMany).fill(size)
            sizesRemaining = sizesRemaining.concat(tileSizeCount);
          }
          break;
        case '2':
          console.log('2X2 box needed');
          break;
        case 'either':
          console.log('either box needed');
          break;
      }
    });
    return this.sortHighToLow(sizesRemaining);
  }

  private fillATwoByTwoBox() {
    console.log('fill twoByTwo');

  }

  private fillEither() {
    console.log('fill either');

  }

  private fillA1xBox(sizesRemaining1x) {
    // console.log('sizesRemaining1x', sizesRemaining1x);
    // start with biggest box needed
    const biggestBoxLeft = sizesRemaining1x[0];
    this.currentShippingInfo.boxesRecommended[biggestBoxLeft]++;
    const largestSizeLeft = `1-${sizesRemaining1x[0]}-2`;

    // populate remaining spaces array
    const spacesAvailable = [];
    const remainingSpaces = this.hushShippingData[largestSizeLeft].capacity - this.tilesRemaining[largestSizeLeft];
    for (let ii = 0; ii < remainingSpaces; ii++) {
      spacesAvailable.push(biggestBoxLeft);
    }

    // zero out the tilesRemaining for the biggest box left
    // can do this because complete boxes have already been filled
    this.tilesRemaining[largestSizeLeft] = 0;

    // spaces needed to fill order
    let spacesNeeded = [];
    sizesRemaining1x.map(size => {
      const sizeCount = this.tilesRemaining[`1-${size}-2`];
      for (let jj = 0; jj < sizeCount; jj++) {
        spacesNeeded.push(size);
      }
    });
    spacesNeeded = this.sortHighToLow(spacesNeeded);

    // fill spacesAvailable with spacesNeeded
    // console.log('spacesNeeded:', spacesNeeded);
    // console.log('spacesAvailable', spacesAvailable);
    spacesAvailable.map((block) => {
      // first check next size down and it's inverse
      let sizeToCheck = block - 1;
      while (sizeToCheck > 0) {
        if (spacesNeeded.includes(sizeToCheck)) {
          // console.warn('found one:', sizeToCheck);
          this.tilesRemaining[`1-${sizeToCheck}-2`]--;
          spacesAvailable.splice(spacesAvailable.indexOf(sizeToCheck), 1);
          spacesNeeded.splice(spacesNeeded.indexOf(sizeToCheck), 1);
          const complimentingSize = block - sizeToCheck;
          if (spacesNeeded.includes(complimentingSize)) {
            // console.warn('found compliment:', complimentingSize);
            this.tilesRemaining[`1-${complimentingSize}-2`]--;
            spacesAvailable.splice(spacesAvailable.indexOf(complimentingSize), 1);
            spacesNeeded.splice(spacesNeeded.indexOf(complimentingSize), 1);
          }
          return;
        } else {
          // console.log('checking different size');
          sizeToCheck--;
        }
      }
    })
    // console.log('spacesNeeded:', spacesNeeded);
    if (spacesNeeded.length > 0) { this.fillA1xBox }
  }

  private fill2xBoxes(sizesRemaining) {
    // console.log('2x remaining sizes:', sizesRemaining);
  }


  private calcTotalWeight() {
    // TODO
    // console.log('calc Hush weight');

  }

  private sortHighToLow(arr) {
    return arr.sort((a, b) => b - a);
  }
}

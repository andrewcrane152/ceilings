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
      'capacity': 24
    },
    '1-2-2': {
      'weight': 2.4,
      'capacity': 12
    },
    '1-3-2': {
      'weight': 3.4,
      'capacity': 6
    },
    '1-4-2': {
      'weight': 4.3,
      'capacity': 6
    },
    '2-2-2': {
      'weight': 3.5,
      'capacity': 12
    },
    '2-2-2-t': {
      'weight': 2.6,
      'capacity': 12
    }
  }

  private currentShippingInfo = {
    totalWeight: 0,
    boxesRecommended: {
      '1-1-2': 0,
      '1-2-2': 0,
      '1-3-2': 0,
      '1-4-2': 0,
      '2-2-2': 0,
      '2-2-2-t': 0,
    }
  }

  private purchasedTiles = {};
  private tilesRemaining = {};

  hushBlocksShippingTotals(tileCount) {
    console.warn(tileCount);
    // tileCount is formatted like hushShippingInfo.boxesRecommended
    this.purchasedTiles = tileCount;
    this.tilesRemaining = JSON.parse(JSON.stringify(tileCount));
    this.calcShippingBoxes();
    this.calcTotalWeight();
    return this.currentShippingInfo;
  }

  private calcShippingBoxes () {
    // fill full boxes first
    Object.keys(this.purchasedTiles).forEach(tileId => {
      if (this.purchasedTiles[tileId] > 0 ) {
        this.currentShippingInfo.boxesRecommended[tileId] = Math.floor(this.purchasedTiles[tileId] / this.hushShippingData[tileId].capacity);
        this.tilesRemaining[tileId] = this.purchasedTiles[tileId] % this.hushShippingData[tileId].capacity;
      }
    });
    this.fillRemainingBoxes();
  }

  private fillRemainingBoxes() {
    const tilesRemaining = this.tilesRemaining;
    let oneXTileSizes = [];
    let twoXTileSizes = [];

    // divide remaining tiles into 1x and 2x
    Object.keys(tilesRemaining).forEach(tileId => {
      if (tilesRemaining[tileId] > 0 ) {
        const tileCategory = parseInt(tileId.slice(0, 1), 10);
        switch (tileCategory) {
          case 1:
            oneXTileSizes.push(parseInt(tileId.slice(2, 3), 10));
            break;
          case 2:
            twoXTileSizes.push(parseInt(tileId.slice(2, 3), 10));
            break;
          default:
            console.warn('unsupported tile category found:', tileCategory);
            break;
        }
      }
    });
    oneXTileSizes = this.sortHighToLow(oneXTileSizes);
    twoXTileSizes = this.sortHighToLow(twoXTileSizes);

    // fill the boxes
    if (oneXTileSizes.length > 0) { this.fillA1xBox(oneXTileSizes); }
    if (twoXTileSizes.length > 0) { this.fill2xBoxes(twoXTileSizes); }

  }

  private fillA1xBox(sizesRemaining1x) {
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
    console.log('spacesNeeded:', spacesNeeded);
    console.log('spacesAvailable', spacesAvailable);
    spacesAvailable.map((block) => {
      // first check next size down and it's inverse
      let sizeToCheck = block - 1;
      while (sizeToCheck > 0) {
        if (spacesNeeded.includes(sizeToCheck)) {
          console.warn('found one:', sizeToCheck);
          this.tilesRemaining[`1-${sizeToCheck}-2`]--;
          spacesAvailable.splice(spacesAvailable.indexOf(sizeToCheck), 1);
          spacesNeeded.splice(spacesNeeded.indexOf(sizeToCheck), 1);
          sizeToCheck = block - sizeToCheck;
        } else {
          console.log('checking different size');
          sizeToCheck--;
        }
      }
    })
    console.log('spacesNeeded:', spacesNeeded);
  }

  private fill2xBoxes(sizesRemaining) {
    // console.log('2x remaining sizes:', sizesRemaining);
  }


  private calcTotalWeight() {
    // TODO
    console.log('calc Hush weight');

  }

  private sortHighToLow(arr) {
    return arr.sort((a, b) => b - a);
  }
}

import { Feature } from './../_features/feature';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HushBlocksShippingService {
  hushShippingData = {
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

  purchasedTiles = {};

  hushBlocksShippingTotals(tileCount) {
    // tileCount is formatted like hushShippingInfo.boxesRecommended
    this.purchasedTiles = tileCount;
    const shippingData = this.hushShippingData;
    const hushShippingInfo = {
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

    function calcShippingBoxes () {
      const purchasedTiles = this.purchasedTiles;
      console.warn('purchasedTiles', purchasedTiles);
      const tilesRemaining = JSON.parse(JSON.stringify(purchasedTiles));
      // pre-flight for full boxes
      Object.keys(purchasedTiles).forEach(tileId1 => {
        if (purchasedTiles[tileId1] > 0 ) {
          hushShippingInfo.boxesRecommended[tileId1] = Math.floor(purchasedTiles[tileId1] / this.hushShippingData[tileId1].capacity);
          tilesRemaining[tileId1] = purchasedTiles[tileId1] % this.hushShippingData[tileId1].capacity;
        }
      });
      // console.log('tilesRemaining after Preflight');
      // console.log(tilesRemaining);
      // console.log('hushShippingInfo after Preflight');
      // console.log(hushShippingInfo);

      // check remaining tiles recursively
      function checkRemainingTiles() {
        const tileSizesLeft = [];
        // get remaining tile sizes
        Object.keys(tilesRemaining).forEach(tileId2 => {
          if (tilesRemaining[tileId2] > 0 ) {
            tileSizesLeft.push(tileId2);
          }
        });
        console.log('tileSizesLeft:', tileSizesLeft);
        // Order of Operations
        // if only 1x or 2x
        const tileMix = getTileMix(tileSizesLeft);
        console.log('tileMix:', tileMix);
        switch (tileMix) {
          case '1xOnly':
            fill1xBoxes(tileSizesLeft, tilesRemaining, this.shippingData);
            break;
          case '2xOnly':
            console.log('2x');
            // 2x2 boxes first get filled then triangle
            break;
          case 'mixed':
            // NOTE: just learned that mixed boxes aren't going to be shipped.
            console.log('mixed');
            // fill 2x boxes first
            // 2x2 => 2x2t => 1x2 => 1x1
            // fill 1x boxes last
            // use
            break;
        }


      }

      let tilesRemainingStop = 0; // TODO: this is just a stop for the recursion.  Remove when ready.
      Object.keys(tilesRemaining).forEach(tileId => {
        if (tilesRemaining[tileId] > 0 && tilesRemainingStop < 2) { checkRemainingTiles.apply(this); tilesRemainingStop++; }
      })

      // TODO: RESTORE THIS WHEN RECURSION IS READY
      // Object.keys(tilesRemaining).forEach(tileId => {
      //   if (tilesRemaining[tileId] > 0) { checkRemainingTiles(tilesRemaining); }
      // })

    }

    function getTileMix(tileSizesLeft) {
      const txoxtwo = (tileSizesLeft.includes('2-2-2') || tileSizesLeft.includes('2-2-2-t'));
      const onexone = (tileSizesLeft.includes('1-1-2') || tileSizesLeft.includes('1-2-2') || tileSizesLeft.includes('1-3-2') || tileSizesLeft.includes('1-4-2'));
      switch (true) {
        case (!onexone && txoxtwo):
          return '2xOnly';
        case (onexone && !txoxtwo):
          return '1xOnly';
        default:
          return 'mixed';
      }
    }

    function fill1xBoxes(tilesMix, tilesRemaining, hushShippingData) {
      console.warn('tilesMix:');
      console.log(tilesMix);
      console.warn('tilesRemaining:');
      console.log(tilesRemaining);

      let newTilesRemaining = tilesRemaining;

      // map through tilesMix to find the needed sizes from largest to smallest
      const neededSizes = [];
      tilesMix.map(tile => {
        neededSizes.push(parseInt(tile.slice(2, 3), 10));
      });
      neededSizes.sort((a, b) => b - a);
      console.log('neededSizes', neededSizes);
      // get the box capacity of largest size
      const largestSizeLeft = `1-${neededSizes[0]}-2`;
      const currentBoxCapacity = (newTilesRemaining[largestSizeLeft]);// * hushShippingData[largestSizeLeft].capacity);
      console.log('currentBoxCapacity', currentBoxCapacity);
      // find out how much space is left
      // loop through other sizes largest to smallest
      switch(tilesMix) {
        case tilesMix.includes('1-4-2'):
            // get linear square feet
            // longest boxes first get filled the shortest boxes
          break;
      }

      return newTilesRemaining;
    }



    function calcTotalWeight() {
      // TODO
      console.log('calc Hush weight');

    }

    calcShippingBoxes.apply(this);
    calcTotalWeight();
    return hushShippingInfo;
  }


}

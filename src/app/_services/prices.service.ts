import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PricesService {
  public hushBlocksPricingData = {
    partsList: {
      '1-1-2': {
        '3-85-110': 2,
        '3-85-111': 3,
        '3-85-116': 1
      },
      '1-2-2': {
        '3-85-110': 4,
        '3-85-111': 4,
        '3-85-119': 2
      },
      '1-3-2': {
        '3-85-110': 5,
        '3-85-111': 4,
        '3-85-115': 2
      },
      '1-4-2': {
        '3-85-110': 4,
        '3-85-111': 5,
        '3-85-117': 2
      },
      '2-2-2': {
        '3-85-110': 4,
        '3-85-111': 4,
        '3-85-112': 2
      },
      '2-2-2-t': {
        '3-85-110': 4,
        '3-85-111': 5,
        '3-85-118': 1
      }
    },
    servicePrices: {
      '1-1-2': 18.13,
      '1-2-2': 31.42,
      '1-3-2': 61.40,
      '1-4-2': 83.45,
      '2-2-2': 82.42,
      '2-2-2-t': 35.06
    },
    hardwarePrices: {
      '3-85-110': 0.25,
      '3-85-111': 1.89,
      '3-85-112': 5.53,
      '3-85-116': 1.22,
      '3-85-115': 3.16,
      '3-85-117': 4.07,
      '3-85-118': 5.53,
      '3-85-119': 5.53
    }
  };

  public tetriaPricingData = {
    partsList: {
      '3-15-2415': 0.73
    },
    servicePrices: {
      flatTilePrice: 86.57,
      tetriaTilePrice: 86.57
    },
    hardwarePrices: {},
  }

  public clarioPricingData = {
    partsList: {
      '3-15-2415': 0.73
    },
    servicePrices: {
      flatTilePrice: 25.01,
      clario24Price: 52.41,
      clario48Price: 104.79
    },
    hardwarePrices: {},
  }

  public veloPricingData = {
    partsList: {},
    servicePrices: {
      variaSheetCost: 518.32,
      variaDiffusionAdditionalCost: 107.10,
      feltCost: 81.16,
      variaCost: 82.73
    },
    hardwarePrices: {
      variaConnectionKitCost: 7.20,
      feltConnectionKitCost: 0.49,
      drillBitCost: 11.30,
      variaPunchToolCost: 18.38,
      C1cableKitCost: 13.10,
      C2cableKitCost: 14.83
    },
  }

  public clarioCloudPricingData = {
    partsList: {},
    servicePrices: {
      sTile: 353.13,
      ccTile: 359.01
    },
    hardwarePrices: {
      sTile: 52.39,
      ccTile: 46.51
    },
    productsPrices: {
      sTile: 84.08,
      ccTile: 84.08
    }
  }

  public seeyondPricingData; // this is handled through the getPrices() request in seeyond.service.ts

  constructor() {}

}

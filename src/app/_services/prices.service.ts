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
      '1-1-2': 18.58,
      '1-2-2': 32.21,
      '1-3-2': 62.94,
      '1-4-2': 85.54,
      '2-2-2': 84.48,
      '2-2-2-t': 35.94,
    },
    hardwarePrices: {
      '3-85-110': 0.26,
      '3-85-111': 1.94,
      '3-85-112': 5.67,
      '3-85-116': 1.25,
      '3-85-115': 3.24,
      '3-85-117': 4.17,
      '3-85-118': 5.67,
      '3-85-119': 5.67,
    }
  };

  public tetriaPricingData = {
    partsList: {
      '3-15-2415': 0.73
    },
    servicePrices: {
      flatTilePrice: 88.73,
      tetriaTilePrice: 88.73,
    },
    hardwarePrices: {},
  }

  public clarioPricingData = {
    partsList: {
      '3-15-2415': 0.73
    },
    servicePrices: {
      flatTilePrice: 25.95,
      clario24Price: 54.03,
      clario48Price: 108.07,
    },
    hardwarePrices: {},
  }

  public veloPricingData = {
    partsList: {},
    servicePrices: {
      variaSheetCost: 531.28,
      variaDiffusionAdditionalCost: 109.78,
      feltCost: 83.19,
      variaCost: 84.80,
    },
    hardwarePrices: {
      variaConnectionKitCost: 7.38,
      feltConnectionKitCost: 0.50,
      drillBitCost: 11.58,
      variaPunchToolCost: 18.84,
      C1cableKitCost: 13.43,
      C2cableKitCost: 15.20,
    },
  }

  public clarioCloudPricingData = {
    partsList: {},
    servicePrices: {
      sTile: 361.96,
      ccTile: 367.99,
    },
    hardwarePrices: {
      sTile: 53.70,
      ccTile: 47.67,
    },
    productsPrices: {
      sTile: 86.18,
      ccTile: 86.18,
    }
  }

  public seeyondPricingData; // this is handled through the getPrices() request in seeyond.service.ts

  constructor() {}

}

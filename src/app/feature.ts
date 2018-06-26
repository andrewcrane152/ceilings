import { AlertService } from './_services/alert.service';
import { MaterialsService } from './_services/materials.service';
import { Injectable, EventEmitter } from '@angular/core';
import { DebugService } from './_services/debug.service';
import * as _ from 'lodash';
import { Location } from '@angular/common';

@Injectable()
export class Feature {
  onBuildGrid = new EventEmitter();
  onBuildVeloGrid = new EventEmitter();
  onApplyAll = new EventEmitter();
  onView3d = new EventEmitter();
  onLoadDesigns = new EventEmitter();

  // attributes saved in DB
  public id: number;
  public uid: number;
  public feature_type: string;
  public design_name: string;
  public project_name: string;
  public specifier: string;
  public width: number;
  public length: number;
  public units = 'inches';
  public material: string;
  public tile_size = 24;
  public tiles: any;
  public design_data_url: any;
  public hardware: any;
  public estimated_amount = 0.00;
  public services_amount = 0.00;
  public front_relief = true; // boolean
  public back_relief = false; // boolean
  public quoted = false; // boolean
  public archived = false; // boolean
  public updated_at: string;
  public quantity = 1;
  public is_quantity_order = false;
  public qtyTilesUsed = 0;
  public qtyTilesReceiving = 0;

  // attributes for the tool
  public tile_type = 'tile';
  public selectedTile = '01';
  public selectedTool: string;
  public showGuide = true;
  public materialHex: string;
  public materialType: string;
  public diffusion: string;
  public discontinuedMaterials: Array<string>;
  public inactiveMaterials: Array<string>;
  public canQuote = true;

  public gridData: any;
  public toolsArray = this.materialsService.toolsArray;
  public tilesArray = this.materialsService.tilesArray;
  public materials = this.materialsService.materials;
  public materialObj: any;
  public seeyond_features = this.materialsService.seeyond_features;

  constructor(
    public materialsService: MaterialsService,
    public debug: DebugService,
    public location: Location,
    public alert: AlertService
  ) {}

  setDesign(design: any) {
    this.id = design.id;
    this.uid = design.uid;
    this.feature_type = design.feature_type;
    this.design_name = design.design_name;
    this.project_name = design.project_name;
    this.specifier = design.specifier;
    this.width = design.width;
    this.length = design.length;
    this.units = design.units;
    this.material = design.material;
    this.tile_size = design.tile_size;
    this.design_data_url = design.design_data_url;
    this.tiles = JSON.parse(design.tiles);
    this.hardware = (!!design.hardware) ? JSON.parse(design.hardware) : null;
    this.estimated_amount = design.estimated_amount;
    this.services_amount = design.services_amount;
    this.gridData = JSON.parse(design.grid_data);
    this.front_relief = design.front_relief;
    this.back_relief = design.back_relief;
    this.quoted = design.quoted;
    this.archived = design.archived;
    this.updated_at = design.updated_at;
    this.quantity = design.quantity || 1;

    // after it's been loaded, recalculate the price if the design
    // hasn't been quoted. In the event that the prices have changed.
    if (!this.quoted) {
      this.updateEstimatedAmount();
    }
    this.buildGrid();
    this.getDeprecatedMaterials();
  }

  public reset() {
    this.width = undefined;
    this.length = undefined;
    this.gridData = undefined;
    this.id = undefined;
    this.uid = undefined;
    this.feature_type = undefined;
    this.design_name = undefined;
    this.project_name = undefined;
    this.specifier = undefined;
    this.width = undefined;
    this.length = undefined;
    this.units = 'inches';
    this.material = undefined;
    this.tile_size = 24;
    this.tiles = undefined;
    this.design_data_url = undefined;
    this.hardware = undefined;
    this.estimated_amount = 0.00;
    this.services_amount = 0.00;
    this.front_relief = true; // boolean
    this.back_relief = false; // boolean
    this.quoted = false; // boolean
    this.archived = false; // boolean
    this.updated_at = undefined;
    this.quantity = 1;
  }

  updateEstimatedAmount() {
    const tilesArray = this.getTilesPurchasedObj();
    switch (this.feature_type) {
      case 'tetria':
        this.getTetriaEstimate(tilesArray);
        break;
      case 'hush':
        this.getHushEstimate(tilesArray);
        break;
      case 'clario':
        this.getClarioEstimate(tilesArray);
        break;
      case 'velo':
        this.getVeloEstimate(tilesArray);
        break;
    }
    return this.estimated_amount;
  }

  getDeprecatedMaterials() {
    if (this.feature_type === 'seeyond') { return; } // handled by seeyondFeature.loadSeeyondDesign()
    const inactiveMaterials = [];
    const discontinuedMaterials = [];
    const materialsObj = this.materials;
    for (const mat in materialsObj) {
      if (materialsObj.hasOwnProperty(mat)) {
        for (const matType in materialsObj[mat]) {
          if (materialsObj[mat].hasOwnProperty(matType)) {
            for (const matTypeColor in materialsObj[mat][matType]) {
              if (materialsObj[mat][matType].hasOwnProperty(matTypeColor)) {
                if (materialsObj[mat][matType][matTypeColor].status === 'inactive') {
                  inactiveMaterials.push(materialsObj[mat][matType][matTypeColor].name_str)
                }
                if (materialsObj[mat][matType][matTypeColor].status === 'discontinued') {
                  discontinuedMaterials.push(materialsObj[mat][matType][matTypeColor].name_str || materialsObj[mat][matType][matTypeColor].material)
                }
              }
            }
          }
        }
      }
    }
    this.discontinuedMaterials = discontinuedMaterials;
    this.inactiveMaterials = inactiveMaterials;
    this.checkMaterialsUsed();
  }

  checkMaterialsUsed() {
    if (this.feature_type === 'seeyond') { return; }
    let alertStr;
    const gridData = this.gridData;
    const matchedInactiveMaterials = [];
    const matchedDiscontinuedMaterials = [];

    if (this.inactiveMaterials.length > 0) {
      // loop through gridData looking for inactive materials
      this.inactiveMaterials.map(material => {
        const mat = material.toString().toLowerCase().replace(/ /g, '_');
        gridData.map(gridSection => {
          let gridSectionArr = [];
          if (!Array.isArray(gridSection)) {
            gridSectionArr = Object.keys(gridSection).map(key => {
              return gridSection[key];
            })
          } else { gridSectionArr = gridSection; }
          gridSectionArr.map(tile => {
            if (tile.material === mat) {
              if (matchedInactiveMaterials.indexOf(material) < 0) {
                matchedInactiveMaterials.push(material);
              }
            }
          })
        })
      })
      // alert users if inactive materials are being used
      if (matchedInactiveMaterials.length === 1) {
        this.alert.error(`${matchedInactiveMaterials[0]} is being discontinued and is only available while supplies last.`)
      } else if (matchedInactiveMaterials.length > 1) {
        alertStr = matchedInactiveMaterials.toString();
        alertStr = alertStr.replace(/,/g, ' and ');
        this.alert.error(`${alertStr} are being discontinued and are only available while supplies last.`)
      }
    }
    if (this.discontinuedMaterials.length > 0) {
      // loop through gridData looking for discontinued materials
      this.discontinuedMaterials.map(material => {
        const mat = material.toString().toLowerCase().replace(/ /g, '_');
        gridData.map(gridSection => {
          let gridSectionArr = [];
          if (!Array.isArray(gridSection)) {
            gridSectionArr = Object.keys(gridSection).map(key => {
              return gridSection[key];
            })
          } else { gridSectionArr = gridSection; }
          gridSectionArr.map(tile => {
            if (tile.material === mat) {
              if (matchedDiscontinuedMaterials.indexOf(material) < 0) {
                matchedDiscontinuedMaterials.push(material);
              }
            }
          })
        })
      })
      // if discontinued materials are found disable quote and alert user
      if (matchedDiscontinuedMaterials.length > 0) {
        this.canQuote = false;
        if (matchedDiscontinuedMaterials.length === 1) {
          this.alert.error(`The ${matchedDiscontinuedMaterials[0]} material has been discontinued. Select a new color to proceed.`)
        } else if (matchedDiscontinuedMaterials.length > 1) {
          alertStr = matchedDiscontinuedMaterials.toString();
          alertStr = alertStr.replace(/,/g, ' and ');
          this.alert.error(`The ${alertStr} materials have been discontinued. Select a new color to proceed.`)
        }
      }
    } else { // canQuote if no discontinuedMaterials found
      this.canQuote = true;
    }
  }

  getTetriaEstimate(tilesArray) {
    const flatTilePrice = 61.80;
    const tetriaTilePrice = 82.40;
    let flatTileCount = 0;
    let tetriaTileCount = 0;
    const tetriaTiles = ['01', '02', '03'];

    for (const tile in tilesArray) {
      if (tilesArray.hasOwnProperty(tile)) {
        const currentTile = tilesArray[tile];
        if (tetriaTiles.indexOf(currentTile.tile) !== -1) {
          // add the purchased amount to the tetria tile count
          tetriaTileCount += currentTile.purchased;
        }else if (currentTile.tile === '00') {
          // add the purchased amount to the flat tile count
          flatTileCount += currentTile.purchased;
        }
      }
    }
    this.services_amount = (tetriaTileCount * tetriaTilePrice) + (flatTileCount * flatTilePrice);
    this.estimated_amount = this.services_amount;
  }

  getHushEstimate(tilesArray) {
    let hushTileCount = 0;
    for (const hushTile in tilesArray) {
      if (tilesArray.hasOwnProperty(hushTile)) {
        const hushCurrentTile = tilesArray[hushTile];
        hushTileCount += hushCurrentTile.purchased;
      }
    }

    const hardware110 = 0.23;
    const hardware111 = 1.80;
    const hardware112 = 3.08;
    const total110 = hardware110 * hushTileCount * 5;
    const total111 = hardware111 * hushTileCount * 4;
    const total112 = hardware112 * hushTileCount * 2;

    this.hardware = {
      '3-85-110': hushTileCount * 5,
      '3-85-111': hushTileCount * 4,
      '3-85-112': hushTileCount * 2
    }

    const allHardwareCost = total110 + total111 + total112;
    this.services_amount = (hushTileCount * 65.49);
    this.estimated_amount = this.services_amount + allHardwareCost;
  }

  getClarioEstimate(tilesArray) {
    let products_amount = 0.00;
    let clario24TileCount = 0;
    let clario48TileCount = 0;
    let clario00TileCount = 0;
    let sheetsNeeded = 0;
    let sheetCost = 0.00;
    for (const tile in tilesArray) {
      if (tilesArray.hasOwnProperty(tile)) {
        const currentTile = tilesArray[tile];
        if (currentTile.tile === '24') {
          // 24x24 prices
          clario24TileCount += currentTile.purchased;
          // what part_id is the material?
          // how many sheets do we need? sheetsNeeded = (currentTile.purchased / 4);
          sheetsNeeded = currentTile.purchased / 4;
        }else if (currentTile.tile === '48') {
          // 24x48 prices
          clario48TileCount += currentTile.purchased;
          sheetsNeeded = currentTile.purchased / 2;
        } else if (currentTile.tile === '00') {
          // 00 flat tiles
          clario00TileCount += currentTile.purchased;
          sheetsNeeded = currentTile.purchased / 4;
        }

        // calculate the sheet cost and add it to the products_amount
        sheetCost = sheetsNeeded * 48.93;
        products_amount += sheetCost;
      }
    }

    // SERVICES AMOUNT
    const clarioFlatServiceCost = 23.81;
    const clario24ServiceCost = 49.88;
    const clario48ServiceCost = 99.75;
    const clario24Total = clario24ServiceCost * clario24TileCount;
    const clario48Total = clario48ServiceCost * clario48TileCount;
    const clarioFlatTotal = clario00TileCount * clarioFlatServiceCost;

    this.services_amount = clarioFlatTotal + clario24Total + clario48Total;
    // END SERVICES AMOUNT

    this.estimated_amount = this.services_amount + products_amount;
  }

  getVeloEstimate(tilesArray) {
    // PRODUCTS AMOUNT
    let veloFeltTiles = 0;
    let veloVariaTiles = 0;
    let veloVariaDiffusionTiles = 0;
    let products_amount: number;
    let variaSheetsNeeded: number;
    let variaDiffusionSheetsNeeded: number;
    const variaSheetCost = 488.14;
    const variaDiffusionSheetCost: number = variaSheetCost + 100.00;

    for (const tile in tilesArray) {
      if (tilesArray.hasOwnProperty(tile)) {
        const currentTile = tilesArray[tile];
        if (currentTile.materialType === 'felt') {
          veloFeltTiles += currentTile.purchased;
        } else {
          if (typeof currentTile.diffusion === 'undefined') {
            veloVariaTiles += currentTile.purchased;
          } else {
            veloVariaDiffusionTiles += currentTile.purchased;
          }
        }
      }
    }

    variaSheetsNeeded = Math.ceil(veloVariaTiles / 8);
    variaDiffusionSheetsNeeded = Math.ceil(veloVariaDiffusionTiles / 8);
    this.debug.log('feature', `varia sheets needed, ${variaSheetsNeeded}`);
    this.debug.log('feature', `varia diffusion sheets needed ${variaDiffusionSheetsNeeded}`);
    products_amount = (variaSheetsNeeded * variaSheetCost) + (variaDiffusionSheetsNeeded * variaDiffusionSheetCost);

    // SERVICES AMOUNT
    const veloFeltServiceCost = 77.25;
    const veloVariaServiceCost = 78.75;
    this.services_amount = (veloFeltTiles * veloFeltServiceCost) + ((veloVariaTiles + veloVariaDiffusionTiles) * veloVariaServiceCost);
    // this.debug.logfeature', ('=== SERVICES AMOUNT ===');
    // this.debug.logfeature', (this.services_amount);

    // HARDWARE AMOUNT
    let hardware_amount: number;
    let hardwareCost = 0.00;
    let cableCount: number;
    let cableCost = 0.00;
    const cableKitCost = 12.46;
    const variaConnectionKitCost = 6.85;
    const feltConnectionKitCost = .46;
    const drillBitCost = 10.23;
    const variaPunchToolCost = 17.49;
    let variaConnectionKitsNeeded = 0;
    let feltConnectionKitsNeeded = 0;
    let cablesNeeded = 0;
    let variaPunchToolNeeded = false;

    // CABLE COST CALCULATION
    // we need to calculate the cable hardware for each individual island
    // and then add them together at the end for a total amount.
    const islands = this.getIslands();
    this.debug.log('feature', `${islands} islands`);
    for (const i in islands) {
      if (islands.hasOwnProperty(i)) {
        const island = islands[i];
        const tilesInIsland = island.length;
        const islandConnections = this.getVeloConnections(island);
        const sharedEdges = islandConnections['totalConnections'];

        // ratio = (number_of_shared_edges / number_of_tiles)
        // if ratio < 1 then cableCount = Math.ceil(cables * .75)
        // if ratio > 1 then cableCount = Math.ceil(cables * .5)
        // this is the total number of purchased tiles
        // this is the number of tiles in the design
        const ratio = (sharedEdges) / (tilesInIsland);
        const factor = ratio < 1 ? .75 : .5;
        cableCount = Math.ceil(tilesInIsland * factor);

        // If shared edges is 1 less than total tiles, set cableCount to sharedEdges
        if (sharedEdges + 1 === tilesInIsland) {
          cableCount = sharedEdges;
        }
        // Minimum of 2 cables.
        cableCount = cableCount < 2 ? 2 : cableCount;
        cableCost += cableCount * cableKitCost;

        // Add the cables for this island to the total cables needed
        cablesNeeded += cableCount;

        // Calculate the hardware cost for connections and add to the hardware cost
        hardwareCost += (islandConnections['variaToVaria'] * variaConnectionKitCost) + ((islandConnections['feltToFelt'] + islandConnections['variaToFelt']) * feltConnectionKitCost);

        // Add the connections to the running total
        variaConnectionKitsNeeded += islandConnections['variaToVaria'];
        feltConnectionKitsNeeded += islandConnections['variaToFelt'] + islandConnections['feltToFelt'];

        this.debug.log('feature', `shared edges: ${sharedEdges}`);
        this.debug.log('feature', `total tiles: ${tilesInIsland}`);
        this.debug.log('feature', `connections ${islandConnections}`);
        this.debug.log('feature', `ratio: ${ratio}`);
        this.debug.log('feature', `factor: ${factor}`);
        this.debug.log('feature', `cables: ${cableCount}`);
      }
    }
    // END CABLE COST CALCULATION

    this.debug.log('feature', `Total Cable cost: ${cableCost}`);
    this.debug.log('feature', `Total hardware cost: ${hardwareCost}`);
    this.debug.log('feature', `Varia Kits needed: ${variaConnectionKitsNeeded}`);
    this.debug.log('feature', `Felt Kits needed: ${feltConnectionKitsNeeded}`);
    this.debug.log('feature', `Total cables needed: ${cablesNeeded}`);
    hardware_amount = cableCost + hardwareCost + drillBitCost;
    if (this.veloHasVaria()) {
      hardware_amount += variaPunchToolCost;
      variaPunchToolNeeded = true;
    }

    this.estimated_amount = this.services_amount + products_amount + hardware_amount;

    // save the hardware amounts
    this.hardware = {
      '3-15-8812': 1, // drillBit
      '3-15-1677-K': cablesNeeded,
      '3-15-8899-K': variaConnectionKitsNeeded,
      '3-85-105-K': feltConnectionKitsNeeded,
      '3-15-8813': variaPunchToolNeeded ? 1 : 0
    }

    this.debug.log('feature', '=====feature HARDWARE =====');
    this.debug.log('feature', `${this.hardware}`);
    this.debug.log('feature', '=====feature END HARDWARE =====');
  }

  updateSelectedTile(tile: string) {
    this.selectedTile = tile;

    // if a tool is selected then remove it
    if (this.selectedTool !== '') {
      this.selectedTool = '';
    }
  }

  updateSelectedMaterial(material: string, hex: string = '', materialType: string = 'felt') {
    this.material = material;

    // set the hex value as well if not blank
    if (hex !== '') {
      this.materialHex = hex;
    }

    // set the materialType as well
    this.materialType = materialType;

    // if a tool is selected then remove it
    if (this.selectedTool !== '') {
      this.selectedTool = '';
    }

    // handle no color for varia
    if (material === 'no_color' && materialType === 'varia') {
      // forces a diffusion to be selected if 'no_color' is chosen
      if (!this.diffusion) { this.updateSelectedDiffusion('avalanche_d01'); }
    }
  }

  updateSelectedTool(tool: string) {
    const oldTool = this.selectedTool;
    const newTool = tool;
    // if the tool they clicked on is already selected,
    // deselect it so they have a way to add tiles again.
    if (this.selectedTool === tool) {
      this.selectedTool = '';
    } else {
      this.selectedTool = tool;
    }
  }

  updateSelectedDiffusion(diffusion: string) {
    if (this.materialType === 'felt') {
      // a diffusion requires varia to be selected
      this.updateSelectedMaterial('no_color', '#ffffff', 'varia');
    }
    const hasColor = (this.material !== 'no_color') ? true : false;
    // if the diffusion they clicked on is already selected,
    // deselect it so they have a way to remove the diffusion
    // unless 'no_color' is selected
    if (this.diffusion === diffusion && hasColor) {
      this.diffusion = '';
    } else {
      this.diffusion = diffusion;
    }
  }

  buildGrid() {
    // If the feature type is velo build that grid
    if (this.feature_type === 'velo') {
      this.onBuildVeloGrid.emit();
    } else {
      // emit an event to build a new grid
      this.onBuildGrid.emit();
    }
  }

  clearAll() {
    this.gridData = undefined;
    this.estimated_amount = 0.00;
    this.buildGrid();
  }

  applyAll() {
    this.updateEstimatedAmount();
    this.onApplyAll.emit();
  }

  toggleGuide() {
    this.showGuide = !this.showGuide;
    if (this.feature_type === 'velo') {
      this.onBuildVeloGrid.emit();
    }
  }

  view3d() {
    this.onView3d.emit();
  }

  loadDesigns() {
    this.onLoadDesigns.emit();
  }

  public getRows() {
    let rows: number;

    // velo has a static grid
    if (this.feature_type === 'velo') {
      rows = 500;
    }else if (this.units === 'inches') {
      rows = Math.ceil(this.length / 12 / 2);
    } else {
      rows = Math.ceil(this.convertCMtoIN(this.length) / 12 / 2);
    }
    return rows;
  }

  public getColumns() {
    let columns: number;

    // velo has a static grid
    if (this.feature_type === 'velo') {
      columns = 820;
    }else if (this.units === 'inches') {
      columns = Math.ceil(this.width / 12 / 2);
    } else {
      columns = Math.ceil(this.convertCMtoIN(this.width) / 12 / 2);
    }
    return columns;
  }

  public getFeatureTypeInteger() {
    let type: number;
    switch (this.feature_type) {
      case 'tetria':
        type = 100;
        break;

      case 'clario':
        type = 200;
        break;

      case 'velo':
        type = 300;
        break;

      case 'hush':
        type = 400;
        break;

      // default to tetria
      default:
        type = 100;
        break;
    }

    return type;
  }

  public getTileType(grammar: string = 'singular') {
    let type = '';
    if (grammar === 'plural') {
      type = this.feature_type === 'clario' ? 'baffles' : 'tiles';
    } else {
      type = this.feature_type === 'clario' ? 'baffle' : 'tile';
    }
    return type;
  }

  public getPackageQty(tile: string) {
    let qty: number;
    if (this.feature_type === 'hush') { return 1; }
    switch (tile) {
      case '00':
      case '01':
      case '02':
      case '03':
      case '24':
        qty = 4;
        break;

      case '48':
        qty = 2;
        break;

      case 'concave':
      case 'convex':
      case 'velo':
        qty = 8;
        break;

      default:
        qty = 4;
        break;
    }
    return qty;
  }

  public getTilesUsed() {
    if (this.gridData) {
      let totalTiles = 0;
      for (let i = this.gridData.length - 1; i >= 0; i--) {
        for (let j = this.gridData[i].length - 1; j >= 0; j--) {
          if (this.gridData[i][j].tile) {
            totalTiles++;
          }
        }
      }
      return totalTiles;
    } else {
      return 0;
    }
  }

  public getTilesPurchasedObj() {
    let tiles: {};
    if (this.is_quantity_order) { return; }
    if (this.feature_type === 'velo') {
      const pkgQty: number = this.getPackageQty('velo');
      const gridTiles = this.veloTiles();
      let purchasedTiles: {};

      for (const tile in gridTiles) {
        if (gridTiles.hasOwnProperty(tile)) {
          const materialType = gridTiles[tile].materialType;
          const material = gridTiles[tile].material;
          const diffusion = gridTiles[tile].diffusion || '';
          const key = (!diffusion) ? `${materialType}-${material}` : `${materialType}-${material}-${diffusion}`;
          if (purchasedTiles === undefined) { purchasedTiles = {}; }
          if (!!purchasedTiles[key]) {
            purchasedTiles[key][gridTiles[tile].tile] += 1;
            purchasedTiles[key].purchased = pkgQty * Math.ceil((purchasedTiles[key].concave + purchasedTiles[key].convex) / pkgQty);
          } else {
            purchasedTiles[key] = {
              'purchased': pkgQty,
              'image': gridTiles[tile].materialType === 'felt' ? '/assets/images/materials/felt/merino/' + gridTiles[tile].material + '.png' : '/assets/images/tiles/00/' + gridTiles[tile].material + '.png',
              'hex': gridTiles[tile].materialType === 'varia' ? gridTiles[tile].hex : '',
              'convex': gridTiles[tile].tile === 'convex' ? 1 : 0,
              'concave': gridTiles[tile].tile === 'concave' ? 1 : 0,
              'material': gridTiles[tile].material,
              'materialType': gridTiles[tile].materialType,
              'tile': gridTiles[tile].tile,
              'diffusion': gridTiles[tile].diffusion
            }
          }
        }
      }
      tiles = purchasedTiles;
    } else {
      // Determine the number of unique tiles (color and tile)
      let pkgQty: number;
      let tileType = this.getTileType('plural');
      if (this.gridData) {
        for (let i = this.gridData.length - 1; i >= 0; i--) {
          for (let j = this.gridData[i].length - 1; j >= 0; j--) {
            if (this.gridData[i][j].tile) {
              const key = this.gridData[i][j]['material'] + '-' + this.gridData[i][j]['tile'];
                pkgQty = this.getPackageQty(this.gridData[i][j]['tile']);
              if (tiles === undefined) { tiles = {}; }
              if (!!tiles[key]) {
                tiles[key].used += 1;
                tiles[key].purchased = pkgQty * Math.ceil(tiles[key].used / pkgQty);
              } else {
                if (this.gridData[i][j]['tile'] === '00') {
                  tileType = 'tiles';
                } else {
                  tileType = this.getTileType('plural');
                }
                tiles[key] = {
                  'purchased': pkgQty,
                  'image': '/assets/images/' + tileType + '/' + this.gridData[i][j]['tile'] + '/' + this.gridData[i][j]['material'] + '.png',
                  'used': 1,
                  'material': this.gridData[i][j]['material'],
                  'tile': this.gridData[i][j]['tile']
                }
              }
            }
          }
        }
      }
    }
    this.tiles = tiles;
    return tiles;
  }

  public getPurchasedVeloTiles(materialType: string) {
    const tilesObj = {};
    const veloTiles = this.getTilesPurchasedObj();
    for (const tile in veloTiles) {
      if (veloTiles[tile].materialType === materialType) {
        tilesObj[tile] = veloTiles[tile];
      }
    }
    return tilesObj;
  }

  public getUserInputs() {
    let tiles;
    switch (this.feature_type) {
      case 'velo': tiles = this.veloTiles(); break;
      case 'hush': tiles = this.hushTiles(); break;
      default: tiles = this.gridData; break;
    }

    return {
      'UserInputs': {
        'Type': this.getFeatureTypeInteger(),
        'NumX': this.getColumns(),
        'NumY': this.getRows(),
        'Tiles': tiles
      }
    }
  }

  public convertCMtoIN(cm: number) {
    // 1 cm = 0.393701 in
    const conversion = 0.393701;
    const inches = cm * conversion;
    return Math.round(inches);
  }

  public convertINtoCM(inches: number) {
    // 1 cm = 0.393701 in
    const conversion = 2.54;
    const cm = inches * conversion;
    return Math.round(cm);
  }

  public veloTiles() {
    const veloTiles = [];
    for ( const tile in this.gridData) {
      if (this.gridData[tile].texture !== '') {
        veloTiles.push(this.gridData[tile]);
      }
    }
    return veloTiles;
  }

  public hushTiles() {
    const hushTiles = [];
    for (let i = 0; i < this.gridData.length; i++) {
      for (let j = 0; j < this.gridData[i].length; j++) {
        if (this.gridData[i][j].texture !== '') {
          hushTiles.push(this.gridData[i][j]);
        }
      }
    }
    return hushTiles;
  }

  public findVeloTileAt(x, y) {
    for (const el in this.gridData) {
      if (this.gridData[el].x === x && this.gridData[el].y === y) {
        return this.gridData[el];
      }
    }
  }

  public getVeloConnections(island: any): any [] {
    const veloTiles = [];
    let veloConnections: any;
    let variaToVariaCount = 0;
    let variaToFeltCount = 0;
    let feltToFeltCount = 0;
    const matches: any = [];

    for (const i in island) {
      if (island.hasOwnProperty(i)) {
        veloTiles.push(this.gridData[island[i]]);
      }
    }
    // loop through the tiles and count
    for (const i in veloTiles) {
      if (veloTiles.hasOwnProperty(i)) {
        const thisMaterialType = veloTiles[i]['materialType'];
        for (const j in veloTiles[i].neighbors) {
          if (veloTiles[i].neighbors.hasOwnProperty(j)) {
            const neighbor = this.findVeloTileAt(veloTiles[i].neighbors[j][0], veloTiles[i].neighbors[j][1]);
            if (neighbor) {
              // determine if this seam has already been matched and therefore counted.
              const thisIndex = veloTiles[i].index;
              const neighborIndex = neighbor.index;
              const a = Math.min(thisIndex, neighborIndex);
              const b = Math.max(thisIndex, neighborIndex);
              const mappedIndex = (a + b) * (a + b + 1) / 2 + a;
              if (typeof neighbor.materialType !== 'undefined' && !matches[mappedIndex]) {
                // felt to felt seams
                if (thisMaterialType === 'felt' && neighbor.materialType === 'felt') {
                  feltToFeltCount++;
                }
                // felt to varia seams or varia to felt seams
                if (thisMaterialType === 'felt' && neighbor.materialType === 'varia') {
                  variaToFeltCount++;
                }
                if (thisMaterialType === 'varia' && neighbor.materialType === 'felt') {
                  variaToFeltCount++;
                }
                // varia to varia seams
                if (thisMaterialType === 'varia' && neighbor.materialType === 'varia') {
                  variaToVariaCount++;
                }

                // add this mappedIndex to matches array
                matches[mappedIndex] = true;
              }
            }
          }
        }
      }
    }

    veloConnections = {
      'variaToVaria': variaToVariaCount,
      'variaToFelt': variaToFeltCount,
      'feltToFelt': feltToFeltCount,
      'totalConnections': variaToVariaCount + variaToFeltCount + feltToFeltCount
    };
    return veloConnections;
  }

  public getIslands() {
    const islands: any = [];
    let indices = this.gridData.map(e => e.index);

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      const island = this._getIsland(+index);

      if (island.length <= 0) { continue };

      indices = _.difference(indices, island);
      islands.push(island);
    }
    return islands;
  }

  private _getIsland(index: number, members: any = []): any [] {
    const tileObject = this.gridData[index];
    if (tileObject.texture === '') {
      return members;
    }

    if (!members.includes(index)) {
      members.push(index);
      for (const neighborIndex in tileObject.neighbors) {
        if (tileObject.neighbors.hasOwnProperty(neighborIndex)) {
          const neighbor = tileObject.neighbors[neighborIndex];
          const neighborTile = this.findVeloTileAt(neighbor[0], neighbor[1]);
          if (neighborTile) {
            const island = this._getIsland(neighborTile.index, members);
            for (const tile in island) {
              if (!members.includes(island[tile])) {
                members.push(island[tile]);
              }
            }
          }
        }
      }
    }

    return members;
  }

  public veloHasVaria() {
    let hasVaria = false;
    const veloTiles = this.veloTiles();
    for (const i in veloTiles) {
      if (!hasVaria && veloTiles[i].materialType === 'varia') {
        hasVaria = true;
      }
    }
    return hasVaria;
  }

  public veloHasFelt() {
    let hasFelt = false;
    const veloTiles = this.veloTiles();
    for (const i in veloTiles) {
      if (!hasFelt && veloTiles[i].materialType === 'felt') {
        hasFelt = true;
      }
    }
    return hasFelt;
  }

  public veloWidth() {
    const veloTiles = this.veloTiles();
    let calculatedWidth = 0;
    for (const i in veloTiles) {
      if (veloTiles.hasOwnProperty(i)) {
        // we need to determine if the tile actually adds width or not...
        calculatedWidth += veloTiles[i].width;
      }
    }

    return calculatedWidth;
  }

  public veloLength() {
    const veloTiles = this.veloTiles();
    let calculatedHeight = 0;
    for (const i in veloTiles) {
      if (veloTiles.hasOwnProperty(i)) {
        // we need to determine if the tile actually adds height or not...
        calculatedHeight += veloTiles[i].height;
      }
    }

    return calculatedHeight;
  }

  public packageInformation() {
    let info = '';
    if (this.feature_type === 'tetria') {
      info = 'Tiles are sold in quanties of 4.';
    }

    if (this.feature_type === 'clario' && this.tile_size === 24) {
      info = 'Baffles are sold in quantities of 4.';
    }

    if (this.feature_type === 'clario' && this.tile_size === 48) {
      info = '24x24 baffles are sold in qty of 4, and 24x48 baffles are sold in qty of 2.';
    }

    if (this.feature_type === 'velo') {
      info = 'Velo tiles are sold in quanties of 8.';
    }

    return info;
  }

  public updateGridUnits(units: string) {
    if ( this.feature_type === 'velo' ) {
      if (units === 'centimeters' && this.units !== units ) {
        // convert measurements to cm
        this.width = 976;
        this.length = 610;
      }else if (units === 'inches' && this.units !== units) {
        // convert measurement to inches
        this.width = 384;
        this.length = 240;
      }
    }
    // update the units.
    this.units = units;
  }

  public setFeatureType(str: string) {
    if (str.indexOf('hush') > -1) { str = 'hush'; }
    this.feature_type = str;
    return str;
  }

  public getMaterialInfo(matFamily: string, matType: string, material: string) {
    const materialObject = this.materials[matFamily][matType][material];
    this.materialObj = materialObject;
    return materialObject;
  }

  public getFeatureMaterials() {
    const featureType = this.feature_type;
    let requiredMaterials: any;
    switch (featureType) {
      case 'hush': requiredMaterials = this.materials.felt.sola; break;
      case 'seeyond': requiredMaterials = this.materials.felt.sola; break;
      case 'tetria': requiredMaterials = this.materials.felt.merino; break;
      case 'clario': requiredMaterials = this.materials.felt.sola; break;
      case 'velo':
        requiredMaterials = {felt: undefined, varia: undefined};
        requiredMaterials.felt = this.materials.felt.merino;
        this.materials.varia.color = this.addNoColorToVariaObj();
        requiredMaterials.varia = this.materials.varia;
      break;
    }
    return requiredMaterials;
  }

  addNoColorToVariaObj() {
    // object to add
    const variaWithoutColor = { material: 'no_color', hex: '#ffffff', status: 'active', availableUntil: '', partId: null };
    // turn it into an array to enforce object order
    const variaArr = Object.keys(this.materials.varia.color).map(key => this.materials.varia.color[key]);
    // add object the end of the array
    variaArr.push(variaWithoutColor);
    // turn the array back into an object
    const newVariaObj = variaArr.reduce(function(acc, cur, i) {
      acc[i] = cur;
      return acc;
    }, {});
    // return the new object with 'no_color' added to the end of the array
    return newVariaObj;
  }
}

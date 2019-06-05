import { DebugService } from './debug.service';
import { Feature } from 'app/_features/feature';
import { MaterialsService } from 'app/_services/materials.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Options } from 'selenium-webdriver/safari';

@Injectable()
export class ClarioGridsService {
  gridSizes: any;
  selectedTileSize: any = undefined;
  onTileSizeChange = new EventEmitter();
  tileSizeOptions = [];
  tile_size_type = 'standard';
  tile_image_size: string;

  constructor(public materials: MaterialsService, public feature: Feature, public debug: DebugService) {
    this.gridSizes = Object.keys(this.materials.clario_grids);
  }

  gridSizeSelected(selection) {
    if (!!selection) {
      this.debug.log('clario-grid', `grid size selected: ${selection}`);
      this.tileSizeOptions = []; // clear the array when a new selection is made
      this.feature.grid_type = selection;
      const gridOptionsArr = Object.keys(this.materials.clario_grids[selection]);
      gridOptionsArr.map(key => {
        this.tileSizeOptions.push(this.materials.clario_grids[selection][key]);
      });
      if (this.feature.is_quantity_order) {
        this.setTileSizeOptions(gridOptionsArr);
      }
    }
  }

  setTileSizeOptions(gridOptionsArr) {
    const selectedGrid = this.materials.clario_grids[this.feature.grid_type];
    const sizeOptionsArr = [];
    const gridTypes = []; // ['standard', 'metric', 'german']
    gridOptionsArr.map(option => {
      if (gridTypes.indexOf(selectedGrid[option].tile_size_type) === -1) {
        gridTypes.push(selectedGrid[option].tile_size_type);
      }
    });
    const tileSizeOptions = [];
    gridTypes.map(type => {
      let selectName = '';
      gridOptionsArr.map(size => {
        const optionObj = selectedGrid[size];
        if (optionObj.tile_size_type === type) {
          if (selectName.length < 1) {
            selectName = optionObj.name;
          } else {
            tileSizeOptions.push({
              tile_size: optionObj.tile_size,
              tile_size_type: type,
              name: `${selectName} and ${optionObj.name}`,
              units: optionObj.units,
              '24': selectName,
              '48': optionObj.name
            });
            selectName = '';
          }
        }
      });
    });
    this.tileSizeOptions = tileSizeOptions;
  }

  tileSizeSelected(size) {
    this.debug.log('clario-grid', `size selected: ${size}`);
    this.onTileSizeChange.emit();
    if (size === undefined) {
      this.selectedTileSize = size;
      return;
    }
    this.selectedTileSize = this.tileSizeOptions.filter(option => option.name === size)[0];
    const tileSizes = Object.keys(this.materials.tilesArray.clario).map(key => this.materials.tilesArray.clario[key]);
    const tileToSelect = tileSizes.find(x => x.tile === this.selectedTileSize.tile_size);
    this.feature.updateSelectedTile(tileToSelect);
    this.feature.tile_size = this.selectedTileSize.tile_size;
    this.tile_size_type = this.feature.clairoTileSizeType = this.selectedTileSize.tile_size_type;
    this.feature.units = this.selectedTileSize.units;
    this.feature.tile_image_type = this.selectedTileSize.image_type;
    this.debug.log('clario-grid', this.selectedTileSize);
  }

  setGridTileSizeOptions() {
    const clarioTilesArr = Object.keys(this.feature.tilesArray.clario).map(key => this.feature.tilesArray.clario[key]);
    const selectedGridTileOptions = [];
    clarioTilesArr.map(tileOption => {
      if (tileOption.tile_size_type === this.tile_size_type) {
        selectedGridTileOptions.push(tileOption);
      }
    });
    this.debug.log('clario-grid', selectedGridTileOptions);
  }

  loadSelectedTileSize(tile_size) {
    const tileSizes = Object.keys(this.tileSizeOptions).map(key => this.tileSizeOptions[key].name);
    tileSizes.map(size => {
      if (size.includes(tile_size)) {
        this.tileSizeSelected(size);
        return;
      }
    });
  }
}

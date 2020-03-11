import { ProfileFeature } from './../../_features/profile-feature';
import { ClarioGridsService } from './../../_services/clario-grids.service';
import { DebugService } from './../../_services/debug.service';
import { Feature } from './../../_features/feature';
import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { QuantityService } from './../quantity.service';
import { MaterialsService } from 'app/_services/materials.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-quantity',
  templateUrl: './add-quantity.component.html',
  styleUrls: ['./add-quantity.component.scss']
})
export class AddQuantityComponent implements OnInit, AfterContentInit {
  materials: any;
  position = 'above';
  isEditing = false;
  featureTiles: any;
  // Selections
  selectedMaterial: string;
  selectedMaterialObj: any;
  selectedMaterialImg: string;
  selectedQuantity: number;
  // selectedTile: any;
  dialogHeader = '';
  showTileSelection = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputRow: any,
    public dialogRef: MatDialogRef<AddQuantityComponent>,
    public materialsService: MaterialsService,
    public qtySrv: QuantityService,
    public feature: Feature,
    public debug: DebugService,
    public clarioGrids: ClarioGridsService,
    public profileFeature: ProfileFeature
  ) {}

  ngOnInit() {
    this.getFeatureMaterials();
    this.featureTiles = this.feature.tilesArray[this.feature.feature_type];
    this.showTileSelection = this.feature.feature_type !== 'hushSwoon';
    if (this.feature.feature_type === 'profile') {
      if (!this.profileFeature.feature_type_tile) {
        this.updateSelectedTile('standard');
      }
      this.featureTiles = this.feature.tilesArray[this.feature.feature_type][this.profileFeature.feature_type];
    }
  }

  ngAfterContentInit() {
    if (!!this.inputRow) {
      setTimeout(() => {
        this.loadRowForEdit();
      });
    }
  }

  loadRowForEdit() {
    this.debug.log('quantity', this.inputRow);
    this.isEditing = true;
    this.updateQtySelectedMaterial(this.inputRow.material);
    this.updateSelectedTile(this.feature.selectedTile);
    this.quantityDidChange(this.inputRow.used);
    this.updateSelectedTile(this.inputRow.tile);
  }

  getFeatureMaterials() {
    let requiredMaterials: any;
    const dialogVerb = this.isEditing ? 'Edit' : 'Add';
    switch (this.feature.feature_type) {
      case 'hush':
        requiredMaterials = this.materialsService.materials.felt.sola;
        this.dialogHeader = `${dialogVerb} Hush Blocks Tiles`;
        break;
      case 'tetria':
        requiredMaterials = this.materialsService.materials.felt.sola;
        this.dialogHeader = `${dialogVerb} Tetria Tiles`;
        break;
      case 'clario':
        requiredMaterials = this.materialsService.materials.felt.sola;
        this.dialogHeader = `${dialogVerb} Clario Baffles`;
        break;
      case 'profile':
        switch (this.profileFeature.feature_type) {
          case 'swoon':
            this.dialogHeader = `${dialogVerb} Swoon Tiles`;
            switch (this.profileFeature.feature_type_tile) {
              case 'standard':
                requiredMaterials = this.materialsService.materials.finishes.standard;
                break;
              case 'acoustic':
                requiredMaterials = this.materialsService.materials.felt.sola;
                break;
              case 'chroma':
                requiredMaterials = this.materialsService.materials.chroma.color;
                break;
              default:
                requiredMaterials = this.materialsService.materials.finishes.standard;
                break;
            }
            break;
        }
        break;
    }
    this.materials = requiredMaterials;
  }

  updateQtySelectedMaterial(material) {
    let materialName = material;
    if (typeof material === 'object') {
      this.selectedMaterialObj = material;
      materialName = material.material;
    }
    this.selectedMaterial = materialName;
    this.updateMaterialImg();
  }

  updateMaterialImg() {
    let materialImg;
    switch (this.feature.feature_type) {
      case 'hush':
        materialImg = `/assets/images/tiles/hush-blocks/${this.feature.selectedTile.tile}/${this.selectedMaterial}.png`;
        break;
      case 'tetria':
        materialImg = `/assets/images/tiles/${this.feature.selectedTile.tile}/${this.selectedMaterial}.png`;
        break;
      case 'clario':
        let tileType;
        let tileImageType;
        if (this.feature.selectedTile.tile_size === '00') {
          // flat tile selected
          tileType = 'tiles';
          tileImageType = '00';
        } else {
          tileType = 'baffles';
          const squareImgs = ['24', '600', '625'];
          tileImageType = squareImgs.includes(this.feature.selectedTile.tile_size) ? '24' : '48';
        }
        materialImg = `/assets/images/${tileType}/${tileImageType}/${this.selectedMaterial}.png`;
        break;
      case 'profile':
        materialImg = !!this.selectedMaterialObj ? this.selectedMaterialObj.image : '';
        if (this.profileFeature.feature_type_tile === 'chroma') {
          materialImg = !!this.selectedMaterialObj ? this.selectedMaterialObj.hex : '';
        }
        break;
    }
    this.selectedMaterialImg = materialImg;
  }

  updateSelectedTile(tile) {
    this.feature.selectedTile = tile;
    if (this.feature.feature_type === 'profile') {
      this.profileFeature.feature_type_tile = tile.tile;
      this.updateQtySelectedMaterial(''); // deselect the material
    }
    this.updateMaterialImg();
    this.getFeatureMaterials();
  }

  quantityDidChange(quantity) {
    this.selectedQuantity = quantity;
  }

  validateQtyInputs() {
    return !!this.selectedMaterial && this.selectedQuantity > 0;
  }

  cancel() {
    this.selectedMaterial = this.inputRow.material;
    this.selectedQuantity = this.inputRow.qty;
    this.dialogRef.close();
  }

  addToOrder() {
    const pkgQty = this.feature.getPackageQty(this.feature.selectedTile.tile_size || this.feature.selectedTile.tile);
    const key = `${this.selectedMaterial}-${this.feature.selectedTile.tile}`;
    const tile = this.feature.feature_type === 'clario' ? this.feature.selectedTile.tile : this.feature.selectedTile;
    const selections = {
      [key]: {
        purchased: pkgQty * Math.ceil(this.selectedQuantity / pkgQty),
        image: this.selectedMaterialImg,
        used: this.selectedQuantity,
        material: this.selectedMaterial,
        tile: tile,
        tile_size: this.feature.selectedTile.tile_size || ''
      }
    };
    this.dialogRef.close(selections);
  }
}

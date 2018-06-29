import { SeeyondService } from './_services/seeyond.service';
import { Injectable, EventEmitter } from '@angular/core';
import { DebugService } from './_services/debug.service';
import { Feature } from 'app/feature';
import * as _ from 'lodash';
import { MaterialsService } from 'app/_services/materials.service';

@Injectable()
export class SeeyondFeature extends Feature {
  onFeatureUpdated = new EventEmitter();
  onDimensionsChange = new EventEmitter();
  $outdatedMaterial = new EventEmitter();
  public syd_t = require('syd-tessellation');
  public syd_v = require('syd-visualization');
  public title: string;
  public name: string;
  public image: string;
  public height: number;
  public radius: number;
  public angle: number;
  public ceiling_length: number;
  public depth: number;
  public data: any = [];
  public xml: any = {};
  public tessellation: number; // court
  public tessellationStr: string;
  public pattern_strength: number;
  public material: string;
  public sheet_part_id: string;
  public boxes: number;
  public sheets: number;
  public cove_lighting = false;
  public lightingStyle = 'plain';
  public cameraLocation = 'back';
  public front_relief = true;
  public back_relief = false;
  public random_seed: number;
  public boxsize = 16; // baked in number right now.
  public prices: any;
  public hardware: any = [];
  public seeyond_feature_type: string;
  public seeyond_feature_index: number;
  public patterns = this.materialsService.seeyondPatternsArray;
  public seeyondService: SeeyondService;
  public widthMin: number;
  public widthMax: number;
  public heightMin: number;
  public heightMax: number;
  public ceilLengthMin: number;
  public ceilLengthMax: number;
  public radiusMin: number;
  public radiusMax: number;
  public linear_feet: number;

  updateSeeyondFeature(seeyond_feature_type?: string) {
    if (seeyond_feature_type) {
      this.debug.log('seeyond', `updateFeature: ${this.seeyond_feature_type}`);
      // default relief to false
      this.front_relief = this.back_relief = false;
      switch (seeyond_feature_type) {
        case 'linear-partition':
          this.seeyond_feature_index = 0;
          this.front_relief = this.back_relief = true;
        break;
        case 'curved-partition':
          this.seeyond_feature_index = 1;
          this.front_relief = this.back_relief = true;
        break;
        case 'wall':
          this.seeyond_feature_index = 2;
          this.front_relief = true;
        break;
        case 'wall-to-ceiling':
          this.seeyond_feature_index = 3;
          this.front_relief = true;
        break;
        case 'ceiling':
          this.seeyond_feature_index = 4;
          this.front_relief = true;
        break;
        default: {
          this.seeyond_feature_index = 2;
          this.seeyond_feature_type = 'wall';
          this.front_relief = true;
        }; break;
      }
      this.seeyond_feature_type = seeyond_feature_type;
      this.location.go(`seeyond/design/${seeyond_feature_type}`);
      const seeyondFeature = this.seeyond_features[this.seeyond_feature_index];
      // set defaults
      this.pattern_strength = 3;
      this.seeyond_feature_index = this.seeyond_feature_index;
      this.name = seeyondFeature.name;
      this.title = seeyondFeature.title;
      this.image = seeyondFeature.image;
      this.width = seeyondFeature.width;
      this.height = seeyondFeature.height;
      this.radius = seeyondFeature.radius;
      this.angle = seeyondFeature.angle;
      this.ceiling_length = seeyondFeature.ceiling_length;
      this.tessellation = 0;
      this.tessellationStr = 'court';
      this.material = 'zinc';
      this.sheet_part_id = '0-51-925';

      this.debug.log('seeyond-feature', this);

      this.setMaxMinDimensions();

      this.reloadVisualization();
    }
  }

  loadSeeyondDesign(design) {
    this.feature_type = 'seeyond'
    this.id = design.id;
    this.uid = design.uid;
    this.seeyond_feature_index = design.feature_type;
    this.seeyond_feature_type = design.name;
    this.title = design.title;
    this.name = design.name;
    this.design_name = design.design_name;
    this.project_name = design.project_name;
    this.specifier = design.specifier;
    this.units = design.units;
    this.width = design.width;
    this.height = design.height;
    this.radius = design.radius;
    this.angle = design.angle;
    this.ceiling_length = design.ceiling_length;
    this.depth = design.depth;
    this.tessellation = design.tessellation;
    this.tessellationStr = this.getTessellationName(design.tessellation)
    this.pattern_strength = design.pattern_strength;
    this.material = design.material;
    this.sheet_part_id = design.sheet_part_id;
    this.boxes = design.boxes;
    this.sheets = design.sheets;
    this.xml = design.xml;
    this.cove_lighting = design.cove_lighting;
    this.front_relief = design.front_relief;
    this.back_relief = design.back_relief;
    this.random_seed = design.random_seed;
    this.services_amount = design.services_amount;
    this.estimated_amount = design.estimated_amount;
    this.quoted = design.quoted;
    this.archived = design.archived;
    this.estimated_amount = design.estimated_amount;
    this.image = this.getFeatureImage(this.seeyond_feature_index);
    this.quantity = design.quantity || 1;

    this.materialObj = this.getMaterialInfo('felt', 'sola', this.material);
    if (this.materialObj.status === 'inactive') { this.$outdatedMaterial.emit(); }
    if (this.materialObj.status === 'discontinued') { this.$outdatedMaterial.emit(); this.canQuote = false; }

    this.reloadVisualization();
  }

  resetSeeyond() {
    this.title = undefined;
    this.name = undefined;
    this.image = undefined;
    this.height = undefined;
    this.radius = undefined;
    this.angle = undefined;
    this.ceiling_length = undefined;
    this.depth = undefined;
    this.data = undefined;
    this.xml = undefined;
    this.tessellation = undefined;
    this.tessellationStr = undefined;
    this.pattern_strength = undefined;
    this.material = undefined;
    this.sheet_part_id = undefined;
    this.boxes = undefined;
    this.sheets = undefined;
    this.cove_lighting = false;
    this.front_relief = true;
    this.back_relief = false;
    this.random_seed = undefined;
    this.prices = undefined;
    this.hardware = undefined;
    this.seeyond_feature_type = undefined;
    this.seeyond_feature_index = undefined;
    this.seeyondService = undefined;
    this.widthMin = undefined;
    this.widthMax = undefined;
    this.heightMin = undefined;
    this.heightMax = undefined;
    this.ceilLengthMin = undefined;
    this.ceilLengthMax = undefined;
    this.radiusMin = undefined;
    this.radiusMax = undefined;
    this.linear_feet = undefined;

    this.reset();
  }

  reloadVisualization() {
    // We need to set the random_seed before UpdateFeature()
    if (this.random_seed !== undefined) {
      this.debug.log('seeyond', 'RANDOM SEED IS SET.');
      this.debug.log('seeyond', `Current Random seed: ${this.random_seed}`);
      this.syd_t.QT.SetRandomSeedValue(this.random_seed);
    }// else{
    //   this.random_seed = this.syd_t.QT.GetRandomSeedValue();
    // }

    const jsonProperties = this.getJsonProperties();
    this.debug.log('seeyond-feature', jsonProperties);

    this.syd_t.QT.SetUserDataPropertiesJSONString(JSON.stringify(jsonProperties));
    this.syd_t.QT.UpdateFeature();

    // Set the random_seed if it's not already set
    if (this.random_seed === undefined) {
      this.debug.log('seeyond', 'RANDOM SEED IS NOT SET');
      this.random_seed = this.syd_t.QT.GetRandomSeedValue();
      this.debug.log('seeyond', `Current Random seed: ${this.random_seed}`);
    }

    const front = this.syd_t.QT.GetFrontSurfacePoints();
    const back = this.syd_t.QT.GetBackSurfacePoints();
    const uNum = this.syd_t.QT.GetU();
    const vNum = this.syd_t.QT.GetV();

    this.syd_v.QT.Visualization.SetFeatureType(this.seeyond_feature_index);
    this.syd_v.QT.Visualization.visualizeFeature(front, back, uNum, vNum, this.getMaterialImage(this.material), this.cameraLocation, this.getLightingStyle());

    // update the feature depth
    this.depth = this.syd_v.QT.Visualization.GetBoundingBoxDepth().toFixed(2);

    // feature has been updated
    this.onFeatureUpdated.emit();
    this.onDimensionsChange.emit();

    // update the XML
    this.xml = this.getXML();
  }

  redrawVisualization() {
    const front = this.syd_t.QT.GetFrontSurfacePoints();
    const back = this.syd_t.QT.GetBackSurfacePoints();
    const uNum = this.syd_t.QT.GetU();
    const vNum = this.syd_t.QT.GetV();

    this.syd_v.QT.Visualization.visualizeFeature(front, back, uNum, vNum, this.getMaterialImage(this.material), this.cameraLocation, this.getLightingStyle());

    // feature has been updated
    this.onFeatureUpdated.emit();

    // update the XML
    this.xml = this.getXML();
  }

  downloadImages() {
    let profileAngle: number;
    let facingAngle: number;
    let backAngle: number;
    let linearProfile: number;
    switch (this.seeyond_feature_type) {
      case 'linear-partition': backAngle = 180; linearProfile = 90; profileAngle = 45; facingAngle = 0; break;
      case 'curved-partition': backAngle = 65; profileAngle = 225; facingAngle = 180; break;
      case 'wall': profileAngle = 45; facingAngle = 0; break;
      case 'wall-to-ceiling': profileAngle = 45; facingAngle = 0; break;
      case 'ceiling': profileAngle = 0; facingAngle = 0; break;
      default: profileAngle = 45; facingAngle = 0; break;
    }
    let back = (!!backAngle) ? this.syd_v.QT.Visualization.TakeSnapshot(backAngle) : '';
    let linear = (!!linearProfile) ? this.syd_v.QT.Visualization.TakeSnapshot(linearProfile) : '';
    let profile = this.syd_v.QT.Visualization.TakeSnapshot(profileAngle);
    let facing  = this.syd_v.QT.Visualization.TakeSnapshot(facingAngle);
    const filename = this.name + '.zip';
    const FileSaver = require('file-saver');
    const JSZip = require('jszip');
    const zip = new JSZip();

    linear = linear.replace(/^data:image\/(png|jpg);base64,/, '');
    back = back.replace(/^data:image\/(png|jpg);base64,/, '');
    profile = profile.replace(/^data:image\/(png|jpg);base64,/, '');
    facing = facing.replace(/^data:image\/(png|jpg);base64,/, '');
    if (!!back) { zip.file('back.png', back, {base64: true}); }
    if (!!linear) { zip.file('side_profile.png', linear, {base64: true}); }
    zip.file('profile.png', profile, {base64: true});
    zip.file('facing.png', facing, {base64: true});
    zip.generateAsync({type: 'blob'})
    .then(function (blob) {
        FileSaver.saveAs(blob, filename);
    });
    this.reloadVisualization();
  }

  public seeyondProfileImage() {
    let profileAngle: number;
    // determine the preferred angle for each feature
    switch (this.seeyond_feature_type) {
      case 'linear-partition': profileAngle = 45; break;
      case 'curved-partition': profileAngle = 225; break;
      case 'wall': profileAngle = 45; break;
      case 'wall-to-ceiling': profileAngle = 45; break;
      case 'ceiling': profileAngle = 0; break;
      default: profileAngle = 45; break;
    }
    const profileImg = this.syd_v.QT.Visualization.TakeSnapshot(profileAngle);
    this.design_data_url = profileImg;
    this.reloadVisualization();
    return profileImg;
  }

  updateEstimatedAmount() {
    if (!this.prices) {
      this.seeyondService.getPrices().subscribe(response => {
        this.prices = response;
        this.updateEstimatedAmount();
      });
    }
    const sheetCost = this.prices['felt_sheet'];
    const stapleCost: number = this.prices['staple'];
    const ziptieCost: number = this.prices['ziptie'];
    const magnetCost: number = this.prices['magnet'];
    const backplateCost: number = this.prices['backplate'];
    const baseplateCost: number = this.prices['baseplate'];
    const frameCost: number = this.prices['frame'];

    const columns = this.syd_t.QT.GetU();
    const rows = this.syd_t.QT.GetV();
    if (this.seeyond_feature_index === 0 || this.seeyond_feature_index === 1) {
      // double sheet and boxes
      this.sheets = this.syd_t.QT.GetSheets() * 2;
      this.boxes = this.syd_t.QT.GetParts() * 2;
    } else {
      this.sheets = this.syd_t.QT.GetSheets();
      this.boxes = this.syd_t.QT.GetParts();
    }

    // PRODUCTS
    const totalProductsCost = this.sheets * sheetCost;

    // HARDWARE
    let totalHardwareCost = this.getHardwareCost(this.seeyond_feature_index);
    let lightingCost;
    if (this.cove_lighting) {
      this.calcLightingFootage();
      lightingCost = this.calcLightingCost();
      totalHardwareCost += lightingCost;
    }
    // SERVICES
    const staples: number = this.getStaples(this.seeyond_feature_index);
    // var zipties: number = this.getZipties(this.seeyond_feature_index);
    const magnets: number = this.syd_t.QT.GetMagnets();
    const frames: number = this.getFrames(this.seeyond_feature_index);
    const backplates: number = this.getBackplates(this.seeyond_feature_index);
    const baseplates: number = this.getBaseplates(this.seeyond_feature_index);
    const fabricationCost: number = this.getFabricationCost(this.seeyond_feature_index);

    this.services_amount = (staples * stapleCost) + (backplates * backplateCost) + (baseplates * baseplateCost) + (frames * frameCost) + fabricationCost;

    this.estimated_amount = totalProductsCost + totalHardwareCost + this.services_amount;
    this.debug.log('seeyond', `estimated amount: ${this.estimated_amount}`);
    return this.estimated_amount;
  }

  calcLightingFootage() {
    let totalFootage: number;
    const inset = 16; // cove lighting is positioned 16 inches in from the actual perimeter
    const units = this.units;
    let length = this.height;
    let ceilingLength = this.ceiling_length;
    let width = this.width;
    if (this.units === 'centimeters') {
      length = this.convertCMtoIN(length);
      ceilingLength = this.convertCMtoIN(ceilingLength);
      width = this.convertCMtoIN(width);
    }
    if (this.seeyond_feature_type === 'wall-to-ceiling') {
      totalFootage = ((ceilingLength - inset) * 2) + (width - inset * 2);
    } else if (this.seeyond_feature_type === 'ceiling') {
      totalFootage = ((length - (inset * 2)) * 2) + ((width - (inset * 2)) * 2);
    }
    this.linear_feet = totalFootage / 12;
    this.debug.log('seeyond-feature', `linear feet: ${this.linear_feet}`);
    return this.linear_feet;
  }

  calcLightingCost() {
    const powerSupplyHw = 144.71;
    const switchHw = 206.74;
    const totalWatts = this.linear_feet * 1.88;
    const powerSuppliesNeeded = Math.ceil(totalWatts / 85.4);
    const dimmingSwitchesNeeded = Math.ceil(powerSuppliesNeeded / 12.0);
    const powerCost = powerSuppliesNeeded * powerSupplyHw;
    const switchCost = dimmingSwitchesNeeded * switchHw;
    const linearFootCost = this.linear_feet * 40.02;
    const partsCost = linearFootCost + switchCost + powerCost;
    const adjustment = ((partsCost / 5000.00) * 95.00) + 265.00;
    const estimatedCost = parseInt((partsCost + adjustment).toFixed(2), 10);
    return estimatedCost;
  }

  convertDimensionsUnits(newUnit) {
    this.units = newUnit;
    if (this.units === 'inches') {
      this.height = this.convertCMtoIN(this.height);
      this.width = this.convertCMtoIN(this.width);
      this.ceiling_length = this.convertCMtoIN(this.ceiling_length);
      this.radius = this.convertCMtoIN(this.radius);
    }
    if (this.units === 'centimeters') {
      this.height = this.convertINtoCM(this.height);
      this.width = this.convertINtoCM(this.width);
      this.ceiling_length = this.convertINtoCM(this.ceiling_length);
      this.radius = this.convertINtoCM(this.radius);
    }
  }

  setMaxMinDimensions(units?) {
    if (!units) { units = 'inches'; } // if units aren't given, assume inches
    this.widthMin = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units]['widthMin'];
    this.widthMax = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units]['widthMax'];
    this.heightMin = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units]['heightMin'];
    this.heightMax = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units]['heightMax'];
    this.ceilLengthMin = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units]['ceilLengthMin'];
    this.ceilLengthMax = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units]['ceilLengthMax'];
    this.radiusMin = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units]['radiusMin'];
    this.radiusMax = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units]['radiusMax'];

    if (this.width) { // update radiusMin based off entered width
      const newRadiusMin = Math.ceil((this.width * .5) + 1);
      this.radiusMin = (newRadiusMin < this.radiusMin) ? this.radiusMin : newRadiusMin;
    }
  }

  public updateDimensions() {
    const currentWidth = this.width;
    const currentHeight = this.height;
    const currentCeilLength = this.ceiling_length;
    const currentRadius = this.radius;
    const units = this.units;
    const max_min = this.materialsService.seeyondMinMaxDimensions[this.seeyond_feature_index][units];
    const widthMin = max_min['widthMin'];
    const widthMax = max_min['widthMax'];
    const heightMin = max_min['heightMin'];
    const heightMax = max_min['heightMax'];
    const ceilLengthMin = max_min['ceilLengthMin'];
    const ceilLengthMax = max_min['ceilLengthMax'];
    let radiusMin = max_min['radiusMin'];
    const radiusMax = max_min['radiusMax'];

    if (currentWidth < widthMin) {
      this.width = widthMin;
      this.alert.error(`The minimum width is ${widthMin} ${units}`);
    }
    if (currentWidth > widthMax) {
      this.width = widthMax;
      this.alert.error(`The maximum width is ${widthMax} ${units}`);
    }
    if (currentHeight < heightMin) {
      this.height = heightMin;
      this.alert.error(`The minimum height is ${heightMin} ${units}`);
    }
    if (currentHeight > heightMax) {
      this.height = heightMax;
      this.alert.error(`The maximum height is ${heightMax} ${units}`);
    }
    if ((currentCeilLength < ceilLengthMin) && (this.seeyond_feature_index === 3)) {
      this.ceiling_length = ceilLengthMin;
      this.alert.error(`The minimum ceiling length is ${ceilLengthMin} ${units}`);
    }
    if ((currentCeilLength > ceilLengthMax) && (this.seeyond_feature_index === 3)) {
      this.ceiling_length = ceilLengthMax;
      this.alert.error(`The maximum maximum ceiling length is ${ceilLengthMax} ${units}`);
    }
    if (this.width) { // update radiusMin based off entered width
      const newRadiusMin = Math.ceil((this.width * .5) + 1);
      radiusMin = (newRadiusMin < this.radiusMin) ? this.radiusMin : newRadiusMin;
    }
    if ((currentRadius < radiusMin) && (this.seeyond_feature_index === 1)) {
      this.radius = radiusMin;
      this.alert.error(`The minimum radius for your width is ${radiusMin} ${units}`);
    }
    if ((currentRadius > radiusMax) && (this.seeyond_feature_index === 1)) {
      this.radius = radiusMax;
      this.alert.error(`The maximum radius is ${radiusMax} ${units}`);
    }
    this.onDimensionsChange.emit();
    this.reloadVisualization();
  }


  getFabricationCost(seeyond_feature_index: number) {
    const ceilingFab = 48.46;
    const partitionFab = 48.46;
    const wallFab = 44.13;
    let fabricationCost: number;

    switch (seeyond_feature_index) {
      case 0:
        // linear
        fabricationCost = this.boxes * partitionFab;
        break;

      case 1:
        fabricationCost = this.boxes * partitionFab;
        break;

      case 2:
        fabricationCost = this.boxes * wallFab;
        break;

      case 3:
        fabricationCost = (this.getWallBoxes() * wallFab) + (this.getCeilingBoxes() * ceilingFab);
        break;

      case 4:
        fabricationCost = this.boxes * ceilingFab;
        break;

      default:
        // shouldn't happen, but if it does default to the partition fab cost.
        fabricationCost = this.boxes * partitionFab;
        break;
    }

    return fabricationCost;
  }

  getWallBoxes() {
    const wallRows = this.syd_t.QT.GetWallRows();
    const wallCols = this.syd_t.QT.GetWallColumns();
    this.debug.log('seeyond', `wall rows: ${wallRows}`);
    this.debug.log('seeyond', `wall cols: ${wallCols}`);

    return wallRows * wallCols;
  }

  getCeilingBoxes() {
    const ceilingRows = this.syd_t.QT.GetCeilingRows();
    const ceilingCols = this.syd_t.QT.GetCeilingColumns();
    this.debug.log('seeyond', `ceiling rows: ${ceilingRows}`);
    this.debug.log('seeyond', `ceiling cols: ${ceilingCols}`);

    return ceilingRows * ceilingCols;
  }

  getBackplates(seeyond_feature_index: number) {
    if (seeyond_feature_index === 2) {
      // wall
      return Math.ceil(Math.ceil(this.boxes / 4) / 3);
    } else if (seeyond_feature_index === 3) {
      // wall-to-ceiling
      const wallRows = this.syd_t.QT.GetWallRows();
      const wallCols = this.syd_t.QT.GetWallColumns();
      return Math.ceil(Math.ceil((wallRows * wallCols) / 4) / 3);
    } else {
      // anything else
      return 0;
    }
  }

  getBaseplates(seeyond_feature_index: number) {
    if (seeyond_feature_index === 0 || seeyond_feature_index === 1) {
      // partitions
      return Math.ceil(this.syd_t.QT.GetU() / 3);
    } else {
      return 0;
    }
  }

  getStaples(seeyond_feature_index: number) {
    if (seeyond_feature_index === 0 || seeyond_feature_index === 1) {
      // partitions. we need to double the number of frames
      return this.boxes * 25 * 2;
    }else if (seeyond_feature_index === 2) {
      // wall
      return this.boxes * 25;
    }else if (seeyond_feature_index === 3) {
      // wall-to-ceiling
      return this.boxes * 25;
    }else if (seeyond_feature_index === 4) {
      // ceiling
      return this.boxes * 25;
    }else {
      // anything else
      return this.boxes * 25;
    }
  }

  getZipties(seeyond_feature_index: number) {
    if (seeyond_feature_index === 0 || seeyond_feature_index === 1) {
      // partitions
      return Math.ceil(this.boxes * 12);
    }else if (seeyond_feature_index === 2) {
      // wall
      return 0;
    }else if (seeyond_feature_index === 3) {
      // wall-to-ceiling only the ceiling needs ties
      const ceilingRows = this.syd_t.QT.GetCeilingRows();
      const ceilingCols = this.syd_t.QT.GetCeilingColumns();
      const ceilingBoxes = Math.ceil(ceilingRows * ceilingCols);
      return Math.ceil(ceilingBoxes * 24);
    }else if (seeyond_feature_index === 4) {
      // ceiling
      return Math.ceil(this.boxes * 24);
    }
  }

  getFrames(seeyond_feature_index: number) {
    if (seeyond_feature_index === 0 || seeyond_feature_index === 1) {
      // partitions. we need to double the number of frames
      return Math.ceil(this.boxes / 18) * 2;
    }else if (seeyond_feature_index === 2) {
      // wall
      return Math.ceil(this.boxes / 18);
    }else if (seeyond_feature_index === 3) {
      // wall-to-ceiling
      return Math.ceil(this.boxes / 18);
    }else if (seeyond_feature_index === 4) {
      // ceiling
      return Math.ceil(this.boxes / 18);
    }
  }

  getHardwareCost(seeyond_feature_index: number) {
    // reset hardware array
    this.hardware = [];
    let totalHardwareCost = 0.00;
    this.debug.log('seeyond', '========== FEATURE HARDWARE ===============')
    const hardwares = this.seeyond_features[seeyond_feature_index].hardware;
    let qty;
    for (const hardware in hardwares) {
      if (hardwares.hasOwnProperty(hardware)) {

        // for magnets add the partId to each feature in MaterialsService.seeyond_features and to hardware switch below

        qty = this.getHardwareQty(seeyond_feature_index, hardware);
        const hardwareCost = this.prices[hardware] * qty;
        totalHardwareCost += hardwareCost;

        this.debug.log('seeyond', hardware);
        this.debug.log('seeyond', `PRICE: ${this.prices[hardware]}`);
        this.debug.log('seeyond', `QUANTITY: ${qty}`);
        this.debug.log('seeyond', `HARDWARE COST: ${hardwareCost}`);

        const hwpart = {
          'part_id': hardware,
          'qty': qty
        }
        this.hardware.push(hwpart);
      }
    }
    this.debug.log('seeyond', '========== /FEATURE HARDWARE ===============')
    return totalHardwareCost;
  }

  getHardwareQty(seeyond_feature_index: number, hardware: string) {
    let hardwareQty = 0;
    const columns = this.syd_t.QT.GetU();
    const rows = this.syd_t.QT.GetV();
    switch (hardware) {
      // MAGNETS
      case '3-85-101': hardwareQty = this.syd_t.QT.GetMagnets(); break;

      // WALL
      case '3-15-1606': hardwareQty = Math.ceil(this.boxes / 4) * 4; break;
      case '3-85-104': hardwareQty = Math.ceil(this.boxes / 4) * 4; break;
      case '3-85-109': hardwareQty = Math.ceil(this.boxes / 4) * 4; break;

      // PARTITIONS
      case '3-85-106': hardwareQty = columns * 4; break;

      // Used in partitions and ceilings
      case '3-15-0842':
        if (seeyond_feature_index === 0 || seeyond_feature_index === 1) {
          hardwareQty = this.getBaseplates(seeyond_feature_index) * 3;
        }else if (seeyond_feature_index === 3) {
          hardwareQty = Math.ceil(this.syd_t.QT.GetCeilingRows() / 2) * Math.ceil(this.syd_t.QT.GetCeilingColumns() / 2) * 2;
        }else if (seeyond_feature_index === 4) {
          hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2) * 2;
        }
        break;

      // Used in partitions and ceilings
      case '3-85-105':
        if (seeyond_feature_index === 0 || seeyond_feature_index === 1) {
          hardwareQty = columns * 4;
        }else if (seeyond_feature_index === 3) {
          hardwareQty = Math.ceil(this.syd_t.QT.GetCeilingRows() / 2) * Math.ceil(this.syd_t.QT.GetCeilingColumns() / 2) * 4;
        }else if (seeyond_feature_index === 4) {
          hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2) * 4;
        }
        break;

      // Used in partitions and ceilings
      case '3-85-102':
        if (seeyond_feature_index === 0 || seeyond_feature_index === 1) {
          hardwareQty = Math.ceil(this.boxes / 2 * 12);
        }else if (seeyond_feature_index === 3) {
          const ceilingRows = this.syd_t.QT.GetCeilingRows();
          const ceilingCols = this.syd_t.QT.GetCeilingColumns();
          const ceilingBoxes = Math.ceil(ceilingRows * ceilingCols);
          hardwareQty = Math.ceil(ceilingBoxes * 12);
        }else if (seeyond_feature_index === 4) {
          hardwareQty = Math.ceil(this.boxes * 12);
        }
        break;

      // CEILINGS
      case '3-85-107': hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2); break;
      case '3-85-108': hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2); break;
      case '3-15-1674': hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2); break;
      case '3-15-1675': hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2); break;

      default: alert('Unknown hardware part: ' + hardware); break;
    }
    return hardwareQty;
  }

  getMaterialImage(material: string) {
    return '/assets/images/materials/felt/sola/' + material + '.png';
  }

  getMaterialName(material: string) {
    return material.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getTessellationImage(tessellation: number) {
    return '/assets/images/patterns/' + this.getTessellationName(tessellation).toLowerCase() + '.png';
  }

  getTessellationName(tessellation: number) {
    let name: string;
    switch (tessellation) {
      case 0: name = 'court'; break;
      case 1: name = 'cusp'; break;
      case 2: name = 'kink'; break;
      case 3: name = 'tilt'; break;
      case 4: name = 'billow'; break;
      default: name = 'Pattern name not found for tessellation: ' + tessellation; break;
    }
    return name;
  }

  getTesslationNumber(tessName: string) {
    let tessNum: number;
    switch (tessName) {
      case 'court': tessNum = 0; break;
      case 'cusp': tessNum = 1; break;
      case 'kink': tessNum = 2; break;
      case 'tilt': tessNum = 3; break;
      case 'billow': tessNum = 4; break;
    }
    return tessNum;
  }

  getFormattedAmount() {
    const accounting = require( 'accounting' );
    return accounting.formatMoney(this.estimated_amount);
  }

  getFormattedServicesAmount() {
    const accounting = require( 'accounting' );
    return accounting.formatMoney(this.services_amount);
  }

  getFeatureImage(seeyond_feature_index: number) {
    return this.seeyond_features[seeyond_feature_index].image;
  }

  getDimensionString(units?) {
    let depth = this.depth;
    if (units) {
      depth = (this.units === 'inches') ? this.depth : this.convertINtoCM(this.depth);
      // if units come in update this.units
      this.units = units;
    }
    let dimensionString = `${this.width} W x ${this.height} H x ${depth} D`;
    // curved partition has radius
    if (this.seeyond_feature_index === 1) { dimensionString += ' x ' + this.radius + ' R'; }
    // wall to ceiling has ceiling_length
    if (this.seeyond_feature_index === 3) { dimensionString += ' x ' + this.ceiling_length + ' CL'; }
    // ceiling is labeled as length, not height
    if (this.seeyond_feature_index === 4) { dimensionString = dimensionString.replace(/H/i, 'L'); }
    // add dimensions
    if (this.units === 'inches') { dimensionString += ` (IN)`; }
    if (this.units === 'centimeters') { dimensionString += ` (CM)`; }

    return dimensionString;
  }

  getLightingStyle() {
    return this.cove_lighting ? 'cove' : 'plain';
  }

  getJsonProperties() {
    let convertedWidth = this.width;
    let convertedHeight = this.height;
    let convertedCeilingLength = this.ceiling_length;
    let convertedRadius = this.radius;
    if (this.units === 'centimeters') {
      convertedWidth = this.convertCMtoIN(convertedWidth);
      convertedHeight = this.convertCMtoIN(convertedHeight);
      convertedCeilingLength = this.convertCMtoIN(convertedCeilingLength);
      convertedRadius = this.convertCMtoIN(convertedRadius);
    }
    return {
      'UserInputs': {
        // 0 = straight partition, 1 = arc partition, 2 = facing, 3 = transition, 4 = ceiling, 5 = bent partition
        'Type': this.seeyond_feature_index,
        // 0 = court, 1 = cusp, 2 = kink, 3 = tilt, 4 = billow
        'Tessellation': this.tessellation,
        // valid values = .1 - 1.0 (we send whole numbers 1-10 and the tessellation divides by 10)
        'PatternStrength': this.pattern_strength,
        // relative path to rendering material image
        'Material': this.getMaterialImage(this.material),
        // in inches
        'Width': convertedWidth,
        // in inches
        'Height': convertedHeight,
        // in inches
        'Radius': convertedRadius,
        // in degrees 0-360
        'Angle':  this.angle,
        // in inches
        'Ceiling_Length': convertedCeilingLength,
        // boolean
        'FrontRelief': this.front_relief,
        // boolean
        'BackRelief': this.back_relief
      }
    }
  }

  getXML() {
    const front = this.syd_t.QT.GetFrontSurfacePoints();
    const back = this.syd_t.QT.GetBackSurfacePoints();
    const uNum = this.syd_t.QT.GetU();
    const vNum = this.syd_t.QT.GetV();

    const properties = JSON.parse(this.syd_t.QT.GetAllPropertiesAsJSONString());
    this.debug.log('seeyond', properties);

    const takeOff = properties.Take_Off;
    let hemi = 'single';
    if (this.syd_t.QT.Two_Sided) {
      hemi = 'double';
    }

    const XMLWriter = require('xml-writer');
    const xw = new XMLWriter(true);
    xw.formatting = 'indented'; // add indentation and newlines
    xw.indentChar = ' '; // indent with spaces
    xw.indentation = 2; // add 2 spaces per level
    xw.startDocument();
    xw.startElement('seeyondProject');

    xw.startElement('projectID');
    if (this.id) {
      xw.text(this.id);
    }else {
      xw.text('New Project');
    }
    xw.endElement('projectID');

    if (this.uid) {
      xw.startElement('user');
         xw.startElement('uid');
           xw.text(this.uid);
         xw.endElement('uid');
      xw.endElement('user');
    }

    xw.startElement('order');

      xw.startElement('orderDate');
      xw.text('2017-01-22'); // TO DO: insert order date here
      xw.endElement('orderDate');
      // TO DO: add the products price, hardware price and services price
      xw.startElement('price');
      xw.text(this.estimated_amount);
      xw.endElement('price');

      xw.startElement('notes');
      xw.text('Test comments here.'); // TO DO: insert notes here
      xw.endElement('notes');

    xw.endElement('order');

    xw.startElement('userInputs');

      let seeyond_feature_index = 'StraightPartition';
      switch (properties.UserInputs.Type) {
        // freestanding linear
        case 0:
          seeyond_feature_index = 'Freestanding Linear';
          break;

        // freestanding curved partition
        case 1:
          seeyond_feature_index = 'Freestanding Curved';
          break;

        // wall feature
        case 2:
          seeyond_feature_index = 'Wall';
          break;

        // wall-to-ceiling partition
        case 3:
          seeyond_feature_index = 'Wall-to-Ceiling';
          break;

        // ceiling feature
        case 4:
          seeyond_feature_index = 'Ceiling Feature';
          break;

        // wall
        default:
          seeyond_feature_index = 'Wall';
      }

      xw.startElement('installationType');
      xw.text(seeyond_feature_index);
      xw.endElement('installationType');

      let tessellation = 'quad';
      switch (properties.UserInputs.Tessellation) {
        case 1:
            tessellation = 'cusp';
            break;
        case 2:
            tessellation = 'kink';
            break;
        case 3:
            tessellation = 'tilt';
            break;
        case 4:
            tessellation = 'billow';
            break;
        default:
            tessellation = 'court';
      }

      xw.startElement('tessellation');
      xw.text(tessellation);
      xw.endElement('tessellation');

      xw.startElement('width');
      xw.text(properties.UserInputs.Width);
      xw.endElement('width');

      xw.startElement('height');
      xw.text(properties.UserInputs.Height);
      xw.endElement('height');

      if (seeyond_feature_index === 'Freestanding Curved') {
        xw.startElement('radius');
        xw.text(properties.UserInputs.Radius);
        xw.endElement('radius');
      }

      if (seeyond_feature_index === 'Wall-to-Ceiling') {
        xw.startElement('angle');
        xw.text(properties.UserInputs.Angle);
        xw.endElement('angle');

        xw.startElement('ceiling_length');
        xw.text(properties.UserInputs.Ceiling_Length);
        xw.endElement('ceiling_length');
      }

      xw.startElement('columns');
      xw.text(uNum);
      xw.endElement('columns');

      xw.startElement('rows');
      xw.text(vNum);
      xw.endElement('rows');

      xw.startElement('patternStrength');
      xw.text(properties.UserInputs.PatternStrength);
      xw.endElement('patternStrength');

    xw.endElement('userInputs');

    xw.startElement('productAttributes');

      xw.startElement('material');
        xw.startElement('partid');
          xw.text('#-###-###'); // TO DO: add the partid as a property
        xw.endElement('partid');
        xw.startElement('name');
          xw.text(this.material);
        xw.endElement('name');
      xw.endElement('material');

      xw.startElement('hemisphere');
      xw.text(hemi);
      xw.endElement('hemisphere');

      xw.startElement('faceSizeTarget');
      xw.text(properties.BoxSize.toString());
      xw.endElement('faceSizeTarget');

      xw.startElement('depthTarget');
      xw.text(properties.Depth.toString());
      xw.endElement('depthTarget');

    xw.endElement('productAttributes');

    xw.startElement('takeOff');

        xw.startElement('parts');
        xw.text(takeOff.Parts);
        xw.endElement('parts');

        xw.startElement('magnets');
        xw.text(takeOff.Magnets);
        xw.endElement('magnets');

        xw.startElement('sheets');
        xw.text(takeOff.Sheets);
        xw.endElement('sheets');

    xw.endElement('takeOff');

    xw.startElement('Geometry');

    xw.startElement('Front');
    for (let i = 0; i < uNum; i++) {
      for (let j = 0; j < vNum; j++) {
        xw.startElement('Panel_' + '0' + '-' + i + '-' + j);
          xw.startElement('pt0');
            xw.text('{' + front[i + 1][j][0] + ',' + front[i + 1][j][1] + ',' + front[i + 1][j][2] + '}');
          xw.endElement('pt0');
          xw.startElement('pt1');
            xw.text('{' + front[i][j][0] + ',' + front[i][j][1] + ',' + front[i][j][2] + '}');
          xw.endElement('pt1');
          xw.startElement('pt2');
            xw.text('{' + front[i][j + 1][0] + ',' + front[i][j + 1][1] + ',' + front[i][j + 1][2] + '}');
          xw.endElement('pt2');
          xw.startElement('pt3');
            xw.text('{' + front[i + 1][j + 1][0] + ',' + front[i + 1][j + 1][1] + ',' + front[i + 1][j + 1][2] + '}');
          xw.endElement('pt3');
        xw.endElement('Panel_' + '0' + '-' + i + '-' + j);
      }
    }

    xw.endElement('Front');

    xw.startElement('Back');
    for (let i = 0; i < uNum; i++) {
      for (let j = 0; j < vNum; j++) {
        xw.startElement('Panel_' + '1' + '-' + i + '-' + j);
        xw.startElement('pt0');
          xw.text('{' + back[i + 1][j][0] + ',' + back[i + 1][j][1] + ',' + back[i + 1][j][2] + '}');
        xw.endElement('pt0');
        xw.startElement('pt1');
          xw.text('{' + back[i][j][0] + ',' + back[i][j][1] + ',' + back[i][j][2] + '}');
        xw.endElement('pt1');
        xw.startElement('pt2');
          xw.text('{' + back[i][j + 1][0] + ',' + back[i][j + 1][1] + ',' + back[i][j + 1][2] + '}');
        xw.endElement('pt2');
        xw.startElement('pt3');
          xw.text('{' + back[i + 1][j + 1][0] + ',' + back[i + 1][j + 1][1] + ',' + back[i + 1][j + 1][2] + '}');
        xw.endElement('pt3');
        xw.endElement('Panel_' + '1' + '-' + i + '-' + j);
      }
    }
    xw.endElement('Back');
    xw.endElement('Geometry');
    xw.endDocument();

    const xml_string = xw.toString().substring(21);
    return xml_string;
  }
}

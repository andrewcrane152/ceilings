import { Injectable, EventEmitter } from '@angular/core';
import { DebugService } from './_services/debug.service';
import { Feature } from 'app/feature';
import * as _ from 'lodash';
import { MaterialsService } from 'app/_services/materials.service';

@Injectable()
export class SeeyondFeature extends Feature {
  onFeatureUpdated = new EventEmitter();
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
  public tessellation = 0; // court
  public pattern_strength = 3;
  public material = 'zinc';
  public sheet_part_id = '0-51-804';
  public boxes: number;
  public sheets: number;
  public cove_lighting = false;
  public random_seed: number;
  public boxsize = 16; // baked in number right now.
  public prices: any;
  public hardware: any = [];
  public seeyond_feature_type: number;

  updateFeature(seeyond_feature_type: string) {
    let seeyondFeatIndex: number;
    switch (seeyond_feature_type) {
      case 'linear-partition': seeyondFeatIndex = 0; break;
      case 'curved-partition': seeyondFeatIndex = 1; break;
      case 'wall': seeyondFeatIndex = 2; break;
      case 'wall-to-ceiling': seeyondFeatIndex = 3; break;
      case 'ceiling': seeyondFeatIndex = 4; break;
      default: seeyondFeatIndex = 0; break;
    }
    this.debug.log('seeyond', 'updateFeature invoked');
    // load the selected feature
    let feature;
    feature = this.seeyond_features[seeyondFeatIndex];

    // set defaults
    this.seeyond_feature_type = seeyondFeatIndex;
    this.name = feature.name;
    this.title = feature.title;
    this.image = feature.image;
    this.width = feature.width;
    this.height = feature.height;
    this.radius = feature.radius;
    this.angle = feature.angle;
    this.ceiling_length = feature.ceiling_length;

    // this.reloadVisualization();  // TODO: bring this back
  }

  loadFeature(feature: Feature) {
    this.id = feature.id;
    this.uid = feature.uid;
    this.seeyond_feature_type = this.seeyond_feature_type;
    this.title = this.title;
    this.name = this.name;
    this.design_name = feature.design_name;
    this.project_name = feature.project_name;
    this.specifier = feature.specifier;
    this.units = feature.units;
    this.width = feature.width;
    this.height = this.height;
    this.radius = this.radius;
    this.angle = this.angle;
    this.ceiling_length = this.ceiling_length;
    this.depth = this.depth;
    this.tessellation = this.tessellation;
    this.pattern_strength = this.pattern_strength;
    this.material = feature.material;
    this.sheet_part_id = this.sheet_part_id;
    this.boxes = this.boxes;
    this.sheets = this.sheets;
    this.xml = this.xml;
    this.cove_lighting = this.cove_lighting;
    this.random_seed = this.random_seed;
    this.services_amount = feature.services_amount;
    this.estimated_amount = feature.estimated_amount;
    this.quoted = feature.quoted;
    this.archived = feature.archived;
    this.image = this.getFeatureImage(this.seeyond_feature_type); // need to get this from the seeyond_feature_type

    this.reloadVisualization();
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

    this.syd_v.QT.Visualization.SetFeatureType(this.seeyond_feature_type);
    this.syd_v.QT.Visualization.visualizeFeature(front, back, uNum, vNum, this.getMaterialImage(this.material));

    // update the feature depth
    this.depth = this.syd_v.QT.Visualization.GetBoundingBoxDepth().toFixed(2);

    // feature has been updated
    this.onFeatureUpdated.emit();

    // update the XML
    this.xml = this.getXML();
  }

  redrawVisualization() {
    const front = this.syd_t.QT.GetFrontSurfacePoints();
    const back = this.syd_t.QT.GetBackSurfacePoints();
    const uNum = this.syd_t.QT.GetU();
    const vNum = this.syd_t.QT.GetV();

    this.syd_v.QT.Visualization.visualizeFeature(front, back, uNum, vNum, this.getMaterialImage(this.material));

    // feature has been updated
    this.onFeatureUpdated.emit();

    // update the XML
    this.xml = this.getXML();
  }

  updateEstimatedAmount() {
    const sheetCost = this.prices['felt_sheet'];
    const stapleCost: number = this.prices['staple'];
    const ziptieCost: number = this.prices['ziptie'];
    const magnetCost: number = this.prices['magnet'];
    const backplateCost: number = this.prices['backplate'];
    const baseplateCost: number = this.prices['baseplate'];
    const frameCost: number = this.prices['frame'];

    const columns = this.syd_t.QT.GetU();
    const rows = this.syd_t.QT.GetV();
    if (this.seeyond_feature_type === 0 || this.seeyond_feature_type === 1) {
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
    const totalHardwareCost = this.getHardwareCost(this.seeyond_feature_type);

    // SERVICES
    const staples: number = this.getStaples(this.seeyond_feature_type);
    // var zipties: number = this.getZipties(this.seeyond_feature_type);
    const magnets: number = this.syd_t.QT.GetMagnets();
    const frames: number = this.getFrames(this.seeyond_feature_type);
    const backplates: number = this.getBackplates(this.seeyond_feature_type);
    const baseplates: number = this.getBaseplates(this.seeyond_feature_type);
    const fabricationCost: number = this.getFabricationCost(this.seeyond_feature_type);

    this.services_amount = (staples * stapleCost) + (magnets * magnetCost) + (backplates * backplateCost) + (baseplates * baseplateCost) + (frames * frameCost) + fabricationCost;

    this.debug.log('seeyond', `Rows: ${rows}`);
    this.debug.log('seeyond', `Columns: ${columns}`);
    this.debug.log('seeyond', `boxes: ${this.boxes}`);
    this.debug.log('seeyond', `sheets: ${this.sheets}`);
    this.debug.log('seeyond', `magnets: ${magnets}`);
    this.debug.log('seeyond', `stapleCost: ${stapleCost}`);
    this.debug.log('seeyond', `Staples cost: ${(staples * stapleCost)}`);
    // this.debug.log('seeyond', `Zipties cost: ${(zipties * ziptieCost)}`);
    this.debug.log('seeyond', `Magnets cost: ${(magnets * magnetCost)}`);
    this.debug.log('seeyond', `Backplates: ${backplates}`);
    this.debug.log('seeyond', `Backplates cost: ${(backplates * backplateCost)}`);
    this.debug.log('seeyond', `Baseplates: ${baseplates}`);
    this.debug.log('seeyond', `Baseplates cost: ${(baseplates * baseplateCost)}`);
    this.debug.log('seeyond', `Frames: ${frames}`);
    this.debug.log('seeyond', `Frames cost: ${(frames * frameCost)}`);
    this.debug.log('seeyond', `Fabrication cost: ${fabricationCost}`);
    this.debug.log('seeyond', `Products cost: ${totalProductsCost}`);
    this.debug.log('seeyond', `Hardware cost: ${totalHardwareCost}`);
    this.debug.log('seeyond', `Services cost: ${this.services_amount}`);

    this.estimated_amount = totalProductsCost + totalHardwareCost + this.services_amount;
    return this.estimated_amount;
  }

  getFabricationCost(seeyond_feature_type: number) {
    const ceilingFab = 48.46;
    const partitionFab = 48.46;
    const wallFab = 44.13;
    let fabricationCost: number;

    switch (seeyond_feature_type) {
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

  getBackplates(seeyond_feature_type: number) {
    if (seeyond_feature_type === 2) {
      // wall
      return Math.ceil(Math.ceil(this.boxes / 4) / 3);
    } else if (seeyond_feature_type === 3) {
      // wall-to-ceiling
      const wallRows = this.syd_t.QT.GetWallRows();
      const wallCols = this.syd_t.QT.GetWallColumns();
      return Math.ceil(Math.ceil((wallRows * wallCols) / 4) / 3);
    } else {
      // anything else
      return 0;
    }
  }

  getBaseplates(seeyond_feature_type: number) {
    if (seeyond_feature_type === 0 || seeyond_feature_type === 1) {
      // partitions
      return Math.ceil(this.syd_t.QT.GetU() / 3);
    } else {
      return 0;
    }
  }

  getStaples(seeyond_feature_type: number) {
    if (seeyond_feature_type === 0 || seeyond_feature_type === 1) {
      // partitions. we need to double the number of frames
      return this.boxes * 25 * 2;
    }else if (seeyond_feature_type === 2) {
      // wall
      return this.boxes * 25;
    }else if (seeyond_feature_type === 3) {
      // wall-to-ceiling
      return this.boxes * 25;
    }else if (seeyond_feature_type === 4) {
      // ceiling
      return this.boxes * 25;
    }else {
      // anything else
      return this.boxes * 25;
    }
  }

  getZipties(seeyond_feature_type: number) {
    if (seeyond_feature_type === 0 || seeyond_feature_type === 1) {
      // partitions
      return Math.ceil(this.boxes * 12);
    }else if (seeyond_feature_type === 2) {
      // wall
      return 0;
    }else if (seeyond_feature_type === 3) {
      // wall-to-ceiling only the ceiling needs ties
      const ceilingRows = this.syd_t.QT.GetCeilingRows();
      const ceilingCols = this.syd_t.QT.GetCeilingColumns();
      const ceilingBoxes = Math.ceil(ceilingRows * ceilingCols);
      return Math.ceil(ceilingBoxes * 24);
    }else if (seeyond_feature_type === 4) {
      // ceiling
      return Math.ceil(this.boxes * 24);
    }
  }

  getFrames(seeyond_feature_type: number) {
    if (seeyond_feature_type === 0 || seeyond_feature_type === 1) {
      // partitions. we need to double the number of frames
      return Math.ceil(this.boxes / 18) * 2;
    }else if (seeyond_feature_type === 2) {
      // wall
      return Math.ceil(this.boxes / 18);
    }else if (seeyond_feature_type === 3) {
      // wall-to-ceiling
      return Math.ceil(this.boxes / 18);
    }else if (seeyond_feature_type === 4) {
      // ceiling
      return Math.ceil(this.boxes / 18);
    }
  }

  getHardwareCost(seeyond_feature_type: number) {
    // reset hardware array
    this.hardware = [];
    let totalHardwareCost = 0.00;
    this.debug.log('seeyond', '========== FEATURE HARDWARE ===============')
    const hardwares = this.seeyond_features[seeyond_feature_type].hardware;
    const size = Object.keys(hardwares).length;
    let qty;
    for (const hardware in hardwares) {
      if (hardwares.hasOwnProperty(hardware)) {
        qty = this.getHardwareQty(seeyond_feature_type, hardware);
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

  getHardwareQty(seeyond_feature_type: number, hardware: string) {
    let hardwareQty = 0;
    const columns = this.syd_t.QT.GetU();
    const rows = this.syd_t.QT.GetV();
    switch (hardware) {
      // WALL
      case '3-15-1606':
        hardwareQty = Math.ceil(this.boxes / 4) * 4;
        break;

      case '3-85-104':
        hardwareQty = Math.ceil(this.boxes / 4) * 4;
        break;

      case '3-85-109':
        hardwareQty = Math.ceil(this.boxes / 4) * 4;
        break;
      // END WALL

      // PARTITIONS
      case '3-85-106':
        hardwareQty = columns * 4;
        break;

      // Used in partitions and ceilings
      case '3-15-0842':
        if (seeyond_feature_type === 0 || seeyond_feature_type === 1) {
          hardwareQty = this.getBaseplates(seeyond_feature_type) * 3;
        }else if (seeyond_feature_type === 3) {
          hardwareQty = Math.ceil(this.syd_t.QT.GetCeilingRows() / 2) * Math.ceil(this.syd_t.QT.GetCeilingColumns() / 2) * 2;
        }else if (seeyond_feature_type === 4) {
          hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2) * 2;
        }
        break;

      // Used in partitions and ceilings
      case '3-85-105':
        if (seeyond_feature_type === 0 || seeyond_feature_type === 1) {
          hardwareQty = columns * 4;
        }else if (seeyond_feature_type === 3) {
          hardwareQty = Math.ceil(this.syd_t.QT.GetCeilingRows() / 2) * Math.ceil(this.syd_t.QT.GetCeilingColumns() / 2) * 4;
        }else if (seeyond_feature_type === 4) {
          hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2) * 4;
        }
        break;

      // Used in partitions and ceilings
      case '3-85-102':
        if (seeyond_feature_type === 0 || seeyond_feature_type === 1) {
          hardwareQty = Math.ceil(this.boxes * 12);
        }else if (seeyond_feature_type === 3) {
          const ceilingRows = this.syd_t.QT.GetCeilingRows();
          const ceilingCols = this.syd_t.QT.GetCeilingColumns();
          const ceilingBoxes = Math.ceil(ceilingRows * ceilingCols);
          hardwareQty = Math.ceil(ceilingBoxes * 24);
        }else if (seeyond_feature_type === 4) {
          hardwareQty = Math.ceil(this.boxes * 24);
        }
        break;

      // CEILINGS
      case '3-85-107':
        hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2);
        break;

      case '3-85-108':
        hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2);
        break;

      case '3-15-1674':
        hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2);
        break;

      case '3-15-1675':
        hardwareQty = Math.ceil(rows / 2) * Math.ceil(columns / 2);
        break;
      // END CEILINGS

      default:
        alert('Unknown hardware part: ' + hardware);
        break;
    }
    return hardwareQty;
  }

  getMaterialImage(material: string) {
    return '/assets/images/materials/' + material + '.jpg';
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
      case 0:
        name = 'Court';
        break;

      case 1:
        name = 'Cusp';
        break;

      case 2:
        name = 'Kink';
        break;

      case 3:
        name = 'Tilt';
        break;

      case 4:
        name = 'Billow';
        break;

      default:
        name = 'Pattern name not found for tessellation: ' + tessellation;
        break;
    }
    return name;
  }

  getFormattedAmount() {
    const accounting = require( 'accounting' );
    return accounting.formatMoney(this.estimated_amount);
  }

  getFormattedServicesAmount() {
    const accounting = require( 'accounting' );
    return accounting.formatMoney(this.services_amount);
  }

  getFeatureImage(seeyond_feature_type: number) {
    return this.seeyond_features[seeyond_feature_type].image;
  }

  getDimensionString() {
    let dimensionString: string;
    dimensionString = this.width + '" W x ' + this.height + '" H x ' + this.depth + '" D';
    // curved partition has radius
    if (this.seeyond_feature_type === 1) {
      dimensionString += ' x ' + this.radius + ' R';
    }

    // wall to ceiling has ceiling_length
    if (this.seeyond_feature_type === 3) {
      dimensionString += ' x ' + this.ceiling_length + ' CL';
    }
    return dimensionString;
  }

  getJsonProperties() {
    return {
      'UserInputs': {
        // 0 = straight partition, 1 = arc partition, 2 = facing, 3 = transition, 4 = ceiling, 5 = bent partition
        'Type': this.seeyond_feature_type,
        // 0 = court, 1 = cusp, 2 = kink, 3 = tilt, 4 = billow
        'Tessellation': this.tessellation,
        // valid values = .1 - 1.0 (we send whole numbers 1-10 and the tesselation divides by 10)
        'PatternStrength': this.pattern_strength,
        // relative path to rendering material image
        'Material': this.getMaterialImage(this.material),
        // in inches
        'Width': this.width,
        // in inches
        'Height': this.height,
        // in inches
        'Radius': this.radius,
        // in degrees 0-360
        'Angle':  this.angle,
        // in inches
        'Ceiling_Length': this.ceiling_length
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

      let seeyond_feature_type = 'StraightPartition';
      switch (properties.UserInputs.Type) {
        // freestanding linear
        case 0:
          seeyond_feature_type = 'Freestanding Linear';
          break;

        // freestanding curved partition
        case 1:
          seeyond_feature_type = 'Freestanding Curved';
          break;

        // wall feature
        case 2:
          seeyond_feature_type = 'Wall';
          break;

        // wall-to-ceiling partition
        case 3:
          seeyond_feature_type = 'Wall-to-Ceiling';
          break;

        // ceiling feature
        case 4:
          seeyond_feature_type = 'Ceiling Feature';
          break;

        // wall
        default:
          seeyond_feature_type = 'Wall';
      }

      xw.startElement('installationType');
      xw.text(seeyond_feature_type);
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

      if (seeyond_feature_type === 'Freestanding Curved') {
        xw.startElement('radius');
        xw.text(properties.UserInputs.Radius);
        xw.endElement('radius');
      }

      if (seeyond_feature_type === 'Wall-to-Ceiling') {
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

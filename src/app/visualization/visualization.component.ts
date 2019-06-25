import { Component, OnInit } from '@angular/core';
import { DebugService } from './../_services/debug.service';
import { Feature } from '../_features/feature';
import * as visualization from 'syd-visualization';
import * as tiling from 'syd-tiling';
import * as jszip from 'jszip';
import * as FileSaver from 'file-saver';

const packageJSON = require('../../../package.json');

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {
  private vis = visualization;
  private tiling = tiling;
  private FileSaver = FileSaver;
  private appVersion = '';
  private tilingVersion = '';
  private visualizationVersion = '';

  constructor(private debug: DebugService, public feature: Feature) {}

  ngOnInit() {
    // log the versions for future debugging purposes
    this.appVersion = packageJSON.version;
    this.tilingVersion = packageJSON.dependencies['syd-tiling'];
    this.visualizationVersion = packageJSON.dependencies['syd-visualization'];
    this.debug.log('visualization-component', 'Ceilings: ' + this.appVersion);
    this.debug.log('visualization-component', 'Syd-Tiling: ' + this.tilingVersion);
    this.debug.log('visualization-component', 'Syd-Visualization: ' + this.visualizationVersion);
    this.debug.log('visualization-component', 'Show Guide: ' + this.feature.showGuide);
    this.debug.log('visualization-component', JSON.stringify(this.feature.getUserInputs()));

    this.tiling.QT.SetUserDataPropertiesJSONString(JSON.stringify(this.feature.getUserInputs()));
    this.tiling.QT.UpdateFeature();
    const boxes = this.tiling.QT.GetBoxes();
    this.vis.QT.Visualization.SetFeatureType(this.tiling.QT.Properties.UserInputs.Type);
    // this.vis.QT.Visualization.showGuide(this.feature.showGuide);
    this.vis.QT.Visualization.visualizeTiles(
      this.tiling.QT.Properties.UserInputs.NumX,
      this.tiling.QT.Properties.UserInputs.NumY,
      boxes,
      this.tiling.QT.Properties.UserInputs.Tiles,
      50
    );
  }

  downloadImages() {
    let left = this.vis.QT.Visualization.TakeSnapshot(270);
    let back = this.vis.QT.Visualization.TakeSnapshot(180);
    let right = this.vis.QT.Visualization.TakeSnapshot(90);
    let front = this.vis.QT.Visualization.TakeSnapshot(0);
    const filename = this.feature.feature_type + '.zip';
    const zip = new jszip();

    right = right.replace(/^data:image\/(png|jpg);base64,/, '');
    front = front.replace(/^data:image\/(png|jpg);base64,/, '');
    back = back.replace(/^data:image\/(png|jpg);base64,/, '');
    left = left.replace(/^data:image\/(png|jpg);base64,/, '');

    switch (this.feature.feature_type) {
      case 'hush':
      case 'hushSwoon':
        zip.file('front.png', front, { base64: true });
        break;
      default:
        zip.file('right.png', right, { base64: true });
        zip.file('front.png', front, { base64: true });
        zip.file('back.png', back, { base64: true });
        zip.file('left.png', left, { base64: true });
        break;
    }
    zip.generateAsync({ type: 'blob' }).then(function(blob) {
      FileSaver.saveAs(blob, filename);
    });
  }
}

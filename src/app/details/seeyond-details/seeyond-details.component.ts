import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { DetailsComponent } from '../details.component';

@Component({
  selector: 'app-seeyond-details',
  templateUrl: './seeyond-details.component.html',
  styleUrls: ['../details.component.scss', './seeyond-details.component.scss']
})
export class SeeyondDetailsComponent extends DetailsComponent implements AfterContentChecked {
  dimensionsStr: string;

  ngAfterContentChecked() {
    this.setDimensionsStr();
  }

  setDimensionsStr() {
    if (!!this.design) {
      const design = this.design;
      let str = `${design.width} W x ${design.height} H`;
      if (design.name === 'ceiling') {
        str = str.replace(/H/g, 'L');
      }
      if (design.name === 'curved-partition') {
        str = `${str} x ${design.radius} R`;
      }
      if (design.name === 'wall-to-ceiling') {
        str = `${str} x ${design.ceiling_length} L`;
      }
      str = (design.units = 'inches') ? `${str} (IN)` : `${str} (CM)`;
      this.dimensionsStr = str;
    }
  }
}

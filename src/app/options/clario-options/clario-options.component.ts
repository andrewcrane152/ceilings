import { ClarioGridsService } from './../../_services/clario-grids.service';
import { Component, OnInit } from '@angular/core';
import { OptionsComponent } from 'app/options/options.component';

@Component({
  selector: 'app-clario-options',
  templateUrl: './clario-options.component.html',
  styleUrls: ['../../options/options.component.scss', './clario-options.component.scss']
})
export class ClarioOptionsComponent extends OptionsComponent implements OnInit {
  ngOnInit() {
    setTimeout(() => {
      this.gridSizeChanged(this.feature.grid_type);
    });
  }

  gridSizeChanged(selection) {
    if (!!this.feature.gridData) {
      this.feature.clearGridData();
    }
    this.clarioGrids.gridSizeSelected(selection);
  }

  tileSizeChanged(selection) {
    if (!!this.feature.gridData) {
      this.feature.clearGridData();
    }
    this.clarioGrids.tileSizeSelected(selection);
  }
}

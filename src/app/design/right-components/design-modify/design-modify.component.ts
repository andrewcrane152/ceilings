import { DesignComponent } from './../../design.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design-modify',
  templateUrl: './design-modify.component.html',
  styleUrls: ['../../design.component.scss', './design-modify.component.scss']
})
export class DesignModifyComponent extends DesignComponent implements OnInit {
  useToolsArray = true;
  ngOnInit() {
    switch (this.feature.feature_type) {
      case 'clario-cloud':
        this.useToolsArray = false;
        break;
    }
  }
}

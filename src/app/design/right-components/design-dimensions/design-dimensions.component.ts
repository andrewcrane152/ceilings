import { DesignComponent } from './../../design.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design-dimensions',
  templateUrl: './design-dimensions.component.html',
  styleUrls: ['../../design.component.scss', './design-dimensions.component.scss']
})
export class DesignDimensionsComponent extends DesignComponent implements OnInit {
  ngOnInit() {}
}

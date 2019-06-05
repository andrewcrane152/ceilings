import { DesignComponent } from './../../design.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design-canvas-grid-controls',
  templateUrl: './design-canvas-grid-controls.component.html',
  styleUrls: ['../../design.component.scss', './design-canvas-grid-controls.component.scss']
})
export class DesignCanvasGridControlsComponent extends DesignComponent implements OnInit {
  ngOnInit() {}
}

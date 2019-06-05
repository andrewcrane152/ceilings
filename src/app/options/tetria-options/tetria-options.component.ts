import { Component, OnInit } from '@angular/core';
import { OptionsComponent } from 'app/options/options.component';

@Component({
  selector: 'app-tetria-options',
  templateUrl: './tetria-options.component.html',
  styleUrls: ['../../options/options.component.scss', './tetria-options.component.scss']
})
export class TetriaOptionsComponent extends OptionsComponent {}

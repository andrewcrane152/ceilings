import { OptionsComponent } from 'app/options/options.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-right-tetria',
  templateUrl: './options-right-tetria.component.html',
  styleUrls: ['../options.component.scss', './options-right-tetria.component.scss']
})
export class OptionsRightTetriaComponent extends OptionsComponent implements OnInit {
  ngOnInit() {}
}

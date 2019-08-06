import { OptionsComponent } from 'app/options/options.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-right-velo',
  templateUrl: './options-right-velo.component.html',
  styleUrls: ['../options.component.scss', './options-right-velo.component.scss']
})
export class OptionsRightVeloComponent extends OptionsComponent implements OnInit {
  ngOnInit() {}
}

import { OptionsComponent } from 'app/options/options.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-right-hush',
  templateUrl: './options-right-hush.component.html',
  styleUrls: ['../options.component.scss', './options-right-hush.component.scss']
})
export class OptionsRightHushComponent extends OptionsComponent implements OnInit {
  ngOnInit() {}
}

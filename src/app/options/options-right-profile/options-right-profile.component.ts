import { OptionsComponent } from 'app/options/options.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options-right-profile',
  templateUrl: './options-right-profile.component.html',
  styleUrls: ['../options.component.scss', '../profile-options/profile-options.component.scss', './options-right-profile.component.scss']
})
export class OptionsRightProfileComponent extends OptionsComponent implements OnInit {
  ngOnInit() {}
}

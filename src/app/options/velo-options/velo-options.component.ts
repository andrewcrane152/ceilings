import { Component, OnInit } from '@angular/core';
import { OptionsComponent } from 'app/options/options.component';

@Component({
  selector: 'app-velo-options',
  templateUrl: './velo-options.component.html',
  styleUrls: ['../../options/options.component.scss', './velo-options.component.scss']
})
export class VeloOptionsComponent extends OptionsComponent implements OnInit {
  modifyToolsArray = ['remove'];

  ngOnInit() {
    setTimeout(() => {
      if (!this.feature.quoted) {
        this.feature.width = this.feature.units === 'inches' ? 384 : 976;
        this.feature.length = this.feature.units === 'inches' ? 240 : 610;
      }
    }, 500);
  }
}

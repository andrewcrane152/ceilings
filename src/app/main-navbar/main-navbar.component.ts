import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Feature } from 'app/_features/feature';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss']
})
export class MainNavbarComponent implements OnInit {
  constructor(public feature: Feature, public router: Router, public location: Location) {}

  ngOnInit() {}

  toggleSideNav() {
    this.feature.onToggleSideNav.emit();
  }

  goTo3Form() {
    window.location.href = 'http://www.3-form.com/';
  }

  goToFeature(feature) {
    console.log('feature:', feature);
    this.location.go(`${feature}`);
    // TODO reloading for now until reset is working
    window.location.reload();
  }
}

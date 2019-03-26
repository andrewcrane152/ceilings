import { Router } from '@angular/router';
import { Feature } from 'app/_features/feature';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss']
})
export class MainNavbarComponent implements OnInit {
  constructor(public feature: Feature, public router: Router) {}

  ngOnInit() {}

  toggleSideNav() {
    this.feature.onToggleSideNav.emit();
  }

  goTo3Form() {
    window.location.href = 'http://www.3-form.com/';
  }

  goToFeature(feature) {
    console.log('feature:', feature);
    this.router.navigate([`${feature}`]);
    // window.location.reload();
  }
}

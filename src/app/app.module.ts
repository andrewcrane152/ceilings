// core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// material.angular.io
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonToggleModule,
  MatRadioModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatDialogModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatTableModule,
  MatSidenavModule,
  MatExpansionModule,
  MatIconModule,
  MatSliderModule,
  MatMenuModule
} from '@angular/material';

// routing
import { Routing } from './app.routes';

// classes
import { Feature } from './_features/feature';
import { SeeyondFeature } from './_features/seeyond-feature';
import { ProfileFeature } from './_features/profile-feature';
import { User } from './_models/user';
import { GridSection } from './_models/grid-section';

// components
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DesignComponent } from './design/design.component';
import { OptionsComponent } from './options/options.component';
import { LandingComponent } from './landing/landing.component';
import { AlertComponent } from './alert/alert.component';
import { GridComponent } from './grid/grid.component';
import { LoadDesignComponent } from './load-design/load-design.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { SaveDesignComponent } from './save-design/save-design.component';
import { LoginComponent } from './login/login.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { TileUsageComponent } from './tile-usage/tile-usage.component';
import { QuoteDialogComponent } from './quote-dialog/quote-dialog.component';
import { DetailsComponent } from './details/details.component';
import { VeloGridComponent } from './canvas-grids/velo-grid/velo-grid.component';
import { VeloTileUsageComponent } from './velo-tile-usage/velo-tile-usage.component';
import { HushOptionsComponent } from './options/hush-options/hush-options.component';
import { VeloOptionsComponent } from './options/velo-options/velo-options.component';
import { ClarioOptionsComponent } from './options/clario-options/clario-options.component';
import { TetriaOptionsComponent } from './options/tetria-options/tetria-options.component';
import { SeeyondOptionsComponent } from './options/seeyond-options/seeyond-options.component';
import { SeeyondDesignComponent } from './design/seeyond-design/seeyond-design.component';
import { SeeyondVisualizationComponent } from './visualization/seeyond-visualization/seeyond-visualization.component';
import { SeeyondDetailsComponent } from './details/seeyond-details/seeyond-details.component';
import { QuantityComponent } from './quantity/quantity.component';
import { AddQuantityComponent } from './quantity/add-quantity/add-quantity.component';
import { RemoveQuantityComponent } from './quantity/remove-quantity/remove-quantity.component';
import { QuantityDetailsComponent } from './details/quantity-details/quantity-details.component';
import { QuantityOptionsComponent } from './quantity/quantity-options/quantity-options.component';
import { CanvasGridsComponent } from './canvas-grids/canvas-grids.component';

// services
import { DebugService } from './_services/debug.service';
import { AlertService } from './_services/alert.service';
import { ApiService } from './_services/api.service';
import { MaterialsService } from './_services/materials.service';
import { SeeyondService } from './_services/seeyond.service';
import { QuantityService } from './quantity/quantity.service';
import { ClarioGridsService } from './_services/clario-grids.service';

// pipes
import { CapitalizePipe } from './_pipes/capitalize.pipe';
import { KeysPipe } from './_pipes/keys.pipe';
import { ShortendUnitsPipe } from './_pipes/shortend-units.pipe';
import { SwoonGridComponent } from './canvas-grids/swoon-grid/swoon-grid.component';
import { ProfileOptionsComponent } from './options/profile-options/profile-options.component';
import { StyledSelectDirective } from './_directives/styled-select.directive';
import { StyledButtonDirective } from './_directives/styled-button.directive';
import { OptionsRightProfileComponent } from './options/options-right-profile/options-right-profile.component';
import { OptionsRightClarioComponent } from './options/options-right-clario/options-right-clario.component';
import { OptionsRightTetriaComponent } from './options/options-right-tetria/options-right-tetria.component';
import { OptionsRightSeeyondComponent } from './options/options-right-seeyond/options-right-seeyond.component';
import { OptionsRightHushComponent } from './options/options-right-hush/options-right-hush.component';
import { OptionsRightVeloComponent } from './options/options-right-velo/options-right-velo.component';
import { MainNavbarComponent } from './main-navbar/main-navbar.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { OptionsRightHushSwoonComponent } from './options/options-right-hush-swoon/options-right-hush-swoon.component';
import { DesignMaterialsComponent } from './design/right-components/design-design/design-design.component';
import { DesignModifyComponent } from './design/right-components/design-modify/design-modify.component';
import { DesignSeeyondComponent } from './design/right-components/design-seeyond/design-seeyond.component';
import { DesignDimensionsComponent } from './design/right-components/design-dimensions/design-dimensions.component';
import { DesignClarioDimensionsComponent } from './design/right-components/design-clario-dimensions/design-clario-dimensions.component';
import { DesignCanvasGridControlsComponent } from './design/right-components/design-canvas-grid-controls/design-canvas-grid-controls.component';
import { ClarioCloudGridComponent } from './canvas-grids/clario-cloud-grid/clario-cloud-grid.component';
import { OptionsRightClarioCloudComponent } from './options/options-right-clario-cloud/options-right-clario-cloud.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DesignComponent,
    OptionsComponent,
    LandingComponent,
    AlertComponent,
    CapitalizePipe,
    GridComponent,
    LoadDesignComponent,
    SaveDesignComponent,
    LoginComponent,
    ConfirmDeleteComponent,
    VisualizationComponent,
    TileUsageComponent,
    KeysPipe,
    QuoteDialogComponent,
    DetailsComponent,
    VeloGridComponent,
    VeloTileUsageComponent,
    HushOptionsComponent,
    VeloOptionsComponent,
    ClarioOptionsComponent,
    TetriaOptionsComponent,
    SeeyondOptionsComponent,
    SeeyondDesignComponent,
    SeeyondVisualizationComponent,
    SeeyondDetailsComponent,
    QuantityComponent,
    AddQuantityComponent,
    RemoveQuantityComponent,
    QuantityDetailsComponent,
    QuantityOptionsComponent,
    ShortendUnitsPipe,
    CanvasGridsComponent,
    SwoonGridComponent,
    ProfileOptionsComponent,
    StyledSelectDirective,
    StyledButtonDirective,
    OptionsRightProfileComponent,
    OptionsRightClarioComponent,
    OptionsRightTetriaComponent,
    OptionsRightSeeyondComponent,
    OptionsRightHushComponent,
    OptionsRightVeloComponent,
    MainNavbarComponent,
    MainFooterComponent,
    OptionsRightHushSwoonComponent,
    DesignMaterialsComponent,
    DesignModifyComponent,
    DesignSeeyondComponent,
    DesignDimensionsComponent,
    DesignClarioDimensionsComponent,
    DesignCanvasGridControlsComponent,
    ClarioCloudGridComponent,
    OptionsRightClarioCloudComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Routing,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatSidenavModule,
    MatExpansionModule,
    MatIconModule,
    MatSliderModule,
    MatMenuModule
  ],
  providers: [
    Feature,
    SeeyondFeature,
    ProfileFeature,
    User,
    DebugService,
    AlertService,
    ApiService,
    MaterialsService,
    SeeyondService,
    QuantityService,
    ClarioGridsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AlertComponent,
    OptionsComponent,
    LoadDesignComponent,
    SaveDesignComponent,
    LoginComponent,
    ConfirmDeleteComponent,
    VisualizationComponent,
    TileUsageComponent,
    VeloTileUsageComponent,
    QuoteDialogComponent,
    AddQuantityComponent,
    RemoveQuantityComponent,
    QuantityOptionsComponent
  ]
})
export class AppModule {}

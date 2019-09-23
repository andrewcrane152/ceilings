import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { OptionsComponent } from './options/options.component';
import { DesignComponent } from './design/design.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DetailsComponent } from './details/details.component';
import { QuantityComponent } from './quantity/quantity.component';
import { QuantityDetailsComponent } from './details/quantity-details/quantity-details.component';

const appRoutes: Routes = [
  // note: param1 and param2 are meant to be interchangable
  { path: '', component: LandingComponent },
  { path: ':type/design', component: DesignComponent },
  { path: ':type/quantity', component: QuantityComponent },
  { path: ':type/quantity/:param1', component: QuantityComponent },
  { path: ':type/quantity/:param1/details', component: QuantityDetailsComponent },
  { path: ':type/quantity/:param1/:param2', component: QuantityComponent },
  { path: ':type/quantity/:param1/:param2/details', component: QuantityDetailsComponent },
  { path: ':type/quantity/:param1/:param2/:param3', component: QuantityComponent },
  { path: ':type/quantity/:param1/:param2/:param3/details', component: QuantityDetailsComponent },
  { path: ':type/design/:param1', component: DesignComponent },
  { path: ':type/design/:param1/details', component: DetailsComponent },
  { path: ':type/design/:param1/:param2', component: DesignComponent },
  { path: ':type/design/:param1/:param2/details', component: DetailsComponent },
  { path: ':type/design/:param1/:param2/:param3', component: DesignComponent },
  { path: ':type/design/:param1/:param2/:param3/details', component: DetailsComponent },
  { path: 'clario', redirectTo: '/clario/design', pathMatch: 'full' },
  { path: 'tetria', redirectTo: '/tetria/design', pathMatch: 'full' },
  { path: 'seeyond', redirectTo: '/seeyond/design', pathMatch: 'full' },
  { path: 'hush-blocks', redirectTo: '/hush-blocks/design', pathMatch: 'full' },
  { path: 'velo', redirectTo: '/velo/design', pathMatch: 'full' },
  { path: 'clario-cloud', redirectTo: '/clario-cloud/design', pathMatch: 'full' },
  // { path: 'hush-swoon', redirectTo: '/hush-swoon/design', pathMatch: 'full' },
  { path: 'landing', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
// export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { enableTracing: true });
// ^^^ turns on console tracing of router events

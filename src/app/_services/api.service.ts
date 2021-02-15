import { MaterialsService } from 'app/_services/materials.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';
import { Feature } from '../_features/feature';
import { User } from '../_models/user';
import { DebugService } from './../_services/debug.service';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Location } from '@angular/common';

@Injectable()
export class ApiService {
  public onSaved = new EventEmitter();
  public onLoaded = new EventEmitter();
  public onUserLoggedIn = new EventEmitter();
  apiUrl = 'https://' + environment.API_URL + '/ceilings/';
  loginUrl = 'https://' + environment.API_URL + '/auth/login';
  pricingAccessUrl = 'https://' + environment.API_URL + '/user_branches';
  userUrl = 'https://' + environment.API_URL + '/users/';
  partSubsUrl = `https://${environment.API_URL}/parts_substitutes`;

  constructor(
    private http: HttpClient,
    private feature: Feature,
    private user: User,
    private debug: DebugService,
    private alert: AlertService,
    private location: Location,
    private materialsService: MaterialsService,
  ) {}

  get allClarioFromOverseas() {
    let allClarioFromOverseas = true;
    (Object.values(this.feature.tiles) as any).forEach(tile => {
      if (!this.materialsService.overSeasClarioPartIds.includes(tile.partId)) {
        allClarioFromOverseas = false;
      }
    });
    return allClarioFromOverseas;
  }

  get patchData() {
    const { feature } = this;
    let hushShippingInfo;
    let allClarioFromOverseas;
    const featureType = this.feature.setFeatureType(feature.feature_type);
    const currentPath = this.location.path();
    let duplicatedFromId = null;
    this.addPartIdsToTiles();
    if (currentPath.includes('duplicate')) {
      duplicatedFromId = feature.id;
    }

    if (featureType === 'hush') {
      hushShippingInfo = feature.hushShippingInfo;
    }

    if (featureType === 'clario') {
      allClarioFromOverseas = this.allClarioFromOverseas;
    }

    if (feature.is_quantity_order) {
      this.prepDataForQtyOrder();
    }

    return {
      id: feature.id,
      uid: this.user.uid,
      feature_type: featureType,
      design_name: feature.design_name,
      project_name: feature.project_name,
      specifier: feature.specifier,
      width: feature.width || 0,
      length: feature.length || 0,
      units: feature.units,
      material: feature.material,
      tile_size: feature.tile_size,
      grid_type: feature.grid_type,
      tiles: JSON.stringify(feature.tiles),
      design_data_url: feature.design_data_url,
      hardware: !!feature.hardware ? JSON.stringify(feature.hardware) : null,
      estimated_amount: feature.estimated_amount,
      services_amount: feature.services_amount,
      list_price: feature.list_price,
      discount_terms: JSON.stringify(feature.discount_terms),
      discount_amount: feature.discount_amount,
      net_price: feature.net_price,
      dealer_markup: feature.dealer_markup,
      grid_data: JSON.stringify(feature.gridData),
      quoted: feature.quoted,
      archived: feature.archived,
      quantity: feature.quantity,
      is_quantity_order: feature.is_quantity_order,
      hush_shipping_info: JSON.stringify(hushShippingInfo),
      duplicated_from_id: duplicatedFromId,
      clario_from_overseas: allClarioFromOverseas,
    }
  }

  getMyDesigns() {
    return this.http.get(this.apiUrl + 'list/' + this.user.uid).pipe(catchError(this.handleError));
  }

  getUserRep(uid: number) {
    this.debug.log('api', 'getting user rep');
    return this.http.get(this.userUrl + uid + '/rep').pipe(catchError(this.handleError));
  }

  loadDesign(id: number) {
    this.debug.log('api', 'loading design: ' + id);
    return this.http.get<any>(this.apiUrl + id);
  }

  addPartIdsToTiles(){
    const { feature } = this;
    const featureType = feature.feature_type;
    (Object.values(feature.tiles) as any).forEach(tile => {
      const partsListKey = this.getpartsListKey(tile);
      if (!!partsListKey) {
        const partIds = this.materialsService.partIds[featureType][partsListKey];
        if (partIds) {
          const material = tile.material;
          tile.partId = partIds[material];
        }
      }
    });
  }

  getpartsListKey(tile) {
    const { feature } = this;
    let key = null;
    switch (feature.feature_type) {
      case 'clario':
        key = `${tile.tile}-${feature.grid_type}`;
    }
    return key;
  }

  updateDesign() {
    this.debug.log('api', 'updating design');
    this.debug.log('api', this.feature.tiles);
    const patchData = this.patchData;

    return this.http.patch(this.apiUrl + this.feature.id, patchData).pipe(
      map((res: any) => {
        this.onSaved.emit();
        this.debug.log('api', 'emitting onSaved in updateDesign');
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  saveDesign() {
    this.debug.log('api', 'saving design');
    const patchData = this.patchData;

    return this.http.post(this.apiUrl, patchData).pipe(
      map((res: any) => {
        this.feature.isDuplicating = false;
        this.onSaved.emit();
        this.debug.log('api', 'emitting onSaved in saveDesign');
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  prepDataForQtyOrder() {
    this.feature.width = 0;
    this.feature.length = 0;
  }

  deleteDesign(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  sendEmail() {
    return this.http.get(this.apiUrl + 'email/' + this.user.uid + '/design/' + this.feature.id);
  }

  getPrices() {
    return this.http.get(this.apiUrl + 'prices').pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getPartsSubstitutes() {
    return this.http.get(this.partSubsUrl).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string) {
    this.debug.log('api', 'api login');
    const formData = {
      email: email,
      password: password
    };

    return this.http.post(this.loginUrl, formData).pipe(
      map((res: any) => {
        if (res && !res.result.error) {
          localStorage.setItem('3formUser', JSON.stringify(res.result.user));
          this.user = res.result.user;
          this.onUserLoggedIn.emit(this.user);
          return res;
        } else {
          this.alert.apiAlert(res.result.error);
        }
      }),
      catchError(res => {
        this.alert.error(res.error.result.message);
        return 'error';
      })
    );
  }

  checkToShowPricing() {
    if (!!localStorage.getItem('3formUser')) {
      this.checkToShowVariaInVelo();
      this.checkAccessToPricing().subscribe(
        data => {
          if (!!data.result) {
            this.feature.showPricing = data.result.access;
          }
        },
        error => {
          console.log('denied pricing access');
        }
      );
    }
  }

  checkToShowVariaInVelo() {
    const UID_ACCESS_VARIA_IN_VELO = [
      432355,
      44345,
      166792,
      337074
    ];
    const user = JSON.parse(localStorage.getItem('3formUser'));
    this.feature.showVariaInVelo = (!!user && !!user.uid) ?
      UID_ACCESS_VARIA_IN_VELO.includes(user.uid) :
      false;
  }

  checkAccessToPricing() {
    const userInfo = JSON.parse(localStorage.getItem('3formUser'));
    const uid = !!userInfo ? userInfo.uid : '';
    const accessUrl = `${this.pricingAccessUrl}?ids[]=${uid}`;

    return this.http.get(accessUrl, {}).pipe(
      map((res: any) => {
        let userBranchInfo;
        if (!!res) {
          if (!!res.user_branches) {
              userBranchInfo = res.user_branches[0]
            if (!!userBranchInfo.employee_id || userBranchInfo.branch.designation === 'Dealer Partner') {
              userInfo['showPricing'] = true;
              this.feature.showPricing = true;
              localStorage.setItem('3formUser', JSON.stringify(userInfo));
            }
          }
          if (!!res[0]) {
            if ((!!res[0].employee && !!res[0].employee.id)
              || (!!res[0].branch && res[0].branch.designation && res[0].branch.designation === 'Dealer Partner')
            ) {
              userInfo['showPricing'] = true;
              this.feature.showPricing = true;
              localStorage.setItem('3formUser', JSON.stringify(userInfo));
            }
          }

        // if (!!res) {
        //   let userData = res.users[0] || res.user_branches[0] || res[0] || '';
        //   if (userData) {
        //     if (!!res.user_branches) {
        //       userData = res.user_branches[0]
        //       if (!!userData.employee_id || userData.branch.designation === 'Dealer Partner') {
        //         this.setShowPricing();
        //       }
        //     }

        //     if (!!res[0]) {
        //       if ((!!res[0].employee && !!res[0].employee.id)
        //         || (!!res[0].branch && res[0].branch.designation && res[0].branch.designation === 'Dealer Partner')
        //       ) {
        //       this.setShowPricing();
        //       }
        //     }
        //     if ((userData.employee && userData.employee.id)
        //         || (userData.branch && userData.branch.designation === 'Dealer Partner')
        //     ) {
        //       this.setShowPricing();
        //       }
        //     }
          return res;
        } else {
          this.alert.apiAlert(res.result.error);
        }
      }),
      catchError(res => {
        return 'error';
      })
    );
  }


  setShowPricing() {
    const userInfo = JSON.parse(localStorage.getItem('3formUser'));
    userInfo['showPricing'] = true;
    this.feature.showPricing = true;
    localStorage.setItem('3formUser', JSON.stringify(userInfo));
  }

  logout() {
    localStorage.removeItem('3formUser');
    this.user = new User();
  }

  public handleError(error: HttpErrorResponse) {
    // if (error.status === 500) { this.debug.log('api', error.message); return; }
    // if (!!error.error.result.message) { this.alert.error(error.error.result.message); }
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('api', `An error occurred: ${error.error}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log('api', `Backend returned code ${error.status}, body was: ${error.message}`);
    }
    // return an ErrorObservable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

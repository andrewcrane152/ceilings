import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';
import { Feature } from '../_features/feature';
import { User } from '../_models/user';
import { DebugService } from './../_services/debug.service';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ApiService {
  public onSaved = new EventEmitter();
  public onLoaded = new EventEmitter();
  public onUserLoggedIn = new EventEmitter();
  apiUrl = 'https://' + environment.API_URL + '/ceilings/';
  loginUrl = 'https://' + environment.API_URL + '/auth/login';
  userUrl = 'https://' + environment.API_URL + '/users/';
  partSubsUrl = `https://${environment.API_URL}/parts_substitutes`;

  constructor(private http: HttpClient, private feature: Feature, private user: User, private debug: DebugService, private alert: AlertService) {}

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

  updateDesign() {
    this.debug.log('api', 'updating design');
    // we can't forget about the hardware...
    this.debug.log('api', this.feature.tiles);
    if (this.feature.is_quantity_order) {
      this.prepDataForQtyOrder();
    }
    const patchData = {
      id: this.feature.id,
      uid: this.user.uid,
      feature_type: this.feature.feature_type,
      design_name: this.feature.design_name,
      project_name: this.feature.project_name,
      specifier: this.feature.specifier,
      width: this.feature.width || 0,
      length: this.feature.length || 0,
      units: this.feature.units,
      material: this.feature.material,
      tile_size: this.feature.tile_size,
      grid_type: this.feature.grid_type,
      tiles: JSON.stringify(this.feature.tiles),
      design_data_url: this.feature.design_data_url,
      hardware: !!this.feature.hardware ? JSON.stringify(this.feature.hardware) : null,
      estimated_amount: this.feature.estimated_amount,
      services_amount: this.feature.services_amount,
      grid_data: JSON.stringify(this.feature.gridData),
      quoted: this.feature.quoted,
      archived: this.feature.archived,
      quantity: this.feature.quantity,
      is_quantity_order: this.feature.is_quantity_order
    };

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
    const featureType = this.feature.setFeatureType(this.feature.feature_type);
    if (this.feature.is_quantity_order) {
      this.prepDataForQtyOrder();
    }
    const patchData = {
      uid: this.user.uid,
      feature_type: featureType,
      design_name: this.feature.design_name,
      project_name: this.feature.project_name,
      specifier: this.feature.specifier,
      width: this.feature.width || 0,
      length: this.feature.length || 0,
      units: this.feature.units,
      material: this.feature.material,
      tile_size: this.feature.tile_size,
      grid_type: this.feature.grid_type,
      tiles: JSON.stringify(this.feature.tiles),
      design_data_url: this.feature.design_data_url,
      hardware: !!this.feature.hardware ? JSON.stringify(this.feature.hardware) : null,
      estimated_amount: this.feature.estimated_amount,
      services_amount: this.feature.services_amount,
      grid_data: JSON.stringify(this.feature.gridData),
      quoted: this.feature.quoted,
      archived: this.feature.archived,
      quantity: this.feature.quantity,
      is_quantity_order: this.feature.is_quantity_order
    };

    return this.http.post(this.apiUrl, patchData).pipe(
      map((res: any) => {
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

  logout() {
    localStorage.removeItem('3formUser');
    this.user = new User();
  }

  public handleError(error: HttpErrorResponse) {
    // if (error.status === 500) { this.debug.log('api', error.message); return; }
    // if (!!error.error.result.message) { this.alert.error(error.error.result.message); }
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this.debug.log('api', `An error occurred: ${error.error}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this.debug.log('api', `Backend returned code ${error.status}, body was: ${error.message}`);
    }
    // return an ErrorObservable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

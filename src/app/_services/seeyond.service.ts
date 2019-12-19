import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

import { AlertService } from './alert.service';
import { ApiService } from './api.service';
import { MaterialsService } from './materials.service';
import { DebugService } from './debug.service';
import { environment } from './../../environments/environment';
import { SeeyondFeature } from 'app/_features/seeyond-feature';
import { User } from './../_models/user';

import { Observable ,  throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable()
export class SeeyondService {
  onSaved = new EventEmitter();
  onLoaded = new EventEmitter();
  apiUrl = 'https://' + environment.API_URL + '/seeyonds/';

  constructor(
    private http: HttpClient,
    private seeyond: SeeyondFeature,
    private user: User,
    public debug: DebugService,
    private materials: MaterialsService,
    private api: ApiService,
    private alert: AlertService,
    private location: Location
  ) {}

  getMyFeatures() {
    return this.http.get(this.apiUrl + 'list/' + this.user.uid).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  loadFeature(id: number) {
    this.debug.log('seeyond', 'Loading Feature');
    return this.http.get(this.apiUrl + id).pipe(
      map((res: Response) => {
        this.debug.log('seeyond', res);
        this.onLoaded.emit();
        this.debug.log('seeyond', 'emitting onLoaded');
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateFeature() {
    this.debug.log('seeyond', this.seeyond.hardware);
    let duplicatedFromId;
    const currentPath = this.location.path();
    if (currentPath.includes('duplicate')) {
      duplicatedFromId = this.seeyond.id;
      // this.seeyond.quoted = false;
    }
    const hardware = JSON.stringify({ hardware: this.seeyond.hardware });
    const profileImg = this.seeyond.seeyondProfileImage();
    this.replaceOldPartIds();
    this.debug.log('seeyond', hardware);
    const patchData = {
      id: this.seeyond.id,
      uid: this.user.uid,
      feature_type: this.seeyond.seeyond_feature_index,
      title: this.seeyond.title,
      name: this.seeyond.name,
      design_name: this.seeyond.design_name,
      project_name: this.seeyond.project_name,
      specifier: this.seeyond.specifier,
      units: this.seeyond.units,
      width: this.seeyond.width,
      height: this.seeyond.height,
      radius: this.seeyond.radius,
      angle: this.seeyond.angle,
      ceiling_length: this.seeyond.ceiling_length,
      depth: this.seeyond.depth,
      tessellation: this.seeyond.tessellation,
      pattern_strength: this.seeyond.pattern_strength,
      material: this.seeyond.material,
      sheet_part_id: this.seeyond.sheet_part_id,
      boxsize: this.seeyond.boxsize,
      boxes: this.seeyond.boxes,
      sheets: this.seeyond.sheets,
      xml: this.seeyond.xml,
      cove_lighting: this.seeyond.cove_lighting,
      front_relief: this.seeyond.front_relief,
      back_relief: this.seeyond.back_relief,
      random_seed: this.seeyond.random_seed,
      services_amount: this.seeyond.services_amount,
      estimated_amount: this.seeyond.estimated_amount,
      list_price: this.seeyond.list_price,
      discount_terms: JSON.stringify(this.seeyond.discount_terms),
      discount_amount: this.seeyond.discount_amount,
      net_price: this.seeyond.net_price,
      dealer_markup: this.seeyond.dealer_markup,
      quoted: this.seeyond.quoted,
      archived: this.seeyond.archived,
      hardware: this.seeyond.hardware,
      linear_feet: this.seeyond.linear_feet,
      design_data_url: profileImg,
      quantity: this.seeyond.quantity,
      duplicated_from_id: duplicatedFromId
    };
    this.debug.log('seeyond', patchData);

    return this.http.patch(this.apiUrl + this.seeyond.id, patchData).pipe(
      map((res: any) => {
        this.seeyond.isDuplicating = false;
        this.onSaved.emit();
        this.debug.log('seeyond', 'emitting onSaved');
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  saveFeature() {
    const profileImg = this.seeyond.seeyondProfileImage();
    let duplicatedFromId;
    const currentPath = this.location.path();
    if (currentPath.includes('duplicate')) {
      duplicatedFromId = this.seeyond.id;
      // this.seeyond.quoted = false;
    }
    this.replaceOldPartIds();
    const patchData = {
      uid: this.user.uid,
      feature_type: this.seeyond.seeyond_feature_index,
      title: this.seeyond.title,
      name: this.seeyond.name,
      design_name: this.seeyond.design_name,
      project_name: this.seeyond.project_name,
      specifier: this.seeyond.specifier,
      units: this.seeyond.units,
      width: this.seeyond.width,
      height: this.seeyond.height,
      radius: this.seeyond.radius,
      angle: this.seeyond.angle,
      ceiling_length: this.seeyond.ceiling_length,
      depth: this.seeyond.depth,
      tessellation: this.seeyond.tessellation,
      pattern_strength: this.seeyond.pattern_strength,
      material: this.seeyond.material,
      sheet_part_id: this.seeyond.sheet_part_id,
      boxsize: this.seeyond.boxsize,
      boxes: this.seeyond.boxes,
      sheets: this.seeyond.sheets,
      xml: this.seeyond.xml,
      cove_lighting: this.seeyond.cove_lighting,
      front_relief: this.seeyond.front_relief,
      back_relief: this.seeyond.back_relief,
      random_seed: this.seeyond.random_seed,
      services_amount: this.seeyond.services_amount,
      estimated_amount: this.seeyond.estimated_amount,
      list_price: this.seeyond.list_price,
      discount_terms: JSON.stringify(this.seeyond.discount_terms),
      discount_amount: this.seeyond.discount_amount,
      net_price: this.seeyond.net_price,
      dealer_markup: this.seeyond.dealer_markup,
      quoted: this.seeyond.quoted,
      archived: this.seeyond.archived,
      hardware: this.seeyond.hardware,
      linear_feet: this.seeyond.linear_feet,
      design_data_url: profileImg,
      quantity: this.seeyond.quantity,
      duplicated_from_id: duplicatedFromId
    };

    return this.http.post(this.apiUrl, patchData).pipe(
      map((res: Response) => {
        this.seeyond.isDuplicating = false;
        this.onSaved.emit();
        this.debug.log('seeyond', 'emitting onSaved');
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  deleteFeature(id: number) {
    return this.http.delete(this.apiUrl + id);
  }

  sendEmail() {
    return this.http.get(this.apiUrl + 'email/' + this.user.uid + '/feature/' + this.seeyond.id).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getPrices() {
    return this.http.get(this.apiUrl + 'prices').pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  private replaceOldPartIds() {
    const partId = this.seeyond.sheet_part_id;
    const replacementsArray = this.materials.parts_substitutes;
    if (!!replacementsArray) {
      replacementsArray.map(obj => {
        const today = this.formattedTimeStamp();
        const todayFmt = new Date(Number(today[0]), Number(today[1]), Number(today[2]));
        const effectiveArr = !!obj.effectiveDate ? obj.effectiveDate.split('-') : [];
        const effectiveDate = new Date(Number(effectiveArr[0]), Number(effectiveArr[1]), Number(effectiveArr[2]));
        const isEffective = effectiveDate.getTime() <= todayFmt.getTime();
        if (obj.partId === partId && isEffective) {
          this.debug.log('seeyond', `replacing sheet_part_id ${this.seeyond.sheet_part_id} with ${partId}`);
          this.seeyond.sheet_part_id = obj.replacementPartId;
        }
      });
    }
  }

  formattedTimeStamp() {
    // returns today in [yyyy, mm, dd];
    const d = new Date();
    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day];
  }

  public handleError(error: HttpErrorResponse) {
    console.log(error);
    // if (error.status === 500) {
    //   this.debug.log('api', error.message);
    //   return;
    // }
    // // if (!!error.error.result.message) { this.alert.error(error.error.result.message); }
    // if (error.error instanceof ErrorEvent) {
    //   // A client-side or network error occurred. Handle it accordingly.
    //   this.debug.log('api', `An error occurred: ${error.statusText}`);
    // } else {
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong,
    //   this.debug.log('api', `Backend returned code ${error.status}, body was: ${error.message}`);
    // }
    // return an ErrorObservable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

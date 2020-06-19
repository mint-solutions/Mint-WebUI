import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { BusinessLocationModel } from './business-location.model';

const routes = {
  createBusinessLocation: '/businesslocation/stores',
  getBusinessLocation: '/company/getallbusiness',
  updateBusinessLocation: '/businesslocation',
  deleteBusinessLocation: '/businesslocation'
};

@Injectable({
  providedIn: 'root'
})
export class BusinessLocationService extends BaseService<BusinessLocationModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getBusinessLocations(): Observable<any> {
    return this.sendGet(routes.getBusinessLocation);
  }

  createBusinessLocation(payload: BusinessLocationModel): Observable<any> {
    return this.sendPost(routes.createBusinessLocation, payload);
  }

  updateBusinessLocation(payload: BusinessLocationModel): Observable<any> {
    return this.sendPatch(`${routes.updateBusinessLocation}/${payload.id}/updateBusinessLocation`, payload);
  }

  deleteBusinessLocation(id: number): Observable<any> {
    return this.sendDelete(`${routes.deleteBusinessLocation}/${id}/deleteBusinessLocation`);
  }
}

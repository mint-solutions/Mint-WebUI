import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { BusinessLocationModel } from './business-location.model';

const routes = {
  createBusinessLocation: '/businesslocation/stores',
  getAllBusiness: '/company/getallbusiness',
  getBusinessLocation: '/businesslocation',
  getMyBusinessLocations: '/businesslocation/mybusinesslocations',
  updateBusinessLocation: '/businesslocation',
  deleteBusinessLocation: '/businesslocation',
  activateBusiness: '/company/changecompanystatus'
};

@Injectable({
  providedIn: 'root'
})
export class BusinessLocationService extends BaseService<BusinessLocationModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getAllBusiness(): Observable<any> {
    return this.sendGet(routes.getAllBusiness);
  }

  getBusinessLocations(businessId: string): Observable<any> {
    return this.sendGet(`${routes.getBusinessLocation}/${businessId}/true`);
  }

  getMyBusinessLocations(): Observable<any> {
    return this.sendGet(routes.getMyBusinessLocations);
  }

  createBusinessLocation(payload: BusinessLocationModel): Observable<any> {
    return this.sendPost(routes.createBusinessLocation, payload);
  }

  updateBusinessLocation(payload: BusinessLocationModel): Observable<any> {
    return this.sendPatch(`${routes.updateBusinessLocation}/${payload.id}/updateBusinessLocation`, payload);
  }

  updateBusinessStatus(payload: { id: string; status: boolean }): Observable<any> {
    return this.sendPatch(`${routes.activateBusiness}/${payload.id}/${payload.status}`, payload);
  }

  deleteBusinessLocation(id: number): Observable<any> {
    return this.sendDelete(`${routes.deleteBusinessLocation}/${id}/deleteBusinessLocation`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { SupplierModel } from './supplier.model';

const routes = {
  createSupplier: '/partners/supplier/creat',
  getSupplier: '/partners/supplier',
  getSuppliers: '/partners/supplier/mycustomer',
  updateSupplier: '/partners/supplier',
  deleteSupplier: '/partners/supplier'
};

@Injectable()
export class SupplierService extends BaseService<SupplierModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getsupplier(id: number): Observable<any> {
    return this.sendGet(`${routes.getSupplier}/${id}`);
  }

  getsuppliers(): Observable<any> {
    return this.sendGet(routes.getSuppliers);
  }

  createsupplier(payload: SupplierModel): Observable<any> {
    return this.sendPost(routes.createSupplier, payload);
  }

  updatesupplier(payload: SupplierModel): Observable<any> {
    return this.sendPatch(`${routes.updateSupplier}/${payload.id}/updatesupplier`, payload);
  }

  deletesupplier(id: number): Observable<any> {
    return this.sendDelete(`${routes.deleteSupplier}/${id}/deletesupplier`);
  }
}

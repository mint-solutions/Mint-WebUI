import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { SupplierModel } from './supplier.model';

const routes = {
  createSupplier: '/supplier/creat',
  getSupplier: '/supplier',
  getSuppliers: '/supplier/mysupplier',
  updateSupplier: '/supplier',
  deleteSupplier: '/supplier'
};

@Injectable({ providedIn: 'root' })
export class SupplierService extends BaseService<SupplierModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getsupplier(id: number): Observable<any> {
    return this.sendGet(`${routes.getSupplier}/${id}`);
  }

  getsuppliers(pageNum = 1): Observable<any> {
    return this.sendGet(routes.getSuppliers, { params: { page: pageNum } });
  }

  createsupplier(payload: SupplierModel): Observable<any> {
    return this.sendPost(routes.createSupplier, payload);
  }

  updatesupplier(payload: SupplierModel): Observable<any> {
    return this.sendPatch(`${routes.updateSupplier}/${payload.id}/update`, payload);
  }

  deletesupplier(id: number): Observable<any> {
    return this.sendDelete(`${routes.deleteSupplier}/${id}/delete`);
  }
}

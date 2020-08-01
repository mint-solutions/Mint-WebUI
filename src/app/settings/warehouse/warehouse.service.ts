import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { WarehouseModel } from './warehouse.model';

const routes = {
  createWarehouse: '/warehouse/create',
  getWarehouses: '/warehouse/false',
  updateWarehouse: '/warehouse',
  deleteWarehouse: '/warehouse'
};

@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends BaseService<WarehouseModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getAllWarehouses(): Observable<any> {
    return this.sendGet(routes.getWarehouses);
  }

  createWarehouse(payload: WarehouseModel): Observable<any> {
    return this.sendPost(routes.createWarehouse, payload);
  }

  updateWarehouse(payload: WarehouseModel): Observable<any> {
    return this.sendPatch(`${routes.updateWarehouse}/${payload.id}/updatewarehouse`, payload);
  }

  deleteWarehouse(id: number): Observable<any> {
    return this.sendDelete(`${routes.deleteWarehouse}/deletwarehouse/${id}`);
  }
}

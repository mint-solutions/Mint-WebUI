import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/core/base.service';
import { SalesOrderHeaderModel } from './sales-order.model';
import { Observable } from 'rxjs';

const routes = {
  getSalesOrders: '/purchaseOrder/getmypurchaseOrders',
  getPacking: '/purchaseOrder/getpacking',
  createSalesOrder: '​/purchaseorder/creatpurchaseheader',
  updateSalesOrder: '/purchaseOrder',
  deleteSalesOrder: '/purchaseOrder',
  updateSalesOrderConfig: '/purchaseOrder'
};

@Injectable({ providedIn: 'root' })
export class SalesOrderService extends BaseService<SalesOrderHeaderModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getSalesOrders(): Observable<any> {
    return this.sendGet(`${routes.getSalesOrders}`);
  }
  getPacking(): Observable<any> {
    return this.sendGet(`${routes.getPacking}`);
  }
  createSalesOrder(payload: SalesOrderHeaderModel): Observable<any> {
    console.log(routes.createSalesOrder);
    return this.sendPost('/purchaseorder/creatpurchaseheader', payload);
  }
  updateSalesOrder(payload: SalesOrderHeaderModel): Observable<any> {
    return this.sendPatch(`${routes.updateSalesOrder}/${payload.id}/updatepurchaseOrder`, payload);
  }
  deleteSalesOrder(id: string): Observable<any> {
    return this.sendDelete(`${routes.deleteSalesOrder}/${id}/deletepurchaseOrder`);
  }
  updateSalesOrderConfig(configs: any, payload: any): Observable<any> {
    return this.sendPatch(
      `${routes.updateSalesOrderConfig}/${configs.id}/${configs.status}/updatepurchaseOrderconfig`,
      payload
    );
  }
}

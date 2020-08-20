import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/core/base.service';
import { PurchaseOrderHeaderModel } from './purchase-order.model';
import { Observable } from 'rxjs';

const routes = {
  getpurchaseOrders: '/purchaseOrder/getmypurchaseOrders',
  getpacking: '/purchaseOrder/getpacking',
  createPurchaseOrder: '​/purchaseorder/creatpurchaseOrder',
  updatePurchaseOrder: '/purchaseOrder',
  deletePurchaseOrder: '/purchaseOrder',
  updatePurchaseOrderConfig: '/purchaseOrder'
};

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService extends BaseService<PurchaseOrderHeaderModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getPurchaseOrders(): Observable<any> {
    return this.sendGet(`${routes.getpurchaseOrders}`);
  }
  getPacking(): Observable<any> {
    return this.sendGet(`${routes.getpacking}`);
  }
  createPurchaseOrder(payload: PurchaseOrderHeaderModel): Observable<any> {
    return this.sendPost('/purchaseorder/creatpurchaseOrder', payload);
  }
  updatePurchaseOrder(payload: PurchaseOrderHeaderModel): Observable<any> {
    return this.sendPatch(`${routes.updatePurchaseOrder}/${payload.id}/updatepurchaseOrder`, payload);
  }
  deletePurchaseOrder(id: string): Observable<any> {
    return this.sendDelete(`${routes.deletePurchaseOrder}/${id}/deletepurchaseOrder`);
  }
  updatePurchaseOrderConfig(configs: any, payload: any): Observable<any> {
    return this.sendPatch(
      `${routes.updatePurchaseOrderConfig}/${configs.id}/${configs.status}/updatepurchaseOrderconfig`,
      payload
    );
  }
}

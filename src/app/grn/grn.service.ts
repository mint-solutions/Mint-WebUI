import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/core/base.service';
import { PurchaseOrderHeaderModel } from './grn.model';
import { Observable } from 'rxjs';

const routes = {
  getGrns: '/purchaseorder/getpurchaseinfo',
  getpacking: '/purchaseOrder/getpacking',
  createPurchaseOrder: '​/purchaseorder/creatpurchaseOrder',
  updatePurchaseOrder: '/purchaseorder',
  approvePurchaseOrder: '/purchaseorder/approvepurchaseOrder',
  deletePurchaseOrder: '/purchaseOrder',
  updatePurchaseOrderConfig: '/purchaseOrder',
  convertToGrn: '/purchaseorder'
};

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService extends BaseService<PurchaseOrderHeaderModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getGrns(payload: any): Observable<any> {
    return this.sendPost(routes.getGrns, payload);
  }
  getPacking(): Observable<any> {
    return this.sendGet(`${routes.getpacking}`);
  }
  createPurchaseOrder(payload: PurchaseOrderHeaderModel): Observable<any> {
    return this.sendPost('/purchaseorder/creatpurchaseOrder', payload);
  }
  updatePurchaseOrder(payload: PurchaseOrderHeaderModel): Observable<any> {
    return this.sendPost(`${routes.updatePurchaseOrder}/${payload.id}/updatepurchaseOrder`, payload);
  }
  updateGrn(payload: PurchaseOrderHeaderModel): Observable<any> {
    return this.sendPost(`${routes.updatePurchaseOrder}/postGrn`, payload);
  }
  approvePurchaseOrder(payload: any): Observable<any> {
    return this.sendPost(routes.approvePurchaseOrder, payload);
  }
  convertToGrn(purchaserrderId: string): Observable<any> {
    return this.sendPost(`${routes.convertToGrn}/${purchaserrderId}/convertTogrn`, { purchaserrderId });
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

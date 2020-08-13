import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/core/base.service';
import { PaymentTermsHeaderModel } from './payment-terms.model';
import { Observable } from 'rxjs';

const routes = {
  getPaymentTerms: '/settings/paymentterms'
};

@Injectable({ providedIn: 'root' })
export class SalesOrderService extends BaseService<PaymentTermsHeaderModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getSalesOrders(): Observable<any> {
    return this.sendGet(`${routes.getPaymentTerms}`);
  }
}

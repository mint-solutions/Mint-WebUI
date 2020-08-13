import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/core/base.service';
import { PaymentTermsHeaderModel } from './payment-terms.model';
import { Observable } from 'rxjs';

const routes = {
  getPaymentTerms: '/settings/getpaymentterms'
};

@Injectable({ providedIn: 'root' })
export class PaymentTermsService extends BaseService<PaymentTermsHeaderModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getPaymentTerms(): Observable<any> {
    return this.sendGet(`${routes.getPaymentTerms}`);
  }
}

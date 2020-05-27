import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { CustomerModel } from './customer.model';

const routes = {
  createCustomer: '/partners/customer/creat',
  getCustomer: '/partners/customer',
  getCustomers: '/partners/customer/mycustomer',
  updateCustomer: '/partners',
  deleteCustomer: '/partners/customer'
};

@Injectable()
export class CustomerService extends BaseService<CustomerModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getCustomer(id: number): Observable<any> {
    return this.sendGet(`${routes.getCustomer}/${id}`);
  }

  getCustomers(): Observable<any> {
    return this.sendGet(routes.getCustomers);
  }

  createCustomer(payload: CustomerModel): Observable<any> {
    return this.sendPost(routes.createCustomer, payload);
  }

  updateCustomer(payload: CustomerModel): Observable<any> {
    return this.sendPatch(`${routes.updateCustomer}/${payload.id}/customer/update`, payload);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.sendDelete(`${routes.deleteCustomer}/${id}/deleteCustomer`);
  }
}

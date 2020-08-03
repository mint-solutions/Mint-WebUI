import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { TaxModel } from './tax.model';

const routes = {
  createTax: '/settings/createTax',
  getTaxes: '/settings/getTax',
  updateTax: '/settings/updateTax',
  deleteTax: '/settings/deleteTax'
};

@Injectable({
  providedIn: 'root'
})
export class TaxService extends BaseService<TaxModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getAllTax(): Observable<any> {
    return this.sendGet(routes.getTaxes);
  }
  createTax(payload: TaxModel): Observable<any> {
    return this.sendPost(routes.createTax, payload);
  }

  updateTax(payload: TaxModel): Observable<any> {
    return this.sendPatch(`${routes.updateTax}/${payload.id}`, payload);
  }

  deleteTax(id: number): Observable<any> {
    return this.sendDelete(`${routes.deleteTax}/${id}`);
  }
}

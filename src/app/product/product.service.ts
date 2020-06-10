import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/core/base.service';
import { ProductModel } from './product.model';
import { Observable } from 'rxjs';

const routes = {
  getproducts: '/product/getmyproducts',
  getpacking: '/product/getpacking',
  createproducts: '/product/create',
  updateproduct: '/product'
};

@Injectable()
export class ProductService extends BaseService<ProductModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getProducts(): Observable<any> {
    return this.sendGet(`${routes.getproducts}`);
  }
  getPacking(): Observable<any> {
    return this.sendGet(`${routes.getpacking}`);
  }
  createProduct(payload: ProductModel): Observable<any> {
    return this.sendPost(routes.createproducts, payload);
  }
  updateproduct(payload: ProductModel): Observable<any> {
    return this.sendPatch(`${routes.updateproduct}/${payload.id}/updateproduct`, payload);
  }
}

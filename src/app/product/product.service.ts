import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@app/core/base.service';
import { ProductModel } from './product.model';
import { Observable } from 'rxjs';

const routes = {
  getproducts: '/product/getmyproducts',
  getProductsForSale: '/product/getProductForSale',
  getpacking: '/product/getpacking',
  createproducts: '/product/create',
  updateproduct: '/product',
  deleteproduct: '/product',
  updateproductConfig: '/product'
};

@Injectable()
export class ProductService extends BaseService<ProductModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getProducts(): Observable<any> {
    return this.sendGet(`${routes.getproducts}`);
  }
  getProductsForSale(): Observable<any> {
    return this.sendGet(`${routes.getProductsForSale}`);
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
  deleteproduct(id: string): Observable<any> {
    return this.sendDelete(`${routes.deleteproduct}/${id}/deleteproduct`);
  }
  updateproductConfig(configs: any, payload: any): Observable<any> {
    return this.sendPatch(`${routes.updateproductConfig}/${configs.id}/${configs.status}/updateproductconfig`, payload);
  }
}

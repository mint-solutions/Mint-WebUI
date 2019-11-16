import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { CategoryModel } from './category.model';

const routes = {
  createCategory: '/categorys/creat',
  getCategory: '/categorys/mycategory',
  getCategories: '/categorys/mycategory',
  updateCategory: '/categorys',
  deleteCategory: '/categorys'
};

@Injectable()
export class CategoryService extends BaseService<CategoryModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  geCategory(id: number): Observable<any> {
    return this.sendGet(`${routes.getCategory}/${id}`);
  }

  getCategories(): Observable<any> {
    return this.sendGet(routes.getCategories);
  }

  createCategory(payload: CategoryModel): Observable<any> {
    return this.sendPost(routes.createCategory, payload);
  }

  updateCategory(payload: CategoryModel): Observable<any> {
    return this.sendPut(`${routes.updateCategory}/{payload.id}/updatecategory`, payload);
  }

  deleteCategory(id: number): Observable<any> {
    return this.sendDelete(`${routes.deleteCategory}/${id}/deletecategory`);
  }
}

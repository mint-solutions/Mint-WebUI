import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '@app/core/base.service';
import { UserModel } from './user.model';

const routes = {
  createuser: '/merchantuseraccount/signuplink',
  getuser: '/user'
};

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserModel> {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  getusers(businessId: string): Observable<any> {
    return this.sendGet(`${routes.getuser}/${businessId}/true`);
  }

  createuser(payload: UserModel): Observable<any> {
    return this.sendPost(routes.createuser, payload);
  }
}

import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  forgetPassword: '/Auth/forgotpassword'
};

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService extends BaseService<any> {
  constructor(public http: HttpClient) {
    super(http);
  }

  forgetPassword(payload: any): Observable<any> {
    return this.sendPost(this.baseUrl(routes.forgetPassword), payload);
  }
}

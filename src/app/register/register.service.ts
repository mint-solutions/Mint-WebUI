import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface IRegResponse {
  responseCode: string;
  message: string;
  responseData: any;
}

const routes = {
  userRegistration: '/account/signup'
};

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends BaseService<IRegister> {
  constructor(http: HttpClient) {
    super(http);
  }

  userRegistration(payload: any): Observable<IRegister> {
    return this.sendPost(routes.userRegistration, payload);
  }
}

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
  adminRegistration: '/account/SupperAdminSigup'
};

@Injectable({
  providedIn: 'root'
})
export class SignupService extends BaseService<IRegister> {
  constructor(http: HttpClient) {
    super(http);
  }

  adminRegistration(payload: any): Observable<IRegister> {
    return this.sendPost(routes.adminRegistration, payload);
  }
}

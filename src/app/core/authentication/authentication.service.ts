import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';

export interface ILoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

const routes = {
  userLogin: '/auth/login',
  accountActivation: ''
};

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService extends BaseService<ILoginContext> {
  constructor(private credentialsService: CredentialsService, private http: HttpClient) {
    super(http);
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: ILoginContext): Observable<ILoginContext> {
    return this.sendPost(routes.userLogin, context);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}

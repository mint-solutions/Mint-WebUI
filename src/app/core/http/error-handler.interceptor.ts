import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';
import { ToastrService } from 'ngx-toastr';
import { LogoutService } from '@app/core/authentication/logout.service';

const log = new Logger('ErrorHandlerInterceptor');
/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private logoutService: LogoutService, private toastr: ToastrService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpErrorResponse): Observable<HttpEvent<any>> {
    /*if (!environment.production) {
      // Do something with the error
      if (response.status === 401 || response.status === 504) {
        this.toastr.error('Your Login had expired', 'ERROR!');
        this.logoutService.logout().subscribe();
      }
    }*/

    if (response.status === 401 || response.status === 504) {
      this.toastr.error(response.error.message, 'ERROR!');
      console.log(response);
      this.logoutService.logout().subscribe();
    }

    throw response;
  }

  // Customize the default error handler here if needed
  // private errorHandler(response: HttpErrorResponse): Observable<HttpEvent<any>> {
  //   if (!environment.production) {
  //     // Do something with the error
  //     log.error('Request error', response.status);
  //     if (response.status === 401 || response.status === 504) {
  //       this.toastr.error('Your Login had expired', 'ERROR!');
  //       this.authenticationService
  //         .logout()
  //         .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  //     }
  //   }
  //   throw response;
  // }
}

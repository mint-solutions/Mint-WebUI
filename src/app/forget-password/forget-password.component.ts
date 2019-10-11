import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@app/core/i18n.service';
import { AuthenticationService, ILoginContext } from '@app/core/authentication/authentication.service';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';
import { Logger } from '@app/core/logger.service';
import { ForgetPasswordService } from '@app/forget-password/forget-password.service';

const log = new Logger('forget password');

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  // version: string = environment.version;
  error: string | undefined;
  loginForm: FormGroup;
  isLoading = false;
  disableBtn = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private fpService: ForgetPasswordService,
    private credentialsService: CredentialsService,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  login() {
    this.isLoading = true;
    const login$ = this.fpService.forgetPassword(this.buildLoginPayload(this.loginForm.value));
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.toastr.success(res.message, 'Please check your mail');
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
          } else {
            this.toastr.error(res.message);
          }
        },
        error => {
          this.toastr.error(error.message);
          this.error = error;
        }
      );
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  buildLoginPayload(formValue: any): any {
    const payload = {
      email: formValue.email
    };
    return payload;
  }
}

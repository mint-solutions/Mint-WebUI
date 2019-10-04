import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { I18nService } from '@app/core/i18n.service';
import { AuthenticationService, ILoginContext } from '@app/core/authentication/authentication.service';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { untilDestroyed } from '@app/core/until-destroyed';
import { Logger } from '@app/core/logger.service';
const log = new Logger('Login');

export interface IResponseContext {
  responseCode: string;
  message: string;
  responseData: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string = environment.version;
  error: string | undefined;
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  login() {
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.buildLoginPayload(this.loginForm.value));
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
            log.debug(`${res.responseData} successfully logged in`);
            this.credentialsService.setCredentials(res.responseData, true);
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
          } else {
            log.debug(`Login error: ${res.message}`);
          }
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: true
    });
  }

  buildLoginPayload(formValue: any): ILoginContext {
    const payload = {
      email: formValue.email,
      password: formValue.password
    };
    return payload;
  }

  onSubmit() {
    this.router.navigate(['/admin/dashboard/index']);
  }
}

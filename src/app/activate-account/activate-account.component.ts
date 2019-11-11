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
import { ToastrService } from 'ngx-toastr';
const log = new Logger('Activate Account');

export interface IResponseContext {
  responseCode: string;
  message: string;
  responseData: any;
}

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit, OnDestroy {
  // version: string = environment.version;
  error: string | undefined;
  loginForm: FormGroup;
  isLoading = false;
  token: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.activate();
  }

  ngOnDestroy() {}

  activate() {
    this.isLoading = true;
    const login$ = this.authenticationService.activate(this.token);
    login$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          // this.router.navigate(['/']);
          console.log(res);
          if (res.status === true) {
            this.toastr.success(res.message);
          } else {
            this.toastr.warning(res.message);
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
      password: ['', Validators.required]
      // remember: true
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

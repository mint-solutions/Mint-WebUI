import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRegister, IRegResponse, RegisterService } from '@app/register/register.service';
import { FormBuilder, FormGroup, RequiredValidator, Validator, Validators, FormControl } from '@angular/forms';
import { EAlertMessageIcon, EAlertMessageType, IAlertMessage } from '@app/shared/alert-message/alert-message.component';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core/until-destroyed';
import { Router } from '@angular/router';
import { SignupService } from './signup.service';

const log = new Logger('Register');

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  public regForm: FormGroup;
  public alertMessage: IAlertMessage;
  isLoading = false;

  constructor(
    private regService: SignupService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createRegForm();
  }

  ngOnDestroy() {}

  onSubmit() {
    this.isLoading = true;

    if (this.regForm.valid) {
      const resgister$ = this.regService.adminRegistration(this.buildPayload(this.regForm.value));
      resgister$
        .pipe(
          finalize(() => {
            this.regForm.markAsPristine();
            this.isLoading = false;
          }),
          untilDestroyed(this)
        )
        .subscribe(
          (res: any) => {
            log.info(`userRegistration response: ${res}`);
            if (res.status === true) {
              log.error(`userRegistration error: ${res.message}`);

              this.toastr.success(res.message, 'Please Check your mail to confirm', {
                closeButton: true,
                positionClass: 'toast-top-right'
              });
              this.router.navigateByUrl('/login');
            } else {
              log.error(`userRegistration error: ${res.message}`);
              this.toastr.error(res.message, undefined, {
                closeButton: true,
                positionClass: 'toast-top-right'
              });
            }
          },
          (err: any) => {
            log.error(`userRegistration error: ${err}`);
          }
        );
    } else {
      this.toastr.error('Please fill all with *', undefined, {
        closeButton: true,
        positionClass: 'toast-top-right'
      });
    }
  }

  private createRegForm(): void {
    this.regForm = new FormGroup({
      //company: new FormGroup({}),
      //contactPerson: new FormGroup({}),

      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      confirmpassword: new FormControl(null, Validators.required),
      phonenumber: new FormControl(null, Validators.required)
    });
  }

  private buildPayload(formDetails: any) {
    const payload = {
      firstName: formDetails.firstName,
      lastName: formDetails.lastName,
      email: formDetails.email,
      password: formDetails.password,
      confirmpassword: formDetails.confirmpassword,
      phonenumber: formDetails.phonenumber
    };

    return payload;
  }
}

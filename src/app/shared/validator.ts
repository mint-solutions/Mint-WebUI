import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ConfirmPasswordValidator(control: AbstractControl) {
  if (control && (control.value !== null || control.value !== undefined || control.value !== '')) {
    const confirmpassword = control.value;
    const passControl = control.root.get('password');
    if (passControl) {
      const passValue = passControl.value;
      if (passValue !== confirmpassword) {
        return {
          confirmPassword: true
        };
      }
    }
  }
}

export function PatternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      // if control is empty return no error
      return null;
    }

    // test the value of the control against the regexp supplied
    const valid = regex.test(control.value);

    // if true, return no error (no error), else return error passed in the second parameter
    return valid ? null : error;
  };
}

export function URLValidator() {
  return PatternValidator(
    RegExp(/^http(s)?:\/\/(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
    { notValidUrl: true }
  );
}
export function IPValidator() {
  return PatternValidator(
    RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/),
    { notValidIP: true }
  );
}

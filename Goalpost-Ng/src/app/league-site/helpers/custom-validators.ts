import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mustBeDifferentValidator(first: string, second: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const firstValue = form.value[first];
    const secondValue = form.value[second];
    if (!firstValue || !secondValue) {
        return null;
    }
    if (firstValue !== secondValue) {
        return null;
    }
    return {fieldsMustBeDifferent: true};
  };
}

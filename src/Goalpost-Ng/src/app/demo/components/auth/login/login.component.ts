import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthenticationService } from 'src/app/league-site/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent {
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #authenticationService = inject(AuthenticationService);
  errors = new Array<string>();
  form = this.#fb.group({
    email: this.#fb.nonNullable.control('', [Validators.required]),
    password: this.#fb.nonNullable.control('', [Validators.required]),
  });

  onLoginClicked() {
    this.#authenticationService
      .logIn(
        this.form.controls.email.value!,
        this.form.controls.password.value!
      )
      .subscribe({
        next: (response) => {
          if (!response.result) {
            this.errors = response.errorMessages ?? ["Unknown Error Occurred"];
            return;
          }
          // console.log(response.result);
          // console.log(this.#authenticationService.getBearerToken());
          this.#router.navigate(['/']);
        },
      });
  }

  constructor(public layoutService: LayoutService) {}
}

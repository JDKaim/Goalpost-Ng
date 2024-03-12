import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  #authenticationService = inject(AuthenticationService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.#authenticationService.getBearerToken();
    if (token) {
      return next
        .handle(
          request.clone({
            headers: request.headers.append("Authorization", token),
            withCredentials: true,
          })
        );
    }

    return next.handle(request);
  }
}

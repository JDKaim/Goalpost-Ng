import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpErrorApiResponse } from '../models/api/http-error-api-response';

@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (!environment.production) {
          console.error(error);
        }

        return of(
          new HttpResponse({
            body: new HttpErrorApiResponse(error as HttpErrorResponse),
            status: 0,
          })
        );
      })
    );
  }
}

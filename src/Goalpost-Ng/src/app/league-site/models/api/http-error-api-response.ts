import { HttpErrorResponse } from "@angular/common/http";
import { ApiResponse } from "./api-response";
import { ApiResponseType } from "./api-response-type";
import { environment } from "src/environments/environment";

export class HttpErrorApiResponse<T> implements ApiResponse<T> {
  result?: T;
  type: ApiResponseType = "UnhandledError";
  errorMessages: Array<string>;
  succeeded = false;
  requiresReauthorization = false;

  constructor(error: HttpErrorResponse) {
    switch (error.status) {
      case 0:
        this.errorMessages = ["We were unable to connect to the service."];
        break;

      case 405:
        this.errorMessages = ["The service reported an unexpected error."];
        break;

      default:
        this.errorMessages = ["An unexpected error occurred"];
        break;
    }

    if (!environment.production) {
      this.errorMessages.push(`DEBUG: ${error.message}`);
    }
  }
}

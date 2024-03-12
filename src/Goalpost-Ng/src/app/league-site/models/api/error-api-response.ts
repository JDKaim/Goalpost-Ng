import { ApiResponse } from "./api-response";
import { ApiResponseType } from "./api-response-type";

export class ErrorApiResponse<T> implements ApiResponse<T> {
  type: ApiResponseType = "Error";
  result?: T;
  errorMessages?: string[];

  constructor(errorMessage: string) {
    this.errorMessages = [errorMessage];
  }
}

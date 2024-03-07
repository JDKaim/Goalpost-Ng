import { ApiResponseType } from "./api-response-type";

export interface ApiResponse<T> {
  result?: T;
  type: ApiResponseType;
  errorMessages?: string[];
}

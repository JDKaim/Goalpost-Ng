import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { ApiResponse } from '../models/api-response';

export const DEFAULT_API_URL = new InjectionToken<string>('DEFAULT_API_URL');

@Injectable({
  providedIn: 'root',
})
export class DataService {
  #http = inject(HttpClient);
  #apiUrl = inject(DEFAULT_API_URL);
  
  logIn(email: string, password: string) {
    return this.#http.post<ApiResponse<string>>(`${this.#apiUrl}/Authentication/login`, {email, password});
  }
}

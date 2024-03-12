import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { ApiResponse } from '../models/api/api-response';
import { CreateGame } from '../models/dtos/create-game';
import { Game } from '../models/dtos/game';
import { UpdateGame } from '../models/dtos/update-game';
import { SearchGames } from '../models/dtos/search-games';

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

  createGame(createGame: CreateGame) {
    return this.#http.post<ApiResponse<Game>>(`${this.#apiUrl}/Games`, createGame);
  }

  updateGame(id: number, updateGame: UpdateGame) {
    return this.#http.put<ApiResponse<Game>>(`${this.#apiUrl}/Games/${id}`, updateGame);
  }

  getGame(id: number) {
    return this.#http.get<ApiResponse<Game>>(`${this.#apiUrl}/Games/${id}`);
  }
  
  deleteGame(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(`${this.#apiUrl}/Games/${id}`);
  }

  searchGames(searchGames: SearchGames) {
    return this.#http.post<ApiResponse<Array<Game>>>(`${this.#apiUrl}/Games/Search`, searchGames);
  }
}

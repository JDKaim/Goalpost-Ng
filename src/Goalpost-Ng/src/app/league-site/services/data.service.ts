import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import {
  ApiResponse,
  CreateGame,
  Game,
  UpdateGame,
  SearchGames,
  CreatePlayer,
  Player,
  UpdatePlayer,
  SearchPlayers,
  PlayerGame,
  SearchPlayerGames,
  CreatePlay,
  Play,
  SearchPlays,
} from '@league-site/models';

export const DEFAULT_API_URL = new InjectionToken<string>('DEFAULT_API_URL');

@Injectable({
  providedIn: 'root',
})
export class DataService {
  #http = inject(HttpClient);
  #apiUrl = inject(DEFAULT_API_URL);

  logIn(email: string, password: string) {
    return this.#http.post<ApiResponse<string>>(
      `${this.#apiUrl}/Authentication/login`,
      { email, password }
    );
  }

  createGame(createGame: CreateGame) {
    return this.#http.post<ApiResponse<Game>>(
      `${this.#apiUrl}/Games`,
      createGame
    );
  }

  updateGame(id: number, updateGame: UpdateGame) {
    return this.#http.put<ApiResponse<Game>>(
      `${this.#apiUrl}/Games/${id}`,
      updateGame
    );
  }

  getGame(id: number) {
    return this.#http.get<ApiResponse<Game>>(`${this.#apiUrl}/Games/${id}`);
  }

  deleteGame(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(
      `${this.#apiUrl}/Games/${id}`
    );
  }

  searchGames(searchGames: SearchGames) {
    return this.#http.post<ApiResponse<Array<Game>>>(
      `${this.#apiUrl}/Games/Search`,
      searchGames
    );
  }

  createPlayer(createPlayer: CreatePlayer) {
    return this.#http.post<ApiResponse<Player>>(
      `${this.#apiUrl}/Players`,
      createPlayer
    );
  }

  updatePlayer(id: number, updatePlayer: UpdatePlayer) {
    return this.#http.put<ApiResponse<Player>>(
      `${this.#apiUrl}/Players/${id}`,
      updatePlayer
    );
  }

  getPlayer(id: number) {
    return this.#http.get<ApiResponse<Player>>(`${this.#apiUrl}/Players/${id}`);
  }

  getPlayers(ids: Array<number>) {
    return this.#http.post<ApiResponse<Player[]>>(
      `${this.#apiUrl}/Players/List`,
      ids
    );
  }

  deletePlayer(id: number) {
    return this.#http.delete<ApiResponse<boolean>>(
      `${this.#apiUrl}/Players/${id}`
    );
  }

  searchPlayers(searchPlayers: SearchPlayers) {
    return this.#http.post<ApiResponse<Array<Player>>>(
      `${this.#apiUrl}/Players/Search`,
      searchPlayers
    );
  }

  addPlayerToRoster(gameId: number, team: string, playerId: number) {
    return this.#http.post<ApiResponse<PlayerGame>>(
      `${this.#apiUrl}/Games/${gameId}/${team}`,
      { id: playerId }
    );
  }

  removePlayerFromRoster(gameId: number, team: string, playerId: number) {
    return this.#http.delete<ApiResponse<boolean>>(
      `${this.#apiUrl}/Games/${gameId}/${team}/${playerId}`
    );
  }

  getRoster(gameId: number, team: string) {
    return this.#http.get<ApiResponse<Array<PlayerGame>>>(
      `${this.#apiUrl}/Games/${gameId}/${team}`
    );
  }

  searchPlayerGames(searchPlayerGames: SearchPlayerGames) {
    return this.#http.post<ApiResponse<Array<PlayerGame>>>(
      `${this.#apiUrl}/Games/SearchPlayerGames`,
      searchPlayerGames
    );
  }

  addPlay(gameId: number, createPlay: CreatePlay) {
    return this.#http.post<ApiResponse<Play>>(
      `${this.#apiUrl}/Games/${gameId}/Play`,
      createPlay
    );
  }

  getPlay(playId: number) {
    return this.#http.get<ApiResponse<Play>>(
      `${this.#apiUrl}/Games/Plays/${playId}`
    );
  }

  searchPlays(searchPlays: SearchPlays) {
    return this.#http.post<ApiResponse<Play[]>>(
      `${this.#apiUrl}/Games/Plays/Search`,
      searchPlays
    );
  }

  getGamesForPlayer(id: number) {
    return this.#http.get<ApiResponse<Array<PlayerGame>>>(
      `${this.#apiUrl}/Players/${id}/Games`
    );
  }
}

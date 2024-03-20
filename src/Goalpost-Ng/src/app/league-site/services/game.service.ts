import { Injectable, inject } from '@angular/core';
import { CreateGame } from '../models/dtos/create-game';
import { SearchGames } from '../models/dtos/search-games';
import { UpdateGame } from '../models/dtos/update-game';
import { DataService } from './data.service';
import { SearchPlayerGames } from '../models/dtos/search-player-games';
import { CreatePlay } from '../models/dtos/create-play';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  #dataService = inject(DataService);

  createGame(createGame: CreateGame) {
    // if (createGame.homeTeamCode === "AWAY") {
    //   return of(new ErrorApiResponse<Game>("The Home Team Code cannot be 'AWAY'."));
    // }
    return this.#dataService.createGame(createGame);
  }

  updateGame(id: number, updateGame: UpdateGame) {
    return this.#dataService.updateGame(id, updateGame);
  }

  getGame(id: number) {
    return this.#dataService.getGame(id);
  }
  
  deleteGame(id: number) {
    return this.#dataService.deleteGame(id);
  }

  searchGames(searchGames: SearchGames) {
    return this.#dataService.searchGames(searchGames);
  }

  addPlayerToRoster(gameId: number, team: string, playerId: number) {
    return this.#dataService.addPlayerToRoster(gameId, team, playerId);
  }

  removePlayerFromRoster(gameId: number, team: string, playerId: number) {
    return this.#dataService.removePlayerFromRoster(gameId, team, playerId);
  }

  getRoster(gameId: number, team: string) {
    return this.#dataService.getRoster(gameId, team);
  }

  searchPlayerGames(searchPlayerGames: SearchPlayerGames) {
    return this.#dataService.searchPlayerGames(searchPlayerGames);
  }

  addPlay(gameId: number, createPlay: CreatePlay) {
    return this.#dataService.addPlay(gameId, createPlay);
  }
  
  getPlay(playId: number) {
    return this.#dataService.getPlay(playId);
  }
}

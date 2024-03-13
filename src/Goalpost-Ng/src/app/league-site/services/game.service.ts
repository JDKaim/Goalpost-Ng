import { Injectable, inject } from '@angular/core';
import { CreateGame } from '../models/dtos/create-game';
import { SearchGames } from '../models/dtos/search-games';
import { UpdateGame } from '../models/dtos/update-game';
import { DataService } from './data.service';
import { ErrorApiResponse } from '../models/api/error-api-response';
import { of } from 'rxjs';
import { Game } from '../models/dtos/game';

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
}

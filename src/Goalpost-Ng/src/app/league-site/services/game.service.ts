import { Injectable, inject } from '@angular/core';
import { CreateGame } from '../models/dtos/create-game';
import { CreatePlay } from '../models/dtos/create-play';
import { SearchGames } from '../models/dtos/search-games';
import { SearchPlayerGames } from '../models/dtos/search-player-games';
import { UpdateGame } from '../models/dtos/update-game';
import { DataService } from './data.service';

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

  // getGameData(gameId: number) {  
  //   this.#dataService.getGame(gameId).pipe(switchMap((response) => {
  //     if (!response.result) {
  //       return of([]);
  //     }
  //     const homeRoster = this.#dataService.getRoster(gameId, response.result.homeTeamName).pipe(tap((homeRosterResponse) => {
  //       if (!homeRosterResponse.result) {
  //         return of([]);
  //       }
  //       const awayRoster = this.#dataService.getRoster(gameId, response.result!.awayTeamName).pipe(tap((awayRosterResponse) => {
  //         if (!awayRosterResponse.result) {
  //           return of([]);
  //         }
  //         const plays = this.#dataService.searchPlays({gameId}).pipe(tap((playsResponse) => {
  //           if (!playsResponse.result) {
  //             return of([]);
  //           }
  //           gameData = {response.result, homeRosterResponse.result, }
  //         }))
  //       }))
  //     }));
  //     const awayRoster = this.#dataService.getRoster(gameId, response.result.awayTeamName);
  //     const plays = this.#dataService.searchPlays({gameId});
  //     return Observable<ApiResponse<{response.result, home}>>
  //   }))
  // }
}

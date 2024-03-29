import { Injectable, inject } from '@angular/core';
import { CreateGame } from '../models/dtos/create-game';
import { CreatePlay } from '../models/dtos/create-play';
import { SearchGames } from '../models/dtos/search-games';
import { SearchPlayerGames } from '../models/dtos/search-player-games';
import { UpdateGame } from '../models/dtos/update-game';
import { DataService } from './data.service';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { ApiResponse } from '../models/api/api-response';
import { RosterPlayer } from '../models/dtos/roster-player';
import { PlayerService } from './player.service';
import { SuccessApiResponse } from '../models/api/success-api-response';
import { SearchPlays } from '../models/dtos/search-plays';
import { GameData } from '../models/dtos/game-data';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  #dataService = inject(DataService);
  #playerService = inject(PlayerService);

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

  addPlayerToRoster(gameId: number, isHome: boolean, playerId: number) {
    return this.#dataService.addPlayerToRoster(
      gameId,
      isHome ? 'home' : 'away',
      playerId
    );
  }

  removePlayerFromRoster(gameId: number, isHome: boolean, playerId: number) {
    return this.#dataService.removePlayerFromRoster(
      gameId,
      isHome ? 'home' : 'away',
      playerId
    );
  }

  getRoster(gameId: number, isHome: boolean) {
    return this.#dataService.getRoster(gameId, isHome ? 'home' : 'away').pipe(
      switchMap((response) => {
        if (!response.result) {
          return of(response as any as ApiResponse<RosterPlayer[]>);
        }
        return this.#playerService
          .getPlayers(response.result.map((playerGame) => playerGame.playerId))
          .pipe(
            map((getPlayerResponse) => {
              if (!getPlayerResponse.result) {
                return getPlayerResponse as any as ApiResponse<RosterPlayer[]>;
              }
              return new SuccessApiResponse(
                response.result!.map(
                  (playerGame) =>
                    new RosterPlayer(
                      playerGame,
                      getPlayerResponse.result!.find(
                        (player) => player.id === playerGame.playerId
                      )!
                    )
                )
              );
            })
          );
      })
    );
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

  searchPlays(searchPlays: SearchPlays) {
    return this.#dataService.searchPlays(searchPlays);
  }

  getGameData(gameId: number) {
    return combineLatest([
      this.getGame(gameId),
      this.searchPlays({ gameId }),
      this.getRoster(gameId, false),
      this.getRoster(gameId, true)
    ]).pipe(map((results) => {
      if (!results[0].result) {
        return results[0] as any as ApiResponse<GameData>;
      }
      if (!results[1].result) {
        return results[1] as any as ApiResponse<GameData>;
      }
      if (!results[2].result) {
        return results[2] as any as ApiResponse<GameData>;
      }
      if (!results[3].result) {
        return results[3] as any as ApiResponse<GameData>;
      }
      return new SuccessApiResponse(new GameData(results[0].result, results[1].result, results[2].result, results[3].result));
    }));
  }
}

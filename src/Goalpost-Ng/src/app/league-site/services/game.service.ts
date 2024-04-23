import { Injectable, inject } from '@angular/core';
import {
  ApiResponse,
  CreateGame,
  CreatePlay,
  Game,
  GameData,
  RosterPlayer,
  SearchGames,
  SearchPlayerGames,
  SearchPlays,
  SuccessApiResponse,
  UpdateGame
} from '@league-site/models';
import { PlayerGameGameArray } from '@league-site/models/entities/player-game-game-array';
import { combineLatest, map, of, switchMap, tap } from 'rxjs';
import { DataService } from './data-service';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  #dataService = inject(DataService);
  #playerService = inject(PlayerService);
  #games = new Map<number, ApiResponse<Game>>();

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

  deletePlay(playId: number) {
    return this.#dataService.deletePlay(playId);
  }

  searchPlays(searchPlays: SearchPlays) {
    return this.#dataService.searchPlays(searchPlays);
  }

  getGameData(gameId: number) {
    return combineLatest([
      this.getGame(gameId),
      this.searchPlays({ gameId }),
      this.getRoster(gameId, false),
      this.getRoster(gameId, true),
    ]).pipe(
      map((results) => {
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
        return new SuccessApiResponse(
          new GameData(
            results[0].result,
            results[1].result,
            results[2].result,
            results[3].result
          )
        );
      })
    );
  }

  getGames(ids: Array<number>) {
    const games = new Array<Game>();
    const requestIds = new Array<number>();
    ids.forEach((id) => {
      const player = this.#games.get(id);
      if (player) {
        games.push(player.result!);
      } else {
        requestIds.push(id);
      }
    });
    if (!requestIds.length) {
      return of(new SuccessApiResponse<Game[]>(games));
    }
    return this.#dataService.getGames(requestIds).pipe(
      tap((response) => {
        response.result?.forEach((game) =>
          this.#games.set(game.id, new SuccessApiResponse(game))
        );
      }),
      map((response) => {
        if (games.length) {
          response.result?.push(...games);
        }
        return response;
      })
    );
  }

  getGamesForPlayer(id: number) {
    return this.#dataService.getPlayerGamesForPlayer(id).pipe(
      switchMap((response) => {
        if (!response.result) {
          return of(response as any as ApiResponse<Game[]>);
        }
        return this.getGames(response.result.map((playerGame) => playerGame.gameId))
          .pipe(
            map((getGameResponse) => {
              if (!getGameResponse.result) {
                return getGameResponse as any as ApiResponse<Game[]>;
              }
              return new SuccessApiResponse(getGameResponse.result);
            })
          );
      })
    );
  }

  getGamesAndPlayerGamesForPlayer(id: number) {
    return this.#dataService.getPlayerGamesForPlayer(id).pipe(
      switchMap((response) => {
        if (!response.result) {
          return of(response as any as ApiResponse<PlayerGameGameArray>);
        }
        return this.getGames(response.result.map((playerGame) => playerGame.gameId))
          .pipe(
            map((getGameResponse) => {
              if (!getGameResponse.result) {
                return getGameResponse as any as ApiResponse<PlayerGameGameArray>;
              }
              return new SuccessApiResponse(new PlayerGameGameArray(response.result!, getGameResponse.result));
            })
          );
      })
    );
  }
}

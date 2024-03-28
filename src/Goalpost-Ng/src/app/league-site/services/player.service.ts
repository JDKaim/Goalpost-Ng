import { Injectable, inject } from '@angular/core';
import { CreatePlayer } from '../models/dtos/create-player';
import { UpdatePlayer } from '../models/dtos/update-player';
import { DataService } from './data.service';
import { SearchPlayers } from '../models/dtos/search-players';
import { Player } from '../models/dtos/player';
import { map, of, tap } from 'rxjs';
import { ApiResponse } from '../models/api/api-response';
import { SuccessApiResponse } from '../models/api/success-api-response';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  #dataService = inject(DataService);
  #players = new Map<number, ApiResponse<Player>>();

  createPlayer(createPlayer: CreatePlayer) {
    return this.#dataService.createPlayer(createPlayer).pipe(
      tap((response) => {
        if (response.result) {
          this.#players.set(response.result.id, response);
        }
      })
    );
  }

  updatePlayer(id: number, updatePlayer: UpdatePlayer) {
    return this.#dataService.updatePlayer(id, updatePlayer).pipe(
      tap((response) => {
        if (response.result) {
          this.#players.set(response.result.id, response);
        }
      })
    );
  }

  getPlayer(id: number) {
    const player = this.#players.get(id);
    if (player) {
      return of(player);
    }
    return this.#dataService.getPlayer(id).pipe(
      tap((response) => {
        if (response.result) {
          this.#players.set(id, response);
        }
      })
    );
  }

  getPlayers(ids: Array<number>) {
    const players = new Array<Player>();
    const requestIds = new Array<number>();
    ids.forEach((id) => {
      const player = this.#players.get(id);
      if (player) {
        players.push(player.result!);
      } else {
        requestIds.push(id);
      }
    });
    if (!requestIds.length) {
      return of(new SuccessApiResponse<Player[]>(players));
    }
    return this.#dataService.getPlayers(requestIds).pipe(
      tap((response) => {
        response.result?.forEach((player) =>
          this.#players.set(player.id, new SuccessApiResponse(player))
        );
      }), map((response) => {
        if (players.length) {
          response.result?.push(...players); 
        }
        return response;
      })
    );
  }

  deletePlayer(id: number) {
    return this.#dataService.deletePlayer(id).pipe(
      tap((response) => {
        if (response.type === 'Success') {
          this.#players.delete(id);
        }
      })
    );
  }

  searchPlayers(searchPlayers: SearchPlayers) {
    return this.#dataService.searchPlayers(searchPlayers).pipe(
      tap((response) => {
        response.result?.forEach((player) =>
          this.#players.set(player.id, new SuccessApiResponse(player))
        );
      })
    );
  }

  getGamesForPlayer(id: number) {
    return this.#dataService.getGamesForPlayer(id);
  }
}

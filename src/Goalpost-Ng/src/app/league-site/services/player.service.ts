import { Injectable, inject } from '@angular/core';
import { CreatePlayer } from '../models/dtos/create-player';
import { UpdatePlayer } from '../models/dtos/update-player';
import { DataService } from './data.service';
import { SearchPlayers } from '../models/dtos/search-players';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  #dataService = inject(DataService);

  createPlayer(createPlayer: CreatePlayer) {
    return this.#dataService.createPlayer(createPlayer);
  }

  updatePlayer(id: number, updatePlayer: UpdatePlayer) {
    return this.#dataService.updatePlayer(id, updatePlayer);
  }

  getPlayer(id: number) {
    return this.#dataService.getPlayer(id);
  }
  
  deletePlayer(id: number) {
    return this.#dataService.deletePlayer(id);
  }

  searchPlayers(searchPlayers: SearchPlayers) {
    return this.#dataService.searchPlayers(searchPlayers);
  }
}

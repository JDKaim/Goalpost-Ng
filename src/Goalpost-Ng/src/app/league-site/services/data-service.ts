import {
  ApiResponse,
  CreateGame,
  CreatePlay,
  CreatePlayer,
  Game,
  Play,
  Player,
  PlayerGame,
  SearchGames,
  SearchPlayerGames,
  SearchPlayers,
  SearchPlays,
  UpdateGame,
  UpdatePlayer,
} from '@league-site/models';
import { Observable } from 'rxjs';

export abstract class DataService {
  abstract logIn(
    email: string,
    password: string
  ): Observable<ApiResponse<string>>;

  abstract createGame(createGame: CreateGame): Observable<ApiResponse<Game>>;

  abstract updateGame(
    id: number,
    updateGame: UpdateGame
  ): Observable<ApiResponse<Game>>;

  abstract getGame(id: number): Observable<ApiResponse<Game>>;

  abstract deleteGame(id: number): Observable<ApiResponse<boolean>>;

  abstract searchGames(
    searchGames: SearchGames
  ): Observable<ApiResponse<Array<Game>>>;

  abstract createPlayer(
    createPlayer: CreatePlayer
  ): Observable<ApiResponse<Player>>;

  abstract updatePlayer(
    id: number,
    updatePlayer: UpdatePlayer
  ): Observable<ApiResponse<Player>>;

  abstract getPlayer(id: number): Observable<ApiResponse<Player>>;

  abstract getPlayers(
    ids: Array<number>
  ): Observable<ApiResponse<Array<Player>>>;

  abstract deletePlayer(id: number): Observable<ApiResponse<boolean>>;

  abstract searchPlayers(
    searchPlayers: SearchPlayers
  ): Observable<ApiResponse<Array<Player>>>;

  abstract addPlayerToRoster(
    gameId: number,
    team: string,
    playerId: number
  ): Observable<ApiResponse<PlayerGame>>;

  abstract removePlayerFromRoster(
    gameId: number,
    team: string,
    playerId: number
  ): Observable<ApiResponse<boolean>>;

  abstract getRoster(
    gameId: number,
    team: string
  ): Observable<ApiResponse<Array<PlayerGame>>>;

  abstract searchPlayerGames(
    searchPlayerGames: SearchPlayerGames
  ): Observable<ApiResponse<Array<PlayerGame>>>;

  abstract addPlay(
    gameId: number,
    createPlay: CreatePlay
  ): Observable<ApiResponse<Play>>;

  abstract getPlay(playId: number): Observable<ApiResponse<Play>>;

  abstract deletePlay(playId: number): Observable<ApiResponse<boolean>>;

  abstract searchPlays(
    searchPlays: SearchPlays
  ): Observable<ApiResponse<Array<Play>>>;

  abstract getPlayerGamesForPlayer(
    id: number
  ): Observable<ApiResponse<Array<PlayerGame>>>;

  abstract getGames(ids: Array<number>): Observable<ApiResponse<Array<Game>>>;
}

import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { DataService } from './data-service';
import { of } from 'rxjs';
import { Player, PlayerGame, SuccessApiResponse } from '@league-site/models';

describe('PlayerService', () => {
    let playerService: PlayerService;
    let dataServiceSpy: jasmine.SpyObj<DataService>;
  
    beforeEach(() => {
      dataServiceSpy = jasmine.createSpyObj('DataService', ['createPlayer', 'updatePlayer', 'getPlayer', 'getPlayers', 'deletePlayer', 'searchPlayers', 'getPlayerGamesForPlayer']);
      
      TestBed.configureTestingModule({
        // Provide both the service-to-test and its (spy) dependency
        providers: [PlayerService, { provide: DataService, useValue: dataServiceSpy }],
      });
      // Inject both the service-to-test and its (spy) dependency
      playerService = TestBed.inject(PlayerService);
      // dataServiceSpy = TestBed.inject(
      //   DataService
      // ) as jasmine.SpyObj<DataService>;
  
    });

    it('should create a player', () => {
        // Provide a mock implementation of the DataService.createPlayer method
        const player: Partial<Player> = {
            id: 1,
            name: 'Player 1'
        };
        dataServiceSpy.createPlayer.withArgs(<Player>player).and.returnValue(of(new SuccessApiResponse(<Player>player)));
        playerService.createPlayer(<Player>player).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.objectContaining(<Player>{id: 1, name: 'Player 1'}))
        });
    });

    it('should get a player', () => {
        // Provide a mock implementation of the DataService.getPlayer method
        const player: Partial<Player> = {
            id: 1,
            name: 'Player 1'
        };
        dataServiceSpy.getPlayer.and.returnValue(of(new SuccessApiResponse(<Player>player)));
        playerService.getPlayer(1).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.objectContaining(<Player>{id: 1, name: 'Player 1'}))
        });
    });

    it('should update a player', () => {
        // Implement this test
        // Provide a mock implementation of the DataService.updatePlayer method
        const player: Partial<Player> = {
            id: 1,
            name: 'Player 1'
        };
        dataServiceSpy.updatePlayer.and.returnValue(of(new SuccessApiResponse(<Player>player)));
        playerService.updatePlayer(1, <Player>player).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.objectContaining(<Player>{id: 1, name: 'Player 1'}))
        });
    });

    it('should get a player by id', () => {
        // Implement this test
        // Provide a mock implementation of the DataService.getPlayer method
        const player: Partial<Player> = {
            id: 1,
            name: 'Player 1'
        };
        dataServiceSpy.getPlayer.and.returnValues(of(new SuccessApiResponse(<Player>player)), of({} as any as SuccessApiResponse<Player>));
        playerService.getPlayer(1).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.objectContaining(<Player>{id: 1, name: 'Player 1'}))
        });
        playerService.getPlayer(1).subscribe({
            next: (response) => expect(response?.result).toEqual(jasmine.objectContaining(<Player>{id: 1, name: 'Player 1'}))
        });
    });

    it('should get players by ids', () => {
        // Write this test
        // Provide a mock implementation of the DataService.getPlayers method
        const players: Partial<Player>[] = [
            { id: 1, name: 'Player 1' },
            { id: 2, name: 'Player 2' }
        ];
        dataServiceSpy.getPlayer.withArgs(1).and.returnValue(of(new SuccessApiResponse(<Player>players[0])));
        dataServiceSpy.getPlayers.withArgs([2]).and.returnValue(of(new SuccessApiResponse(<Player[]>[players[1]])));
        playerService.getPlayer(1).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.objectContaining(players[0]))
        });
        playerService.getPlayers([1, 2]).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.arrayContaining(players))
        });
        playerService.getPlayers([1, 2]).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.arrayContaining(players))
        });
    });

    it('should delete a player', () => {
        // Write this test
        // Provide a mock implementation of the DataService.deletePlayer method
        const player: Partial<Player> = {
            id: 1,
            name: 'Player 1'
        };
        dataServiceSpy.deletePlayer.withArgs(1).and.returnValue(of(new SuccessApiResponse(true)));
        playerService.deletePlayer(1).subscribe({
            next: (response) => expect(response.result).toBeTrue()
        });
    });

    it('should search players', () => {
        // Write this test
        // Provide a mock implementation of the DataService.searchPlayers method
        const players: Partial<Player>[] = [
            { id: 1, name: 'Player 1' },
            { id: 2, name: 'Player 2' }
        ];
        dataServiceSpy.searchPlayers.withArgs({}).and.returnValue(of(new SuccessApiResponse(<Player[]>players)));
        playerService.searchPlayers({}).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.arrayContaining(players))
        });
    });

    it('should get player games for a player', () => {
        // Write this test
        // Provide a mock implementation of the DataService.getPlayerGames method
        const games: Partial<PlayerGame>[] = [
            { gameId: 1, playerId: 1 },
            { gameId: 2, playerId: 1 }
        ];
        dataServiceSpy.getPlayerGamesForPlayer.and.returnValue(of(new SuccessApiResponse(<PlayerGame[]>games)));
        playerService.getPlayerGamesForPlayer(1).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.arrayContaining(games))
        });
    });
});
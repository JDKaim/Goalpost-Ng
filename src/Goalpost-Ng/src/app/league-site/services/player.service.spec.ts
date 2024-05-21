import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { DataService } from './data-service';
import { of } from 'rxjs';
import { Player, SuccessApiResponse } from '@league-site/models';

describe('PlayerService', () => {
    let playerService: PlayerService;
    let dataServiceSpy: jasmine.SpyObj<DataService>;
  
    beforeEach(() => {
      dataServiceSpy = jasmine.createSpyObj('DataService', ['createPlayer', 'updatePlayer', 'getPlayer', 'getPlayers', 'deletePlayer', 'searchPlayers', 'getPlayerGames']);
      
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
        dataServiceSpy.getPlayer.withArgs(1).and.returnValue(of(new SuccessApiResponse(<Player>player)));
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
        dataServiceSpy.updatePlayer.withArgs(1, <Player>player).and.returnValue(of(new SuccessApiResponse(<Player>player)));
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
        dataServiceSpy.getPlayer.withArgs(1).and.returnValue(of(new SuccessApiResponse(<Player>player)));
        playerService.getPlayer(1).subscribe({
            next: (response) => expect(response.result).toEqual(jasmine.objectContaining(<Player>{id: 1, name: 'Player 1'}))
        });
    });

    it('should get players by ids', () => {
        // Test implementation
    });

    it('should delete a player', () => {
        // Test implementation
    });

    it('should search players', () => {
        // Test implementation
    });

    it('should get player games for a player', () => {
        // Test implementation
    });
});
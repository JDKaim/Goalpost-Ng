import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { DataService } from './data-service';
import { PlayerService } from './player.service';
import { of } from 'rxjs';

describe('GameService', () => {
    let gameService: GameService;
    let dataServiceSpy: jasmine.SpyObj<DataService>;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;

    beforeEach(() => {
        const spyDataService = jasmine.createSpyObj('DataService', ['getData']);
        const spyPlayerService = jasmine.createSpyObj('PlayerService', ['getPlayer']);

        TestBed.configureTestingModule({
            providers: [
                GameService,
                { provide: DataService, useValue: spyDataService },
                { provide: PlayerService, useValue: spyPlayerService }
            ]
        });

        gameService = TestBed.inject(GameService);
        dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
        playerServiceSpy = TestBed.inject(PlayerService) as jasmine.SpyObj<PlayerService>;
    });

    it('should be created', () => {
        expect(gameService).toBeTruthy();
    });


    // Add more tests for other methods...

});
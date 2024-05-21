import { Player } from '../dtos/player';
import { DefensiveStats } from './defensive-stats';

describe('DefensiveStats', () => {
  it('should correctly initialize properties', () => {
    const player: Player = {
        id: 1,
        name: 'Test Player',
        games: 10,
        flagPulls: 5,
        defensiveInterceptions: 3,
        defensiveFumbles: 2,
        defensiveSacks: 4,
        defensiveTds: 6,
        defensiveOnePointConversions: 7,
        defensiveTwoPointConversions: 8,
        defensiveSafeties: 9,
        pointsScored: 0,
        passingAttempts: 0,
        passingCompletions: 0,
        passingYardage: 0,
        passingTds: 0,
        passingOnePointConversions: 0,
        passingTwoPointConversions: 0,
        rushingAttempts: 0,
        rushingYardage: 0,
        rushingTds: 0,
        rushingOnePointConversions: 0,
        rushingTwoPointConversions: 0,
        receivingTargets: 0,
        receivingCompletions: 0,
        receivingYardage: 0,
        receivingTds: 0,
        receivingOnePointConversions: 0,
        receivingTwoPointConversions: 0,
        passingInterceptions: 0,
        offensiveFumbles: 0,
        offensiveSacks: 0,
        offensiveSafeties: 0
    };

    const stats = new DefensiveStats(player);

    expect(stats.name).toEqual('Test Player');
    expect(stats.id).toEqual(1);
    expect(stats.games).toEqual(10);
    expect(stats.flagPulls).toEqual(5);
    expect(stats.interceptions).toEqual(3);
    expect(stats.fumbleRecoveries).toEqual(2);
    expect(stats.sacks).toEqual(4);
    expect(stats.defensiveTds).toEqual(6);
    expect(stats.defensiveOnePointConversions).toEqual(7);
    expect(stats.defensiveTwoPointConversions).toEqual(8);
    expect(stats.safeties).toEqual(9);
    expect(stats.pointsScored).toEqual(77);  
    });

    // Add a test for a player that got a safety
    it('should correctly calculate points scored when player gets a safety', () => {
        const player: Player = {
            id: 2,
            name: 'Safety Player',
            games: 5,
            flagPulls: 2,
            defensiveInterceptions: 1,
            defensiveFumbles: 1,
            defensiveSacks: 3,
            defensiveTds: 2,
            defensiveOnePointConversions: 1,
            defensiveTwoPointConversions: 1,
            defensiveSafeties: 1,
            pointsScored: 0,
            passingAttempts: 0,
            passingCompletions: 0,
            passingYardage: 0,
            passingTds: 0,
            passingOnePointConversions: 0,
            passingTwoPointConversions: 0,
            rushingAttempts: 0,
            rushingYardage: 0,
            rushingTds: 0,
            rushingOnePointConversions: 0,
            rushingTwoPointConversions: 0,
            receivingTargets: 0,
            receivingCompletions: 0,
            receivingYardage: 0,
            receivingTds: 0,
            receivingOnePointConversions: 0,
            receivingTwoPointConversions: 0,
            passingInterceptions: 0,
            offensiveFumbles: 0,
            offensiveSacks: 0,
            offensiveSafeties: 0
        };

        const stats = new DefensiveStats(player);

        expect(stats).toEqual(jasmine.objectContaining(<DefensiveStats>{
            name: "Safety Player",
            id: 2,
            games: 5,
            flagPulls: 2,
            interceptions: 1,
            fumbleRecoveries: 1,
            sacks: 3,
            defensiveTds: 2,
            defensiveOnePointConversions: 1,
            defensiveTwoPointConversions: 1,
            safeties: 1,
            pointsScored: 17
        }));
    });
});
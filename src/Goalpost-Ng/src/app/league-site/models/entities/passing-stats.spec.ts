import { Player } from "@league-site";
import { PassingStats } from "./passing-stats";

describe('PassingStats', () => {

  it('Completion Percentage', () => {
    const player = <Player> {
      passingAttempts: 10,
      passingCompletions: 7
    };

    const passingStats = new PassingStats(player);
    expect(passingStats.completionPercentage).toBe(0.7);
  });

  // unit test to test for interceptions 
  it('Interception Number', () => {
    const player = <Player> {
      passingAttempts: 20,
      passingInterceptions: 2
    };

    const passingStats = new PassingStats(player);
    expect(passingStats.passingInterceptions).toBe(2);
  });

  // test for passing tds
  it('Passing Tds', () => {
    const player = <Player> {
      passingAttempts: 20,
      passingTds: 2
    };

    const passingStats = new PassingStats(player);
    expect(passingStats.passingTds).toBe(2);
  });

  // test for passing one point conversions
  it('Passing One Point Conversions', () => {
    const player = <Player> {
      passingAttempts: 20,
      passingOnePointConversions: 2
    };

    const passingStats = new PassingStats(player);
    expect(passingStats.passingOnePointConversions).toBe(2);
  });

  // test for passing two point conversions
  it('Passing Two Point Conversions', () => {
    const player = <Player> {
      passingAttempts: 20,
      passingTwoPointConversions: 2
    };

    const passingStats = new PassingStats(player);
    expect(passingStats.passingTwoPointConversions).toBe(2);
  });

  // test for passing yardage
  it('Passing Yardage', () => {
    const player = <Player> {
      passingAttempts: 20,
      passingYardage: 200
    };

    const passingStats = new PassingStats(player);
    expect(passingStats.passingYardage).toBe(200);
  });

  // test for passing completions
  it('Passing Completions', () => {
    const player = <Player> {
      passingAttempts: 20,
      passingCompletions: 10
    };

    const passingStats = new PassingStats(player);
    expect(passingStats.passingCompletions).toBe(10);
  });

  // test for passing attempts
  it('Passing Attempts', () => {
    const player = <Player> {
      passingAttempts: 20
    };

    const passingStats = new PassingStats(player);
    expect(passingStats.passingAttempts).toBe(20);
  });
});

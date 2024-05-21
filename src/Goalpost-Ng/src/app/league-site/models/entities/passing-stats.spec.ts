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

});

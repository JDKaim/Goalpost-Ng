import { Play } from './play';
import { PlayerGame } from './player-game';
import { PlayerStats } from './player-stats';
import { Team } from './team';

export class TeamStats {
  score: number;
  playerStats: Array<PlayerStats>;

  constructor(
    public plays: Array<Play>,
    public roster: Array<PlayerGame>,
    public teamId: string
  ) {
    this.playerStats = roster.map((playerGame) => new PlayerStats(plays, playerGame));
    this.score = this.playerStats.map((player) => player.pointsScored).reduce((p, c) => p + c, 0);
  }
}

import { Game } from './game';
import { Play } from './play';
import { TeamStats } from './team-stats';

export class GameStats {
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  constructor(public game: Game) {
    this.homeTeamStats = new TeamStats(game.plays, game.homeRoster, game.homeTeamId);
    this.awayTeamStats = new TeamStats(game.plays, game.awayRoster, game.awayTeamId);
  }
}

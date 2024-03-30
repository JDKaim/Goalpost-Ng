import { Play } from './play';
import { Player } from './player';
import { Team } from './team';

export class PlayStats {
  passer?: Player;
  rusher?: Player;
  receiver?: Player;
  flagPuller?: Player;
  turnoverPlayer?: Player;

  get isPassingPlay() {
    switch (this.play.type) {
      case 'Passing':
      case 'OnePointPass':
      case 'TwoPointPass':
        return true;
      default:
        return false;
    }
  }

  get isRushingPlay() {
    switch (this.play.type) {
      case 'Rushing':
      case 'OnePointRush':
      case 'TwoPointRush':
        return true;
      default:
        return false;
    }
  }

  private constructor(
    public play: Play,
    public offensiveTeam: Team,
    public defensiveTeam: Team
  ) {}

  static createRush(
    play: Play,
    offensiveTeam: Team,
    defensiveTeam: Team,
    rusher: Player,
    flagPuller?: Player,
    turnoverPlayer?: Player
  ) {
    const playStats = new PlayStats(play, offensiveTeam, defensiveTeam);
    playStats.rusher = rusher;
    playStats.flagPuller = flagPuller;
    playStats.turnoverPlayer = turnoverPlayer;
    return playStats;
  }

  static createPass(
    play: Play,
    offensiveTeam: Team,
    defensiveTeam: Team,
    passer: Player,
    receiver: Player,
    flagPuller?: Player,
    turnoverPlayer?: Player
  ) {
    const playStats = new PlayStats(play, offensiveTeam, defensiveTeam);
    playStats.passer = passer;
    playStats.receiver = receiver;
    playStats.flagPuller = flagPuller;
    playStats.turnoverPlayer = turnoverPlayer;
    return playStats;
  }
}

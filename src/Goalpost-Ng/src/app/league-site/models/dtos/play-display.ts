import { Play } from './play';
import { RosterPlayer } from './roster-player';

export class PlayDisplay {
  constructor(
    public play: Play,
    public awayTeamName: string,
    public awayTeamCode: string,
    public homeTeamName: string,
    public homeTeamCode: string,
    public offensiveTeamRoster: RosterPlayer[],
    public defensiveTeamRoster: RosterPlayer[]
  ) {}
}

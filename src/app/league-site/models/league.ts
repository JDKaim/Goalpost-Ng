import { Player } from './player';
import { Team } from './team';

export interface League {
    teams: Array<Team>;
    players: Array<Player>;
}

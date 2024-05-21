import { Player } from '../dtos/player';

export class DefensiveStats {
  public name: string;
  public id: number;
  public games: number;
  public flagPulls: number;
  public interceptions: number;
  public fumbleRecoveries: number;
  public safeties: number;
  public sacks: number;
  public pointsScored: number;
  public defensiveTds: number;
  public defensiveOnePointConversions: number;
  public defensiveTwoPointConversions: number;

  constructor(player: Player) {
    this.name = player.name;
    this.id = player.id;
    this.games = player.games;
    this.pointsScored = player.defensiveOnePointConversions + 2 * player.defensiveTwoPointConversions + 6 * player.defensiveTds + 2 * player.defensiveSafeties;
    this.flagPulls = player.flagPulls;
    this.interceptions = player.defensiveInterceptions;
    this.fumbleRecoveries = player.defensiveFumbles;
    this.sacks = player.defensiveSacks;
    this.defensiveTds = player.defensiveTds;
    this.defensiveOnePointConversions = player.defensiveOnePointConversions;
    this.defensiveTwoPointConversions = player.defensiveTwoPointConversions;
    this.safeties = player.defensiveSafeties;
  }
}

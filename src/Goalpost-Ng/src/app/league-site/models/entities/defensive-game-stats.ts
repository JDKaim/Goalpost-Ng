import { RosterPlayer } from '.';

export class DefensiveGameStats {
  public name: string;
  public id: number;
  public isHome: boolean;
  public flagPulls: number;
  public interceptions: number;
  public fumbleRecoveries: number;
  public safeties: number;
  public sacks: number;
  public pointsScored: number;
  public defensiveTds: number;
  public defensiveOnePointConversions: number;
  public defensiveTwoPointConversions: number;

  constructor(player: RosterPlayer) {
    this.name = player.player.name;
    this.id = player.player.id;
    this.isHome = player.playerGame.isHome;
    this.pointsScored = player.playerGame.defensiveOnePointConversions + 2 * player.playerGame.defensiveTwoPointConversions + 6 * player.playerGame.defensiveTds;
    this.flagPulls = player.playerGame.flagPulls;
    this.interceptions = player.playerGame.defensiveInterceptions;
    this.fumbleRecoveries = player.playerGame.defensiveFumbles;
    this.sacks = player.playerGame.defensiveSacks;
    this.defensiveTds = player.playerGame.defensiveTds;
    this.defensiveOnePointConversions = player.playerGame.defensiveOnePointConversions;
    this.defensiveTwoPointConversions = player.playerGame.defensiveTwoPointConversions;
    this.safeties = player.playerGame.defensiveSafeties;
  }
}

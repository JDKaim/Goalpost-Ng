import { RosterPlayer } from '.';

export class RushingGameStats {
  public name: string;
  public id: number;
  public isHome: boolean;
  public rushingYardage: number;
  public rushingAttempts: number;
  public rushingYardagePerAttempt: number;
  public pointsScored: number;
  public rushingTds: number;
  public rushingOnePointConversions: number;
  public rushingTwoPointConversions: number;
  public fumbles: number;
  public safeties: number;

  constructor(player: RosterPlayer) {
    this.name = player.player.name;
    this.id = player.player.id;
    this.isHome = player.playerGame.isHome;
    this.pointsScored = player.playerGame.rushingOnePointConversions + 2 * player.playerGame.rushingTwoPointConversions + 6 * player.playerGame.rushingTds;
    this.rushingYardage = player.playerGame.rushingYardage;
    this.rushingAttempts = player.playerGame.rushingAttempts;
    this.rushingYardagePerAttempt = this.rushingAttempts ? (this.rushingYardage / this.rushingAttempts) : 0;
    this.rushingTds = player.playerGame.rushingTds;
    this.rushingOnePointConversions = player.playerGame.rushingOnePointConversions;
    this.rushingTwoPointConversions = player.playerGame.rushingTwoPointConversions;
    this.fumbles = player.playerGame.offensiveFumbles;
    this.safeties = player.playerGame.offensiveSafeties;
  }
}

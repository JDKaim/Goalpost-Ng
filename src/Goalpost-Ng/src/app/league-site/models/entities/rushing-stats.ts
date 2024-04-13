import { Player } from '../dtos';

export class RushingStats {
  public name: string;
  public id: number;
  public games: number;
  public rushingYardage: number;
  public rushingAttempts: number;
  public rushingYardagePerAttempt: number;
  public pointsScored: number;
  public rushingTds: number;
  public rushingOnePointConversions: number;
  public rushingTwoPointConversions: number;
  public fumbles: number;
  public safeties: number;

  constructor(player: Player) {
    this.name = player.name;
    this.id = player.id;
    this.games = player.games;
    this.pointsScored = player.rushingOnePointConversions + 2 * player.rushingTwoPointConversions + 6 * player.rushingTds;
    this.rushingYardage = player.rushingYardage;
    this.rushingAttempts = player.rushingAttempts;
    this.rushingYardagePerAttempt = this.rushingAttempts ? (this.rushingYardage / this.rushingAttempts) : 0;
    this.rushingTds = player.rushingTds;
    this.rushingOnePointConversions = player.rushingOnePointConversions;
    this.rushingTwoPointConversions = player.rushingTwoPointConversions;
    this.fumbles = player.offensiveFumbles;
    this.safeties = player.offensiveSafeties;
  }
}

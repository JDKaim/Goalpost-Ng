import { Player } from '../dtos';

export class ReceivingStats {
  public name: string;
  public id: number;
  public games: number;
  public receivingYardage: number;
  public receivingYardagePerTarget: number;
  public receivingYardagePerCompletion: number;
  public receivingCompletions: number;
  public receivingTargets: number;
  public receptionPercentage: number;
  public pointsScored: number;
  public receivingTds: number;
  public receivingOnePointConversions: number;
  public receivingTwoPointConversions: number;

  constructor(player: Player) {
    this.name = player.name;
    this.id = player.id;
    this.games = player.games;
    this.pointsScored = player.receivingOnePointConversions + 2 * player.receivingTwoPointConversions + 6 * player.receivingTds;
    this.receivingYardage = player.receivingYardage;
    this.receivingCompletions = player.receivingCompletions;
    this.receivingTargets = player.receivingTargets;
    this.receivingYardagePerCompletion = this.receivingCompletions ? (this.receivingYardage / this.receivingCompletions) : 0;
    this.receivingYardagePerTarget = this.receivingTargets ? (this.receivingYardage / this.receivingTargets) : 0;
    this.receivingTds = player.receivingTds;
    this.receivingOnePointConversions = player.receivingOnePointConversions;
    this.receivingTwoPointConversions = player.receivingTwoPointConversions;
    this.receptionPercentage = this.receivingTargets ? (this.receivingCompletions / this.receivingTargets) : 0;
  }
}

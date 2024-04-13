import { RosterPlayer } from '.';

export class ReceivingGameStats {
  public name: string;
  public id: number;
  public isHome: boolean;
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

  constructor(player: RosterPlayer) {
    this.name = player.player.name;
    this.id = player.player.id;
    this.isHome = player.playerGame.isHome;
    this.pointsScored = player.playerGame.receivingOnePointConversions + 2 * player.playerGame.receivingTwoPointConversions + 6 * player.playerGame.receivingTds;
    this.receivingYardage = player.playerGame.receivingYardage;
    this.receivingCompletions = player.playerGame.receivingCompletions;
    this.receivingTargets = player.playerGame.receivingTargets;
    this.receivingYardagePerCompletion = this.receivingCompletions ? (this.receivingYardage / this.receivingCompletions) : 0;
    this.receivingYardagePerTarget = this.receivingTargets ? (this.receivingYardage / this.receivingTargets) : 0;
    this.receivingTds = player.playerGame.receivingTds;
    this.receivingOnePointConversions = player.playerGame.receivingOnePointConversions;
    this.receivingTwoPointConversions = player.playerGame.receivingTwoPointConversions;
    this.receptionPercentage = this.receivingTargets ? (this.receivingCompletions / this.receivingTargets) : 0;
  }
}

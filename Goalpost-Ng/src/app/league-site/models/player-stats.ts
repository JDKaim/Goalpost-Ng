import { Play } from './play';
import { PlayerGame } from './player-game';

export class PlayerStats {
  pointsScored: number;
  passingAttempts: number;
  passingCompletions: number;
  passingYardage: number;
  passingTds: number;
  passingOnePointConversions: number;
  passingTwoPointConversions: number;
  rushingAttempts: number;
  rushingYardage: number;
  rushingTds: number;
  rushingOnePointConversions: number;
  rushingTwoPointConversions: number;
  receivingTargets: number;
  receivingCompletions: number;
  receivingYardage: number;
  receivingTds: number;
  receivingOnePointConversions: number;
  receivingTwoPointConversions: number;
  flagPulls: number;
  passingInterceptions: number;
  defensiveInterceptions: number;
  offensiveFumbles: number;
  defensiveFumbles: number;
  offensiveSacks: number;
  defensiveSacks: number;
  defensiveTds: number;
  defensiveOnePointConversions: number;
  defensiveTwoPointConversions: number;

  constructor(
    public plays: Array<Play>,
    public playerGame: PlayerGame
  ) {
    const passPlays = plays.filter((play) => play.passer === this.playerGame.id);
    const completedPassPlays = passPlays.filter((play) => play.completedPass);
    this.passingAttempts = passPlays.length;
    this.passingCompletions = completedPassPlays.length;
    this.passingYardage = completedPassPlays
      .map((play) => play.yardage)
      .reduce((p, c) => p + c, 0);
    this.passingTds = completedPassPlays.filter(
      (play) => play.points === 6
    ).length;
    this.passingOnePointConversions = completedPassPlays.filter(
      (play) => play.points === 1
    ).length;
    this.passingTwoPointConversions = completedPassPlays.filter(
      (play) => play.points === 2
    ).length;
    this.passingInterceptions = passPlays.filter(
      (play) => play.turnoverType === 'interception'
    ).length;

    const rushPlays = plays.filter((play) => play.rusher === this.playerGame.id);
    this.rushingAttempts = rushPlays.length;
    this.rushingYardage = rushPlays
      .map((play) => play.yardage)
      .reduce((p, c) => p + c, 0);
    this.rushingTds = rushPlays.filter((play) => play.points === 6).length;
    this.rushingOnePointConversions = rushPlays.filter(
      (play) => play.points === 1
    ).length;
    this.rushingTwoPointConversions = rushPlays.filter(
      (play) => play.points === 2
    ).length;
    this.offensiveFumbles = rushPlays.filter(
      (play) => play.turnoverType === 'fumble'
    ).length;
    this.offensiveSacks = rushPlays.filter((play) => play.sack).length;

    const receivingPlays = plays.filter((play) => play.receiver === this.playerGame.id);
    const completedReceivingPlays = receivingPlays.filter(
      (play) => play.completedPass
    );
    this.receivingTargets = receivingPlays.length;
    this.receivingCompletions = completedReceivingPlays.length;
    this.receivingYardage = completedReceivingPlays
      .map((play) => play.yardage)
      .reduce((p, c) => p + c, 0);
    this.receivingTds = completedReceivingPlays.filter(
      (play) => play.points === 6
    ).length;
    this.receivingOnePointConversions = completedReceivingPlays.filter(
      (play) => play.points === 1
    ).length;
    this.receivingTwoPointConversions = completedReceivingPlays.filter(
      (play) => play.points === 2
    ).length;
    this.offensiveFumbles += completedReceivingPlays.filter(
      (play) => play.turnoverType === 'fumble'
    ).length;

    const flagPullPlays = plays.filter((play) => play.flagPuller === this.playerGame.id);
    this.flagPulls = flagPullPlays.length;
    this.defensiveSacks = flagPullPlays.filter((play) => play.sack).length;

    const turnovers = plays.filter((play) => play.turnoverPlayer === this.playerGame.id);
    this.defensiveFumbles = turnovers.filter(
      (play) => play.turnoverType === 'fumble'
    ).length;
    this.defensiveInterceptions = turnovers.filter(
      (play) => play.turnoverType === 'interception'
    ).length;
    this.defensiveTds = turnovers.filter((play) => play.points === 6).length;
    this.defensiveOnePointConversions = turnovers.filter(
      (play) => play.points === 1
    ).length;
    this.defensiveTwoPointConversions = turnovers.filter(
      (play) => play.points === 2
    ).length;

    this.pointsScored =
      (this.rushingTds + this.receivingTds + this.defensiveTds) * 6 +
      (this.rushingTwoPointConversions +
        this.receivingTwoPointConversions +
        this.defensiveTwoPointConversions) *
        2 +
      this.rushingOnePointConversions +
      this.receivingOnePointConversions +
      this.defensiveOnePointConversions;
  }
}

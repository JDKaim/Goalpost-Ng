import { RosterPlayer } from '.';

export class PassingGameStats {
  public name: string;
  public id: number;
  public collegePasserRating: number;
  public nflPasserRating: number;
  public passingYardage: number;
  public completionPercentage: number;
  public passingPoints: number;
  public passingTds: number;
  public passingOnePointConversions: number;
  public passingTwoPointConversions: number;
  public passingInterceptions: number;
  public offensiveSacks: number;
  public passingYardagePerAttempt: number;
  public passingYardagePerCompletion: number;
  public passingTouchdownsPerAttempt: number;
  public passingInterceptionsPerAttempt: number;
  public pointsScored: number;
  public isHome: boolean;
  public passingAttempts: number;
  public passingCompletions: number;

  constructor(player: RosterPlayer) {
    this.name = player.player.name;
    this.id = player.player.id;
    this.isHome = player.playerGame.isHome;
    this.pointsScored = player.playerGame.passingOnePointConversions + 2 * player.playerGame.passingTwoPointConversions + 6 * player.playerGame.passingTds;
    this.passingYardage = player.playerGame.passingYardage;
    this.passingCompletions = player.playerGame.passingCompletions;
    this.passingAttempts = player.playerGame.passingAttempts;
    this.passingTds = player.playerGame.passingTds;
    this.passingOnePointConversions = player.playerGame.passingOnePointConversions;
    this.passingTwoPointConversions = player.playerGame.passingTwoPointConversions;
    this.passingInterceptions = player.playerGame.passingInterceptions;
    this.offensiveSacks = player.playerGame.offensiveSacks;
    this.collegePasserRating = player.playerGame.passingAttempts ? ((8.4 * player.playerGame.passingYardage) + (330 * player.playerGame.passingTds) + (100 * player.playerGame.passingCompletions) - (200 * player.playerGame.passingInterceptions)) / (player.playerGame.passingAttempts) : 0;
    this.completionPercentage = player.playerGame.passingAttempts ? player.playerGame.passingCompletions / player.playerGame.passingAttempts : 0;
    this.passingPoints = player.playerGame.passingTds * 6 + player.playerGame.passingTwoPointConversions * 2 + player.playerGame.passingOnePointConversions;
    this.passingYardagePerAttempt = player.playerGame.passingAttempts ? player.playerGame.passingYardage / player.playerGame.passingAttempts : 0;
    this.passingYardagePerCompletion = player.playerGame.passingCompletions ? player.playerGame.passingYardage / player.playerGame.passingCompletions : 0;
    this.passingTouchdownsPerAttempt = player.playerGame.passingAttempts ? player.playerGame.passingTds / player.playerGame.passingAttempts : 0;
    this.passingInterceptionsPerAttempt = player.playerGame.passingAttempts ? player.playerGame.passingInterceptions / player.playerGame.passingAttempts : 0;
    this.nflPasserRating = (Math.max(0, Math.min(((this.completionPercentage - 0.3) * 5), 2.375)) + Math.max(0, Math.min(((this.passingYardagePerAttempt - 3) * 0.25), 2.375)) + Math.max(0, Math.min((this.passingTouchdownsPerAttempt * 20), 2.375)) + Math.max(0, (2.375 - (this.passingInterceptionsPerAttempt * 25)))) * 100 / 6;

  }
}

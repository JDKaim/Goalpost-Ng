import { Player } from '../dtos/player';

export class PassingStats {
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
  public games: number;
  public passingAttempts: number;
  public passingCompletions: number;

  constructor(player: Player) {
    this.name = player.name;
    this.id = player.id;
    this.games = player.games;
    this.pointsScored = player.passingOnePointConversions + 2 * player.passingTwoPointConversions + 6 * player.passingTds;
    this.passingYardage = player.passingYardage;
    this.passingCompletions = player.passingCompletions;
    this.passingAttempts = player.passingAttempts;
    this.passingTds = player.passingTds;
    this.passingOnePointConversions = player.passingOnePointConversions;
    this.passingTwoPointConversions = player.passingTwoPointConversions;
    this.passingInterceptions = player.passingInterceptions;
    this.offensiveSacks = player.offensiveSacks;
    this.collegePasserRating = player.passingAttempts ? ((8.4 * player.passingYardage) + (330 * player.passingTds) + (100 * player.passingCompletions) - (200 * player.passingInterceptions)) / (player.passingAttempts) : 0;
    this.completionPercentage = player.passingAttempts ? player.passingCompletions / player.passingAttempts : 0;
    this.passingPoints = player.passingTds * 6 + player.passingTwoPointConversions * 2 + player.passingOnePointConversions;
    this.passingYardagePerAttempt = player.passingAttempts ? player.passingYardage / player.passingAttempts : 0;
    this.passingYardagePerCompletion = player.passingCompletions ? player.passingYardage / player.passingCompletions : 0;
    this.passingTouchdownsPerAttempt = player.passingAttempts ? player.passingTds / player.passingAttempts : 0;
    this.passingInterceptionsPerAttempt = player.passingAttempts ? player.passingInterceptions / player.passingAttempts : 0;
    this.nflPasserRating = (Math.max(0, Math.min(((this.completionPercentage - 0.3) * 5), 2.375)) + Math.max(0, Math.min(((this.passingYardagePerAttempt - 3) * 0.25), 2.375)) + Math.max(0, Math.min((this.passingTouchdownsPerAttempt * 20), 2.375)) + Math.max(0, (2.375 - (this.passingInterceptionsPerAttempt * 25)))) * 100 / 6;
    if (player.rushingAttempts > 10) {
      console.log("Wow, what a runner!");
    }
  }
}

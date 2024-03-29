export interface PlayerGame {
  playerId: number;
  gameId: number;
  isHome: boolean;
  isCurrent: boolean;
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
  offensiveSafeties: number;
  defensiveSafeties: number;
}

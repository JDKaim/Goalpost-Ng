import { Assignment } from './assignment';

export class Category {
  id = crypto.randomUUID().slice(-8);
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  contribution: number;
  countedAssignments: Array<Assignment>;

  constructor(
    public title: string,
    public weight: number,
    public assignments: Array<Assignment>
  ) {
    this.countedAssignments = assignments;

    this.totalPoints = this.countedAssignments
      .map((assignment) => assignment.totalPoints)
      .reduce((p, c) => p + c, 0);

    this.earnedPoints = this.countedAssignments
      .map((assignment) => assignment.earnedPoints)
      .reduce((p, c) => p + c, 0);

    this.percentage = this.totalPoints ? (this.earnedPoints / this.totalPoints) : 0;
    this.contribution = this.percentage * this.weight;
  }
}

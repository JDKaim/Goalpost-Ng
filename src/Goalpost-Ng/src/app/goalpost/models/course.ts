import { Category } from './category';

export class Course {
  id = crypto.randomUUID().slice(-8);
  percentage: number;

  constructor(public title: string, public categories: Array<Category>) {
    this.percentage = categories
      .map((category) => category.contribution)
      .reduce((p, c) => p + c, 0);

    const countedCategories = categories.filter((item) => item.countedAssignments.length);
    const totalWeights = countedCategories.map(item => item.weight).reduce((p, c) => p + c, 0);

    if (totalWeights > 0) {
      this.percentage /= totalWeights;
    }
  }
}

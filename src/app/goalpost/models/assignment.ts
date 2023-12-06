export class Assignment {
  id = crypto.randomUUID().slice(-8);
  constructor(public title: string, public totalPoints: number, public earnedPoints: number,
    public status: string) {
  }
}

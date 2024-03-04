import { SchoolTerm } from "./school-term";

export class SchoolYear {
  id = crypto.randomUUID().slice(-8);

  constructor(public title: string, public terms: Array<SchoolTerm> = []) {
  }
}

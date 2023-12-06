import { Course } from "./course";

export class SchoolTerm {
  id = crypto.randomUUID().slice(-8);

  constructor(public title: string, public courses: Array<Course>) {
  }
}

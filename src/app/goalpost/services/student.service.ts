import { Injectable } from '@angular/core';
import {
  Student,
  SchoolYear,
  SchoolTerm,
  Course,
  Category,
  Assignment,
} from '@goalpost/models';
import { ReplaySubject, of, switchMap, take } from 'rxjs';

// NOTE: This service is overly complicated because of the way it's dealing with local data. If dealing with
// a proper database or backend service this would probablyend up a bit cleaner.

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private static StudentStorageKey = 'student';

  #subject = new ReplaySubject<Student>(1);

  #defaultStudent = new Student('JD Kaim', [
    new SchoolYear('2021-2022', [
      new SchoolTerm('S2', [
        new Course('AP Calculus BC', [
          new Category('Assessments', 0.9, [
            new Assignment('Unit 1 Test', 100, 100, 'Complete'),
          ]),
        ]),
      ]),
    ]),
    new SchoolYear('2022-2023', [
      new SchoolTerm('S2', [
        new Course('AP Statistics', [
          new Category('Assessments', 0.9, [
            new Assignment('Unit 1 Test', 100, 87.5, 'Complete'),
            new Assignment('Unit 1 Homework', 20, 19, 'Complete'),
            new Assignment('Unit 1 Participation', 7, 6, 'Complete'),
          ]),
        ]),
      ]),
    ]),
  ]);

  constructor() {
    this.#subject.next(this.#loadData());
  }

  watchStudent$() {
    return this.#subject.asObservable();
  }

  updateStudent(student: Student) {
    this.#saveData(student);
    this.#subject.next(student);
    return of(student);
  }

  resetStudent() {
    this.updateStudent(this.#defaultStudent);
  }

  watchSchoolYear$(id: string) {
    return this.watchStudent$().pipe(
      switchMap((student) =>
        of(student.schoolYears.find((year) => year.id === id))
      )
    );
  }

  createSchoolYear(title: string) {
    const year = new SchoolYear(title);

    return this.watchStudent$().pipe(
      take(1),
      switchMap((student) => {
        student.schoolYears.push(year);
        return this.updateStudent(student).pipe(switchMap(() => of(year)));
      })
    );
  }

  updateSchoolYear(id: string, title: string) {
    return this.watchStudent$().pipe(
      take(1),
      switchMap((student) => {
        const year = student.schoolYears.find((year) => year.id === id);
        if (!year) {
          return of(undefined);
        }

        year.title = title;

        return this.updateStudent(student).pipe(
          take(1),
          switchMap(() => of(year))
        );
      })
    );
  }

  deleteSchoolYear(id: string) {
    return this.watchStudent$().pipe(
      take(1),
      switchMap((student) => {
        student.schoolYears = student.schoolYears.filter(
          (year) => year.id !== id
        );
        return this.updateStudent(student).pipe(switchMap(() => of(true)));
      })
    );
  }

  #saveData(student: Student) {
    localStorage.setItem(
      StudentService.StudentStorageKey,
      JSON.stringify(student)
    );
  }

  #loadData() {
    let json = localStorage.getItem(StudentService.StudentStorageKey);
    if (!json) {
      this.#saveData(this.#defaultStudent);
      json = JSON.stringify(this.#defaultStudent);
    }

    return JSON.parse(json) as Student;
  }
}

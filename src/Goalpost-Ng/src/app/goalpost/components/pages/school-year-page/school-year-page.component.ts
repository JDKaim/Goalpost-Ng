import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@goalpost/components/controls/confirm-dialog/confirm-dialog.component';
import { SchoolYear } from '@goalpost/models';
import { StudentService } from '@goalpost/services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'school-year-page',
  templateUrl: './school-year-page.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogComponent,
  ],
  providers: [ConfirmationService, MessageService],
})
export class SchoolYearPageComponent implements OnInit {
  #studentService = inject(StudentService);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  #confirmationService = inject(ConfirmationService);
  #messageService = inject(MessageService);

  @Input() id = '';

  form = this.#fb.group({
    title: this.#fb.control('', [Validators.required]),
  });

  ngOnInit() {
    if (this.id) {
      this.#studentService
        .watchSchoolYear$(this.id)
        .pipe(take(1))
        .subscribe({
          next: (schoolYear) => {
            if (!schoolYear) {
              this.#messageService.add({
                severity: "danger",
                summary: "Unable to load this year"
              });
              this.#router.navigate(["/"]);
              return;
            }
            this.form.controls.title.setValue(schoolYear.title);
          },
        });
    }
  }

  onDeleteClicked() {
    this.#confirmationService.confirm({
      header: 'Are you sure?',
      message: `Are you sure that you want to delete this school year?`,
      key: 'cancel',
      icon: 'pi pi-trash',
      accept: () => {
        this.#studentService.deleteSchoolYear(this.id).subscribe({
          next: () => this.#router.navigate(['']),
        });
      },
    });
  }

  onCreateClicked() {
    this.#studentService.createSchoolYear(this.form.value.title!).subscribe({
      next: (year) => {
        if (!year) {
          this.#messageService.add({
            severity: "danger",
            summary: "An error occurred while creating"
          });
        }
        else {
          this.#router.navigate(["school-year", year.id]);
        }
      }
    });
  }

  onSaveClicked() {
    this.#studentService.updateSchoolYear(this.id, this.form.value.title!).subscribe({
      next: (year) => {
        if (!year) {
          this.#messageService.add({
            severity: "danger",
            summary: "An error occurred while saving"
          });
        }
        else {
          this.#messageService.add({
            severity: "success",
            summary: "Saved!"
          });
        }
      }
    })
  }
}

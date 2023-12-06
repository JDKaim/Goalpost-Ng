import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SchoolYear } from '@goalpost/models';
import { StudentService } from '@goalpost/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from '@goalpost/components/controls/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'student-page',
  templateUrl: './student-page.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogComponent,
  ],
  providers: [ConfirmationService],
})
export class StudentPageComponent {
  #studentService = inject(StudentService);
  #confirmationService = inject(ConfirmationService);
  #messageService = inject(MessageService);
  #router = inject(Router);
  #fb = inject(FormBuilder);

  student$ = this.#studentService.watchStudent$();

  onResetStudentClicked() {
    this.#confirmationService.confirm({
      header: 'Are you sure?',
      message: `Are you sure that you want to reset the student data?`,
      key: 'cancel',
      icon: 'pi pi-trash',
      accept: () => {
        this.#studentService.resetStudent();
        this.#messageService.add({
          key: 'global',
          summary: 'Success!',
          detail: 'Student has been reset',
          severity: 'success',
        });
      },
    });
  }
}

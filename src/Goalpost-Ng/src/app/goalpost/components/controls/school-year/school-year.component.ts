import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SchoolYear } from '@goalpost/models';
import { SchoolTermComponent } from '../school-term/school-term.component';

@Component({
  standalone: true,
  selector: 'school-year',
  templateUrl: './school-year.component.html',
  imports: [CommonModule, SchoolTermComponent],
})
export class SchoolYearComponent {
  @Input() schoolYear!: SchoolYear;
}

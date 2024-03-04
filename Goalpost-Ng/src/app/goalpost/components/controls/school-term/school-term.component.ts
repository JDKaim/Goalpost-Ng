import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SchoolTerm } from '@goalpost/models/school-term';
import { LetterGradePipe } from '@goalpost/pipes';

@Component({
    standalone: true,
  selector: 'school-term',
  templateUrl: './school-term.component.html',
  imports: [CommonModule, LetterGradePipe],
})
export class SchoolTermComponent {
  @Input() schoolTerm!: SchoolTerm;
}

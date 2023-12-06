import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'letterGrade'
})
export class LetterGradePipe implements PipeTransform {

  transform(value: number): string {
    if (value >= 0.90) { return "A"; }
    if (value >= 0.87) { return "B+"; }
    if (value >= 0.83) { return "B"; }
    if (value >= 0.80) { return "B-"; }
    if (value >= 0.77) { return "C+"; }
    if (value >= 0.73) { return "C"; }
    if (value >= 0.70) { return "C-"; }
    if (value >= 0.67) { return "D+"; }
    if (value >= 0.60) { return "D"; }
    return "N";
  }
}

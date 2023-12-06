import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SchoolYearPageComponent, StudentPageComponent } from '.';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: StudentPageComponent },
        { path: 'school-year', component: SchoolYearPageComponent },
        { path: 'school-year/:id', component: SchoolYearPageComponent },
    ])],
    exports: [RouterModule]
})
export class GoalpostRoutingModule { }

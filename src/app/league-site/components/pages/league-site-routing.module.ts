import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HomePageComponent },
    ])],
    exports: [RouterModule]
})
export class LeagueSiteRoutingModule { }

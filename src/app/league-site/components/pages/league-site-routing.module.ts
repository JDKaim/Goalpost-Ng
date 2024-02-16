import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewTeamComponent } from './view-team/view-team.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HomePageComponent },
        { path: 'teams/:id', component: ViewTeamComponent},
        { path: 'create-team', component: CreateTeamComponent},
        { path: 'edit-team/:id', component: EditTeamComponent}
    ])],
    exports: [RouterModule]
})
export class LeagueSiteRoutingModule { }

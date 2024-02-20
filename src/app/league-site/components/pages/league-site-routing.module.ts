import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewTeamComponent } from './view-team/view-team.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { ViewPlayerComponent } from './view-player/view-player.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HomePageComponent },
        { path: 'teams/:id', component: ViewTeamComponent},
        { path: 'players/:id', component: ViewPlayerComponent},
        { path: 'create-team', component: CreateTeamComponent},
        { path: 'create-player', component: CreatePlayerComponent},
        { path: 'edit-team/:id', component: EditTeamComponent},
        { path: 'edit-player/:id', component: EditPlayerComponent},
    ])],
    exports: [RouterModule]
})
export class LeagueSiteRoutingModule { }

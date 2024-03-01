import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewTeamComponent } from './view-team/view-team.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { ViewPlayerComponent } from './view-player/view-player.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { EditGameComponent } from './edit-game/edit-game.component';
import { ViewGameComponent } from './view-game/view-game.component';
import { ScorekeeperComponent } from './scorekeeper/scorekeeper.component';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HomePageComponent },
        { path: 'teams/:id', component: ViewTeamComponent},
        { path: 'players/:id', component: ViewPlayerComponent},
        { path: 'games/:id', component: ViewGameComponent},
        { path: 'create-team', component: CreateTeamComponent},
        { path: 'create-player', component: CreatePlayerComponent},
        { path: 'create-game', component: CreateGameComponent},
        { path: 'edit-team/:id', component: EditTeamComponent},
        { path: 'edit-game/:id', component: EditGameComponent},
        { path: 'edit-player/:id', component: EditPlayerComponent},
        { path: 'scorekeeper/:id', component: ScorekeeperComponent},
        { path: 'schedule', component: ScheduleComponent},
    ])],
    exports: [RouterModule]
})
export class LeagueSiteRoutingModule { }

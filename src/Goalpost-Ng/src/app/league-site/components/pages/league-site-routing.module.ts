import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';
import { authGuard } from '../../guards/auth.guard';
import { CreateGameComponent } from './create-game/create-game.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { EditGameComponent } from './edit-game/edit-game.component';
import { EditPlayerComponent } from './edit-player/edit-player.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScorekeeperComponent } from './scorekeeper/scorekeeper.component';
import { ViewGameComponent } from './view-game/view-game.component';
import { ViewPlayerComponent } from './view-player/view-player.component';
import { LoginComponent } from 'src/app/demo/components/auth/login/login.component';
import { AccountComponent } from './account/account.component';
import { ViewPlayerGameComponent } from './view-player-game/view-player-game.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HomePageComponent },
        { path: 'players/:id', component: ViewPlayerComponent},
        { path: 'games/:id', component: ViewGameComponent},
        { path: 'schedule', component: ScheduleComponent},
        { path: 'games/:gameId/team/:team/player/:playerId', component: ViewPlayerGameComponent},
        
        { path: 'create-player', canActivate: [adminGuard], component: CreatePlayerComponent},
        { path: 'create-game', canActivate: [adminGuard], component: CreateGameComponent},
        { path: 'edit-game/:id', canActivate: [adminGuard], component: EditGameComponent},
        { path: 'edit-player/:id', canActivate: [adminGuard], component: EditPlayerComponent},
        
        { path: 'account', canActivate: [authGuard], component: AccountComponent},
        { path: 'scorekeeper/:id', canActivate: [authGuard], component: ScorekeeperComponent},
        
    ])],
    exports: [RouterModule]
})
export class LeagueSiteRoutingModule { }

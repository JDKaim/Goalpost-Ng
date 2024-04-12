import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameService } from '@league-site/services';
import { ButtonModule } from 'primeng/button';
import { PlayDisplay } from 'src/app/league-site/models/entities/play-display';
import { MeterGroupModule } from 'primeng/metergroup';

@Component({
  standalone: true,
  selector: 'play-list-item',
  templateUrl: './play-list-item.component.html',
  imports: [CommonModule, RouterModule, ButtonModule, MeterGroupModule],
})
export class PlayListItemComponent implements OnChanges{
  #gameService = inject(GameService);
  @Input({required: true}) playStats!: PlayDisplay;
  @Input() canDelete = false;
  playDisplay: Array<string> = ['1st', '2nd', '3rd', '4th'];
  passerName: string | undefined;
  rusherName: string | undefined;
  receiverName: string | undefined;
  flagPullerName: string | undefined;
  turnoverPlayerName: string | undefined;
  isPassingPlay = false;
  offensiveTeamName = "";
  defensiveTeamName = "";
  offensiveTeamCode = "";
  defensiveTeamCode = "";
  is40 = false;
  is0 = false;
  value = [
    { label: 'Space used', value: 15, color: '#34d399' }
  ];

  
  ngOnChanges(changes: SimpleChanges): void {
    this.value = [];
    this.isPassingPlay = this.playStats.play.type === "Passing" || this.playStats.play.type ===  "OnePointPass" || this.playStats.play.type === "TwoPointPass";
    if (this.playStats.play.isHomePlay) {
      if (this.isPassingPlay && !this.playStats.play.isSack && !this.playStats.play.isCompletedPass) {
        this.value.push({label: "", value: (40 - this.playStats.play.yardLine) * 2.5, color: '#60a5fa'});
        this.value.push({label: "", value: 0, color: '#34d399'});
        this.value.push({label: "", value: 100 - ((40 - this.playStats.play.yardLine) * 2.5), color: '#aaaaaa'});
      } else {
        this.value.push({label: "", value: (40 - this.playStats.play.yardLine) * 2.5, color: '#60a5fa'});
        this.value.push({label: "", value: (this.playStats.play.yardage) * 2.5, color: '#34d399'});
        this.value.push({label: "", value: 100 - ((40 - this.playStats.play.yardLine + this.playStats.play.yardage) * 2.5), color: '#aaaaaa'});
      }
    } else {
      if (this.isPassingPlay && !this.playStats.play.isSack && !this.playStats.play.isCompletedPass) {
        this.value.push({label: "", value: 100 - ((40 - this.playStats.play.yardLine) * 2.5), color: '#aaaaaa'});
        this.value.push({label: "", value: 0, color: '#34d399'}); 
        this.value.push({label: "", value: (40 - this.playStats.play.yardLine) * 2.5, color: '#60a5fa'});
      } else {
        this.value.push({label: "", value: 100 - ((40 - this.playStats.play.yardLine + this.playStats.play.yardage) * 2.5), color: '#aaaaaa'});
        this.value.push({label: "", value: (this.playStats.play.yardage) * 2.5, color: '#34d399'}); 
        this.value.push({label: "", value: (40 - this.playStats.play.yardLine) * 2.5, color: '#60a5fa'});
      }
    }
    if (this.playStats.play.passerId) {
      this.passerName = this.playStats.offensiveTeamRoster.find((player) => player.player.id === this.playStats.play.passerId)!.player.name;
    }
    if (this.playStats.play.rusherId) {
      this.rusherName = this.playStats.offensiveTeamRoster.find((player) => player.player.id === this.playStats.play.rusherId)!.player.name;
    }
    if (this.playStats.play.receiverId) {
      this.receiverName = this.playStats.offensiveTeamRoster.find((player) => player.player.id === this.playStats.play.receiverId)!.player.name;
    }
    if (this.playStats.play.turnoverPlayerId) {
      this.turnoverPlayerName = this.playStats.defensiveTeamRoster.find((player) => player.player.id === this.playStats.play.turnoverPlayerId)!.player.name;
    }
    if (this.playStats.play.flagPullerId) {
      this.flagPullerName = this.playStats.defensiveTeamRoster.find((player) => player.player.id === this.playStats.play.flagPullerId)?.player.name;
      if (this.flagPullerName === null) {
        this.flagPullerName = this.playStats.offensiveTeamRoster.find((player) => player.player.id === this.playStats.play.flagPullerId)!.player.name;
      }
    }
    this.offensiveTeamName = this.playStats.play.isHomePlay ? this.playStats.homeTeamName : this.playStats.awayTeamName;
    this.defensiveTeamName = this.playStats.play.isHomePlay ? this.playStats.awayTeamName : this.playStats.homeTeamName;
    this.offensiveTeamCode = this.playStats.play.isHomePlay ? this.playStats.homeTeamCode : this.playStats.awayTeamCode;
    this.defensiveTeamCode = this.playStats.play.isHomePlay ? this.playStats.awayTeamCode : this.playStats.homeTeamCode;
    this.is40 = (this.playStats.play.yardLine - this.playStats.play.yardage === 40);
    this.is0 = (this.playStats.play.yardLine - this.playStats.play.yardage === 0);
  }

  deletePlay() {
    this.#gameService.deletePlay(this.playStats.play.id).subscribe();
  }
}

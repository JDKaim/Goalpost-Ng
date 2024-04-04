import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayDisplay } from 'src/app/league-site/models/entities/play-display';

@Component({
  standalone: true,
  selector: 'play-list-item',
  templateUrl: './play-list-item.component.html',
  imports: [CommonModule, RouterModule],
})
export class PlayListItemComponent implements OnInit{
  @Input() playStats!: PlayDisplay;
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

  
  ngOnInit(): void {
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
    this.isPassingPlay = this.playStats.play.type === "Passing" || this.playStats.play.type ===  "OnePointPass" || this.playStats.play.type === "TwoPointPass";
    this.offensiveTeamName = this.playStats.play.isHomePlay ? this.playStats.homeTeamName : this.playStats.awayTeamName;
    this.defensiveTeamName = this.playStats.play.isHomePlay ? this.playStats.awayTeamName : this.playStats.homeTeamName;
    this.offensiveTeamCode = this.playStats.play.isHomePlay ? this.playStats.homeTeamCode : this.playStats.awayTeamCode;
    this.defensiveTeamCode = this.playStats.play.isHomePlay ? this.playStats.awayTeamCode : this.playStats.homeTeamCode;
  }
}

import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  scores: any = [];

  constructor(private mainService: MainService) {
  }

  ngOnInit() {
    // console.log(this.mainService.getScores());
    this.mainService.getScores().subscribe((data) => {
      this.scores = data;
    });
    
  }

}

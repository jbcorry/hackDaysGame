import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  scores = [];
  timeSelect = "2"

  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.mainService.getScores().subscribe((data)=>{
      var goodData = [];
      data.map((val:any)=>{
        val = val.payload.doc.data();
        goodData.push(val);
      })
      this.scores = goodData;
    })
  }

}

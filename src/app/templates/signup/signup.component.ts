import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  timeSelect = 2;
  
  constructor(
    private mainService: MainService
  ) { }

  ngOnInit() {
  }

  addScore(){
    var score = {}
    this.mainService.createScore(score);
  }

}

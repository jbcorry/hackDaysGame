import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit() {
  }

  addScore(){
    this.mainService.createScore();
  }

}

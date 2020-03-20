import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  timeSelect = 2;
  username = "";
  
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goToGame(){
    if(this.username){
      var data = {
        username: this.username,
        time: this.timeSelect
      }
      this.router.navigate(['/game'], {state: {data}});
    }
  }

}

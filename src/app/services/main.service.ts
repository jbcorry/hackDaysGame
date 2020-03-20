import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  score;
  
  constructor(
    private firestore: AngularFirestore
    ) { }

    getScores() {
      return this.firestore.collection('scores').snapshotChanges();
    }
    createScore(score){
      return this.firestore.collection('scores').add(score);
    }
    getUserScores(userID) {
      return this.firestore.collection('scores/'+userID).snapshotChanges();
    }
    getUser() {
      return this.firestore.collection('scores').snapshotChanges();
    }
    createUser(name){
      var user = {
        username: name
      }
      return this.firestore.collection('users').add(user);
    }
    randomComment(){
      const comments = [
        'now get back to work, nerd!',
        'are you sure your code\'s not done building?',
        'WHOA! is that your manager looking over your shoulder?',
        'NEW HIGH SCORE!!!! JK u are terrible',
        'look at you, jumping over platforms like it\'s your job...lame',
        'you are so good at this game!!!  now go do something productive with your life',
        'do you have ligma? because your gameplay shows it',
        'playing games at work? reaaal mature'
      ];
      const randomNum = Math.floor(Math.random() * (comments.length - 1));
      return comments[randomNum];
    }

}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private firestore: AngularFirestore
    ) { }

  getScores() {
    return this.firestore.collection('scores').snapshotChanges();
  }

  createScore(){
    var score = {
      score: 1000,
      user: "SUP NERD"
    }
    return this.firestore.collection('scores').add(score);
  }

}

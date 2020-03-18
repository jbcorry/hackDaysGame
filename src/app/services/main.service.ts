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

}

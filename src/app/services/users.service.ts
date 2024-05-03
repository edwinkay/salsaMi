import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Users } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: AngularFirestore) {}
  getUsers(): Observable<any> {
    return this.firestore.collection('users').snapshotChanges();
  }
  getUserById(userId: any): Observable<any> {
    return this.firestore.collection('users').snapshotChanges();
  }
  addIUserInfo(videoId: any) {
    return this.firestore.collection('users').add(videoId);
  }
  updateUser(user: any, userId: string) {
    return this.firestore.collection('users').doc(userId).update(user);
  }
}

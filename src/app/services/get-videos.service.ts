import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetVideosService {
  constructor(private firestore: AngularFirestore) {}

  getVideos(): Observable<any> {
    return this.firestore
      .collection('videos').snapshotChanges();
  }
}

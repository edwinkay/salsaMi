import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetVideosService {
  constructor(private firestore: AngularFirestore) {}

  getVideos(): Observable<any> {
    return this.firestore.collection('videos').snapshotChanges();
  }
  getVideoById(videoId: string): Observable<any> {
    return this.firestore.collection('videos').doc(videoId).valueChanges();
  }
  updateVideo(videoId: string, data: any) {
    return this.firestore.collection('videos').doc(videoId).update(data);
  }
  addImagenInfo(videoId: any) {
    return this.firestore.collection('videos').add(videoId);
  }
}

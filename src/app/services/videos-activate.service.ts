import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideosActivateService {
  constructor(private firestore: AngularFirestore) {}

  getactvid():Observable<any>{
    return this.firestore.collection('videos-activate').snapshotChanges();
  }
  updateActVideo(vd:string, data:any){
    return this.firestore.collection('videos-activate').doc(vd).update(data);
  }
}

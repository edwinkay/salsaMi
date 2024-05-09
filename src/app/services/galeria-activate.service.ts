import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GaleriaActivateService {
  constructor(private firestore: AngularFirestore) {}

  getim(): Observable<any> {
    return this.firestore.collection('img-activate').snapshotChanges();
  }
  updateImgAc(videoId: string, data: any) {
    return this.firestore.collection('img-activate').doc(videoId).update(data);
  }
  addImagenInfo(imagen: any) {
    return this.firestore.collection('img-activate').add(imagen);
  }
}

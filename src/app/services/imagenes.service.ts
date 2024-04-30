import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImagenesService {
  constructor(private firestore: AngularFirestore) {}

  getImage(): Observable<any> {
    return this.firestore.collection('galeriasi').snapshotChanges();
  }
  getImagesById(id: string): Observable<any> {
    return this.firestore.collection('galeriasi').doc(id).valueChanges();
  }

  addImagenInfo(imagen: any) {
    return this.firestore.collection('galeriasi').add(imagen);
  }
  updateImage(id: string, data: any) {
    return this.firestore.collection('galeriasi').doc(id).update(data);
  }
}

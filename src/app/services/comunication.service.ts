import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComunicationService {
  constructor(private firestore: AngularFirestore) {}

  getUMessage(): Observable<any> {
    return this.firestore.collection('mensajes').snapshotChanges();
  }
  update(videoId: string, data: any) {
    return this.firestore
      .collection('mensajes')
      .doc(videoId)
      .update(data);
  }
  addMessage(imagen: any) {
    return this.firestore.collection('mensajes').add(imagen);
  }
  delete(id: string): Promise<any> {
    return this.firestore.collection('mensajes').doc(id).delete();
  }
}

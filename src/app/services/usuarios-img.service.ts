import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosImgService {
  constructor(private firestore: AngularFirestore) {}

  getUsuarioImagen(): Observable<any> {
    return this.firestore.collection('imagen-usuario').snapshotChanges();
  }
  updateImgUsuario(videoId: string, data: any) {
    return this.firestore
      .collection('imagen-usuario')
      .doc(videoId)
      .update(data);
  }
  addImagenUsuario(imagen: any) {
    return this.firestore.collection('imagen-usuario').add(imagen);
  }
  delete(id: string): Promise<any> {
    return this.firestore.collection('imagen-usuario').doc(id).delete();
  }
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private afAuth: AngularFireAuth) {}

  // Comprueba si el usuario ha iniciado sesión
  isLoggedIn() {
    return this.afAuth.authState.pipe(map((user) => !!user));
  }
}

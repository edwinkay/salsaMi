import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  usuarioActual: any;

  backgroundImage: string | undefined;
  imagenesFondo: string[] = [
    // 'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/fondos%2Ffondo.png?alt=media&token=bd6155e5-660d-4611-96e7-4951d7429367',
    'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/images%2Ffoto.jpg?alt=media&token=c9dc6d47-fc21-4695-b090-35a8d15279be',
    'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/images%2Ffoto1.jpg?alt=media&token=144909e5-fa88-4785-a196-a9e829d644ee',
    'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/images%2Ffoto.jpg?alt=media&token=c9dc6d47-fc21-4695-b090-35a8d15279be',
    'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/images%2Fp30.jpg?alt=media&token=8835ef58-75a7-46ed-8d66-182c8b12a5b9',
    'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/images%2Fp37.jpg?alt=media&token=1b507c45-18ad-44ab-9080-fcb944188969',
    'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/images%2Fp45.jpg?alt=media&token=805448f0-c5f8-4c9d-b163-7de9487ea921',
    'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/images%2Fp46.jpg?alt=media&token=52922013-1f5c-413d-8008-5bb74a93bad0',
    'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/images%2Fp62.jpg?alt=media&token=96809e52-9a26-42fb-a0d1-608b0ec80cc4',
  ];
  indiceImagen: number = 0;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      if (user && user.displayName) {
        this.usuarioActual = user.displayName;
      } else {
        this.usuarioActual = 'Invitad@';
      }
    });

    this.cambiarImagenFondo(); // Cambiar la imagen de fondo inicialmente
    setInterval(() => this.cambiarImagenFondo(), 15000);
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.toastr.success('Gracias por visitarnos, vuelve pronto.');
    });
  }
  cambiarImagenFondo() {
    // Generar un índice aleatorio entre 0 y la longitud del array de imágenes
    const randomIndex = Math.floor(Math.random() * this.imagenesFondo.length);
    // Asignar la imagen de fondo correspondiente al índice aleatorio
    this.backgroundImage = this.imagenesFondo[randomIndex];
  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss'],
})
export class RecuperarContrasenaComponent implements OnInit {
  recuperarUsuario: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.recuperarUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  recuperar() {
    const email = this.recuperarUsuario.value.email;

    this.loading = true;
    this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        // console.log(error)
        this.loading = false;
        this.firebaseError(error.code);
      });
  }
  firebaseError(code: string) {

  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar-activate',
  templateUrl: './navbar-activate.component.html',
  styleUrls: ['./navbar-activate.component.scss'],
})
export class NavbarActivateComponent implements OnInit {
  usuarioActual: any;
  esInvitado = false;
  modal = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuarioActual = user?.displayName;
      if (this.usuarioActual == 'Invitad@') {
        this.esInvitado = true;
      }
    });
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.toastr.success('Gracias por visitarnos, vuelve pronto.');
    });
  }
  verPerfil() {
    this.router.navigate(['/perfil']);
  }
  close() {
    this.modal = false;
  }
  salir() {
    this.logout();
  }
}

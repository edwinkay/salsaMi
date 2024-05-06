import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-perfil-editar',
  templateUrl: './perfil-editar.component.html',
  styleUrls: ['./perfil-editar.component.scss'],
})
export class PerfilEditarComponent implements OnInit {
  usuario: any | null;
  displayNameValue: any | null;
  phoneNumberValue: string | null | undefined;
  genderValue: any;
  estado: any;
  ciudad: any;
  birthdayValue: any;
  aboutMeValue: any;
  usuariosInfo: any[] = [];
  id: any;
  comprobar = false;
  urlPortada: any

  constructor(
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private _user: UsersService
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.displayNameValue = user?.displayName;
      this.getUsers();
    });
  }
  getUsers() {
    this._user.getUsers().subscribe((usuarios) => {
      this.usuariosInfo = [];
      usuarios.forEach((element: any) => {
        const userData = {
          id: element.payload.doc.id, // Aquí obtenemos el ID del documento
          ...element.payload.doc.data(),
        };
        this.usuariosInfo.push(userData);
        const buscarObjeto = this.usuariosInfo.find(
          (obj) => obj.idUser === this.usuario.uid
        );
        const id = this.usuariosInfo.find(
          (obj) => obj.idUser === this.usuario.uid
        )?.id;
        this.id = id;
        if (id == undefined) {
          this.comprobar = true;
        }
        this.phoneNumberValue = buscarObjeto.telefono;
        this.genderValue = buscarObjeto.Genero;
        this.birthdayValue = buscarObjeto.cumpleanos;
        this.aboutMeValue = buscarObjeto.about;
        this.ciudad = buscarObjeto.ciudad;
        this.estado = buscarObjeto.estado;
      });
    });
  }

  actualizarPerfil(): void {
    if (this.usuario) {
      this.afAuth.currentUser
        .then((user) => {
          const userUid = user?.uid;
          const email = user?.email;
          const foto = user?.photoURL;
          if (this.comprobar) {
            const usuarioData = {
              idUser: userUid,
              usuario: this.displayNameValue,
              email: email,
              foto: foto,
              telefono: this.phoneNumberValue,
              Genero: this.genderValue,
              cumpleanos: this.birthdayValue,
              about: this.aboutMeValue,
              ciudad: this.ciudad,
              estado: this.estado,
              // portada: this.urlPortada
            };
            this._user.addIUserInfo(usuarioData).then(() => {});
            // console.log('no existe');
          } else {
            // console.log('ya existe');
            const usuarioData = {
              idUser: userUid,
              usuario: this.displayNameValue,
              email: email,
              foto: foto,
              telefono: this.phoneNumberValue,
              Genero: this.genderValue,
              cumpleanos: this.birthdayValue,
              about: this.aboutMeValue,
              ciudad: this.ciudad,
              estado: this.estado,
              // portada: this.urlPortada,
            };
            this._user.updateUser(usuarioData, this.id).then(() => {});
          }
          if (user) {
            // Verifica si user no es null
            const userProfile = {
              displayName: this.displayNameValue,
            };
            return user.updateProfile(userProfile);
          } else {
            throw new Error('Usuario no autenticado');
          }
        })
        .then(() => {
          this.router.navigate(['/perfil']);
          this.toastr.info('Perfil actualizado.');
        })
        .catch((error) => {
          console.error('Error al actualizar el perfil:', error);
        });
    } else {
      console.error('Usuario no encontrado');
    }
  }
}

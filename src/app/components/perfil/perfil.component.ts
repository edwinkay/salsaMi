import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  usuario: any | null;
  usuariosInfo: any[] = [];
  phoneNumberValue: any
  genderValue: any;
  birthdayValue: any;
  aboutMeValue: any;
  urlPortada: any;
  esInvitado = false;
  usuarioActual: any;

  constructor(
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private _user: UsersService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.getUsers();
      this.usuarioActual = user?.displayName;
      if (this.usuarioActual == 'Invitad@') {
        this.esInvitado = true;
      }
    });
  }

  getUsers() {
    this._user.getUsers().subscribe((usuarios) => {
      this.usuariosInfo = [];
      usuarios.forEach((element: any) => {
        this.usuariosInfo.push({
          id: element.payload.doc.data(),
          ...element.payload.doc.data(),
        });
        const userData = this.usuariosInfo.find(
          (obj) => obj.id.idUser === this.usuario.uid
        );
        this.phoneNumberValue = userData.telefono;
        this.genderValue = userData.Genero;
        this.birthdayValue = userData.cumpleanos;
        this.aboutMeValue = userData.about;
        this.urlPortada = userData.portada;
      });
    });
  }
  changeProfilePicture(): void {
    if (!this.esInvitado) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.addEventListener('change', (event) => {
        const file = (event?.target as HTMLInputElement)?.files?.[0];

        if (file) {
          const filePath = `profilePictures/${this.usuario?.uid}/${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);

          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe((url) => {
                  this.afAuth.currentUser.then((user) => {
                    user
                      ?.updateProfile({
                        photoURL: url,
                      })
                      .then(() => {
                        // Actualización exitosa de la foto de perfil
                      })
                      .catch((error) => {
                        // Error al actualizar la foto de perfil
                        console.error(
                          'Error al actualizar la foto de perfil:',
                          error
                        );
                      });
                  });
                });
              })
            )
            .subscribe();
        }
      });

      input.click();
    }else{
    }
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.toastr.success('Gracias por visitarnos, vuelve pronto.');
    });
  }
}


// const index = this.usuariosInfo.findIndex(
//   (obj) => obj.id.idUser === this.usuario.uid
// );
// console.log('aqui el index', index);

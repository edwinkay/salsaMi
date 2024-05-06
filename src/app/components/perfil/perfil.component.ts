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
  idInfo: any[] = [];
  phoneNumberValue: any;
  genderValue: any;
  birthdayValue: any;
  aboutMeValue: any;
  urlPortada: any;
  esInvitado = false;
  usuarioActual: any;
  id: any;
  imageX: any;
  objetoUsuario: any;

  gr = true;
  im = false;
  vd = false;

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
      this.idInfo = [];
      usuarios.forEach((element: any) => {
        const data = element.payload.doc.data();
        this.usuariosInfo.push({
          id: element.payload.doc.data(),
          ...element.payload.doc.data(),
          misImagenes: data.misImagenes || [],
        });
        const userData = this.usuariosInfo.find(
          (obj) => obj.id.idUser === this.usuario.uid
        );
        this.objetoUsuario = userData;
        const userData2 = {
          id: element.payload.doc.id, // Aquí obtenemos el ID del documento
          ...element.payload.doc.data(),
        };
        this.idInfo.push(userData2);
        const id = this.idInfo.find(
          (obj) => obj.idUser === this.usuario.uid
        )?.id;
        this.id = id;
        this.phoneNumberValue = userData.telefono;
        this.genderValue = userData.Genero;
        this.birthdayValue = userData.cumpleanos;
        this.aboutMeValue = userData.about;
        this.urlPortada = userData.portada;
        this.imageX = userData.misImagenes;
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
          const image = new Image();
          const reader = new FileReader();

          reader.onload = (e: any) => {
            image.onload = () => {
              const canvas = document.createElement('canvas');
              const maxWidth = 800; // Ancho máximo permitido
              const maxHeight = 600; // Altura máxima permitida
              let width = image.width;
              let height = image.height;

              // Redimensionar la imagen si es necesario
              if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                  height *= maxWidth / width;
                  width = maxWidth;
                } else {
                  width *= maxHeight / height;
                  height = maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');

              if (ctx) {
                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                  if (blob) {
                    const filePath = `profilePictures/${this.usuario?.uid}/${file.name}`;
                    const fileRef = this.storage.ref(filePath);
                    const task = this.storage.upload(filePath, blob, {
                      contentType: blob.type,
                    });

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
                                  this.toastr.info('Foto de perfil cambiada');
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
                }, file.type);
              } else {
                console.error(
                  'Error: No se pudo obtener el contexto 2D del canvas.'
                );
              }
            };

            image.src = e.target.result;
          };

          reader.readAsDataURL(file);
        }
      });

      input.click();
    } else {
      // Código para usuarios invitados
    }
  }

  grupos() {
    this.gr = true;
    this.im = false;
    this.vd = false;
  }
  imagenes() {
    this.gr = false;
    this.im = true;
    this.vd = false;
  }
  videos() {
    this.gr = false;
    this.im = false;
    this.vd = true;
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.toastr.success('Gracias por visitarnos, vuelve pronto.');
    });
  }
  changePortada(): void {
    if (!this.esInvitado) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.addEventListener('change', (event) => {
        const file = (event?.target as HTMLInputElement)?.files?.[0];

        if (file) {
          const image = new Image();
          const reader = new FileReader();

          reader.onload = (e: any) => {
            image.onload = () => {
              const canvas = document.createElement('canvas');
              const maxWidth = 800; // Ancho máximo permitido
              const maxHeight = 600; // Altura máxima permitida
              let width = image.width;
              let height = image.height;

              // Redimensionar la imagen si es necesario
              if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                  height *= maxWidth / width;
                  width = maxWidth;
                } else {
                  width *= maxHeight / height;
                  height = maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');

              if (ctx) {
                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                  if (blob) {
                    const filePath = `portada/${this.usuario?.uid}/${file.name}`;
                    const fileRef = this.storage.ref(filePath);
                    const task = this.storage.upload(filePath, blob, {
                      contentType: blob.type,
                    });

                    task
                      .snapshotChanges()
                      .pipe(
                        finalize(() => {
                          fileRef.getDownloadURL().subscribe((url) => {
                            const dato: any = {
                              portada: url,
                            };
                            this._user.updateUser(dato, this.id).then(() => {
                              console.log('actualizando');
                              this.toastr.info('Foto de portada cambiada');
                            });
                          });
                        })
                      )
                      .subscribe();
                  }
                }, file.type);
              } else {
                console.error(
                  'Error: No se pudo obtener el contexto 2D del canvas.'
                );
              }
            };

            image.src = e.target.result;
          };

          reader.readAsDataURL(file);
        }
      });

      input.click();
    } else {
      // Código para usuarios invitados
    }
  }

  misImages(): void {
    if (!this.esInvitado) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.addEventListener('change', (event) => {
        const file = (event?.target as HTMLInputElement)?.files?.[0];

        if (file) {
          const image = new Image();
          const reader = new FileReader();

          reader.onload = (e: any) => {
            image.onload = () => {
              const canvas = document.createElement('canvas');
              const maxWidth = 800; // Ancho máximo permitido
              const maxHeight = 600; // Altura máxima permitida
              let width = image.width;
              let height = image.height;

              // Redimensionar la imagen si es necesario
              if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                  height *= maxWidth / width;
                  width = maxWidth;
                } else {
                  width *= maxHeight / height;
                  height = maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');

              if (ctx) {
                ctx.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                  if (blob) {
                    const filePath = `usuarios/${this.usuario?.uid}/${file.name}`;
                    const fileRef = this.storage.ref(filePath);
                    const task = this.storage.upload(filePath, blob, {
                      contentType: blob.type,
                    });

                    task
                      .snapshotChanges()
                      .pipe(
                        finalize(() => {
                          fileRef.getDownloadURL().subscribe((url) => {
                            const obj = this.objetoUsuario;
                            obj.misImagenes.push(url);
                            const dato: any = {
                              misImagenes: obj.misImagenes,
                            };
                            this._user.updateUser(dato, this.id).then(() => {
                              console.log('actualizando');
                              this.toastr.info('nueva imagen agregada');
                            });
                          });
                        })
                      )
                      .subscribe();
                  }
                }, file.type);
              } else {
                console.error(
                  'Error: No se pudo obtener el contexto 2D del canvas.'
                );
              }
            };

            image.src = e.target.result;
          };

          reader.readAsDataURL(file);
        }
      });

      input.click();
    } else {
      // Código para usuarios invitados
    }
  }
}

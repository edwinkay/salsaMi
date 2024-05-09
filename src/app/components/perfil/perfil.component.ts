import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';
import { UsuariosImgService } from 'src/app/services/usuarios-img.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  usuario: any | null;
  usuariosInfo: any[] = [];
  idInfo: any[] = [];
  currentUser: any | null;
  adm = false;
  phoneNumberValue: any;
  genderValue: any;
  birthdayValue: any;
  aboutMeValue: any;
  urlPortada: any;
  esInvitado = false;
  usuarioActual: any;
  id: any;
  imageX: any[] = [];
  imageZ: any[] = [];
  idGenerado: any;

  modal = false;
  modalcom = false;
  modalDelete = false;
  modalEditar = false;
  previewImage = false;
  showMask = false;
  currentLightboxImage = this.imageX[0];
  currentIndex = 0;
  showCount = false;
  controls = true;
  totalImageCount = 0;
  ocultarx = true;
  comentarioDel: any;
  comentario: string = '';
  esteComentario: string = '';
  dataVideoId: any = [];
  modalDeleteImage = false
  idDelete:string = ''

  objetoUsuario: any;

  gr = true;
  im = false;
  vd = false;

  constructor(
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private _user: UsersService,
    private toastr: ToastrService,
    private router: Router,
    private _imageUser: UsuariosImgService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.currentUser = user;
      this.getUsers();
      this.usuarioActual = user?.displayName;
      const comprobar = user?.uid;
      if (this.usuarioActual == 'Invitad@') {
        this.esInvitado = true;
      }
      if (comprobar == 'rm01jawdLvYSObMPDc8BTBasbJp2') {
        this.esInvitado = true;
      }
      if (comprobar == 'QxwJYfG0c2MwfjnJR70AdmmKOIz2') {
        this.adm = true;
      }
    });
    this.getUserImages();
  }
  generateUniqueId() {
    const uniqueId = uuidv4();
    this.idGenerado = uniqueId;
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
          // likesCountImage: data.likesCountImage || 0,
          // likedByImage: data.likedByImage || [],
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
      });
    });
  }
  getUserImages() {
    this._imageUser.getUsuarioImagen().subscribe((imagen) => {
      this.imageZ = [];
      this.imageX = [];
      imagen.forEach((element: any) => {
        const imageData = element.payload.doc.data();
        this.imageZ.push({
          id: element.payload.doc.id,
          ...imageData,
          likesCountImage: imageData.likesCountImage || 0,
          likedByImage: imageData.likedByImage || [],
          userImageLikes: imageData.userImageLikes || [],
          commentsVideo: imageData.commentsVideo || [],
        });
        const imagenFiltrada = this.imageZ.filter(
          (item) => item.idUser === this.usuario?.uid
        );
        this.imageX = imagenFiltrada;
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
                            const idUser = this.usuario?.uid;
                            const dato: any = {
                              url: url,
                              idUser: idUser,
                            };
                            this._imageUser.addImagenUsuario(dato).then(() => {
                              console.log('actualizando');
                              this.toastr.info(
                                'Actualizando lista de Imagenes'
                              );
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
  async likeImage(image: any) {
    const user = await this.afAuth.currentUser;
    if (user && !this.esInvitado) {
      const userId = user.uid;

      const usuario = user.displayName;
      const correo = user.email;

      const index = image.likedByImage.indexOf(userId);

      if (index !== -1) {
        image.likedByImage.splice(index, 1);
        image.userImageLikes.splice(index, 1);
        image.likesCountImage--;
      } else {
        image.likedByImage.push(userId);
        image.likesCountImage++;
        image.userImageLikes.push({ usuario, correo });
      }

      const id = image.id;
      const imagex: any = {
        likesCountImage: image.likesCountImage,
        likedByImage: image.likedByImage,
        userImageLikes: image.userImageLikes,
      };
      await this._imageUser.updateImgUsuario(id, imagex);
    } else {
      this.modal = true;
    }
  }
  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.showCount = true;
    this.currentLightboxImage = this.imageX[index];
    this.totalImageCount = this.imageX.length;
    document.body.style.overflow = 'hidden';
  }
  onClosePreview() {
    this.previewImage = false;
    this.showMask = false;
    this.modalDeleteImage = false
    document.body.style.overflow = '';
  }
  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex > this.imageX.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.imageX[this.currentIndex]; // Mantén currentLightboxImage como un objeto Images
  }

  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.imageX.length - 1;
    }
    this.currentLightboxImage = this.imageX[this.currentIndex]; // Mantén currentLightboxImage como un objeto Images
  }

  onMouseEnter(index: number) {
    const imageElement =
      this.el.nativeElement.querySelectorAll('.zoomable-image')[index];
    imageElement.style.transform = 'scale(1.1)';
  }

  onMouseLeave(index: number) {
    const imageElement =
      this.el.nativeElement.querySelectorAll('.zoomable-image')[index];
    imageElement.style.transform = 'scale(1)';
  }
  salir() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
  close() {
    this.modal = false;
    this.modalcom = false;
  }
  async abrirEditar(comentario: any) {
    const user = await this.afAuth.currentUser;
    if (user?.email === comentario.correo) {
      this.modalEditar = true;
      this.ocultarx = false;
    }
    this.comentarioDel = comentario;
    this.esteComentario = comentario.comentario;
  }
  async deleteModal(comentario: any) {
    const user = await this.afAuth.currentUser;

    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com'
    ) {
      this.modalDelete = true;
      this.ocultarx = false;
    }
    this.comentarioDel = comentario;
  }
  async addComment(comentario: string) {
    // Obtener el usuario actual
    const user = await this.afAuth.currentUser;

    if (user) {
      const image = this.dataVideoId;
      // Obtener el ID del video
      const imageId = this.dataVideoId.id;
      const usuario = user.displayName;
      const correo = user.email;
      const imagen = user.photoURL;
      const idUser = user.uid;
      // Crear el comentario
      image.commentsVideo.push({ usuario, correo, comentario, imagen, idUser });

      const imagex: any = {
        commentsVideo: image.commentsVideo,
      };
      // Actualizar los comentarios en Firestore
      await this._imageUser.updateImgUsuario(imageId, imagex);
      this.comentario = '';
    }
  }
  async abrirCom(image: any) {
    this.dataVideoId = image;
    const user = await this.afAuth.currentUser;

    if (user && !this.esInvitado) {
      this.modalcom = true;
    } else {
      this.modal = true;
    }
  }
  borrarComentario() {
    // Encuentra el índice del comentario en el array commentsVideo
    const index = this.dataVideoId.commentsVideo.indexOf(this.comentarioDel);

    // Asegúrate de que el índice sea válido
    if (index !== -1) {
      // Elimina el comentario del array commentsVideo
      this.dataVideoId.commentsVideo.splice(index, 1);

      // Actualiza los comentarios en Firestore
      const videoId = this.dataVideoId.id;
      const videox: any = {
        commentsVideo: this.dataVideoId.commentsVideo,
      };
      this._imageUser
        .updateImgUsuario(videoId, videox)
        .then(() => {
          this.modalDelete = false;
          this.ocultarx = true;
          console.log('Comentario eliminado correctamente');
        })
        .catch((error) => {
          console.error('Error al eliminar el comentario:', error);
        });
    } else {
      console.error('Índice de comentario no válido');
    }
  }
  editarComentario() {
    // Obtén el comentario modificado desde el formulario
    const comentarioModificado = this.esteComentario;

    // Encuentra el índice del comentario en el array commentsVideo
    const index = this.dataVideoId.commentsVideo.indexOf(this.comentarioDel);

    // Asegúrate de que el índice sea válido
    if (index !== -1) {
      // Actualiza el comentario en el array commentsVideo
      this.dataVideoId.commentsVideo[index].comentario = comentarioModificado;

      // Actualiza los comentarios en Firestore
      const videoId = this.dataVideoId.id;
      const videox: any = {
        commentsVideo: this.dataVideoId.commentsVideo,
      };
      this._imageUser
        .updateImgUsuario(videoId, videox)
        .then(() => {
          this.modalEditar = false;
          this.ocultarx = true;
          console.log('Comentario editado correctamente');
        })
        .catch((error) => {
          console.error('Error al editar el comentario:', error);
        });
    } else {
      console.error('Índice de comentario no válido');
    }
  }
  async likeComment(comment: any) {
    const user = await this.afAuth.currentUser;
    if (user && !this.esInvitado) {
      // Verificar si el comentario está definido
      if (!comment) {
        console.error('El comentario no está definido');
        return;
      }

      // Verificar si el comentario tiene la propiedad likedByComment
      if (!comment.likedByComment) {
        // Si no tiene la propiedad, crearla como un array vacío
        comment.likedByComment = [];
      }

      // Verificar si el usuario ya ha dado like
      const userId = user.uid;

      const index = comment.likedByComment.indexOf(userId);

      if (index !== -1) {
        // Si ya ha dado like, quitar el like
        comment.likedByComment.splice(index, 1);
        comment.likesCountComment = Math.max(0, comment.likesCountComment - 1); // Decrementar el contador
      } else {
        // Si no ha dado like, agregar el like
        comment.likedByComment.push(userId);
        comment.likesCountComment = (comment.likesCountComment || 0) + 1; // Incrementar el contador
      }

      // Actualizar los likes del comentario en Firestore
      const videoId = this.dataVideoId.id;
      const commentIndex = this.dataVideoId.commentsVideo.findIndex(
        (c: any) => c === comment
      );
      if (commentIndex !== -1) {
        const videox: any = {
          commentsVideo: this.dataVideoId.commentsVideo,
        };
        await this._imageUser.updateImgUsuario(videoId, videox);
      }
    } else {
      this.modal = true;
    }
  }
  closeDelete() {
    this.modalDelete = false;
    this.modalEditar = false;
    this.ocultarx = true;
    this.modalDeleteImage = false
  }
  async ir(id: any) {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;
    if (userId === id) {
      this.router.navigate(['/perfil']);
    } else {
      this.router.navigate(['/usuario/', id]);
    }
  }
  deleteImgModal(id: string){
    this.idDelete = id
    this.modalDeleteImage = true
    this.ocultarx = true;
  }
  eliminarImagen(){
    this._imageUser.delete(this.idDelete).then(()=>{
      this.imageX = this.imageX.filter((image) => image.id !== this.idDelete);
      this.toastr.error(
        'Imagen eliminida'
      );
      this.modalDeleteImage = false;
      this.previewImage = false
    })
  }
}

import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GaleriaActivateService } from 'src/app/services/galeria-activate.service';
import { UsersService } from 'src/app/services/users.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-galeria-activate',
  templateUrl: './galeria-activate.component.html',
  styleUrls: ['./galeria-activate.component.scss'],
})
export class GaleriaActivateComponent implements OnInit {
  images: any[] = [];
  currentUser: any | null;
  showCount = false;
  modal = false;
  modalcom = false;
  modalDelete = false;
  modalEditar = false;
  previewImage = false;
  showMask = false;
  currentLightboxImage = this.images[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;
  reset = 0;
  adm = false;
  esInvitado = false;
  ocultarx = true;
  comentarioDel: any;
  comentario: string = '';
  esteComentario: string = '';
  dataVideoId: any = [];
  modalDeleteImage = false;
  idDelete: string = '';
  option: boolean = false;
  capIndex: any;

  constructor(
    private el: ElementRef,
    private afAuth: AngularFireAuth,
    private _image: GaleriaActivateService,
    private toastr: ToastrService,
    private router: Router,
    private _user: UsersService,
    private storagex: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.getImages();
    this.afAuth.authState.subscribe((user) => {
      this.currentUser = user;
      const comprobar = user?.uid;
      if (comprobar == 'rm01jawdLvYSObMPDc8BTBasbJp2') {
        this.esInvitado = true;
      }
      if (
        comprobar == 'QxwJYfG0c2MwfjnJR70AdmmKOIz2' ||
        comprobar == 'AO7bYMNMPuSUMl5vH8tOqzavTrt2'
      ) {
        this.adm = true;
      }
    });
  }

  getImages() {
    this._image.getim().subscribe((data) => {
      this.images = [];
      data.forEach((element: any) => {
        const imageData = element.payload.doc.data();
        this.images.push({
          id: element.payload.doc.id,
          ...imageData,
          likesCountImage: imageData.likesCountImage || 0,
          likedByImage: imageData.likedByImage || [],
          userImageLikes: imageData.userImageLikes || [],
          commentsVideo: imageData.commentsVideo || [],
        });
        // console.log(this.images);
      });
    });
  }

  subirArchivo() {
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
                  const filePath = `images/${file.name}`;
                  const fileRef = this.storagex.ref(filePath);
                  const task = this.storagex.upload(filePath, blob, {
                    contentType: blob.type,
                  });

                  task
                    .snapshotChanges()
                    .pipe(
                      finalize(() => {
                        fileRef.getDownloadURL().subscribe((url) => {
                          const dato: any = {
                            url: url,
                          };
                          this._image.addImagenInfo(dato).then(() => {
                            console.log('actualizando');
                            this.toastr.info('Actualizando lista de Imagenes');
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
      await this._image.updateImgAc(id, imagex);
    } else {
      this.modal = true;
    }
  }
  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.showCount = true;
    this.currentLightboxImage = this.images[index];
    this.totalImageCount = this.images.length;
    document.body.style.overflow = 'hidden';
  }
  onClosePreview() {
    this.previewImage = false;
    this.showMask = false;
    this.modalDeleteImage = false;
    document.body.style.overflow = '';
  }
  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex > this.images.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.images[this.currentIndex]; // Mantén currentLightboxImage como un objeto Images
  }

  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    }
    this.currentLightboxImage = this.images[this.currentIndex]; // Mantén currentLightboxImage como un objeto Images
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
    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com' ||
      user?.email == 'jeestrada377@gmail.com'
    ) {
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
      user?.email == 'administrador.sistema@gmail.com' ||
      user?.email == 'jeestrada377@gmail.com'
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
      await this._image.updateImgAc(imageId, imagex);
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
      this._image
        .updateImgAc(videoId, videox)
        .then(() => {
          this.option = false;
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
      this._image
        .updateImgAc(videoId, videox)
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
        await this._image.updateImgAc(videoId, videox);
      }
    } else {
      this.modal = true;
    }
  }
  closeDelete() {
    this.modalDelete = false;
    this.modalEditar = false;
    this.ocultarx = true;
    this.modalDeleteImage = false;
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
  deleteImgModal(id: string) {
    this.idDelete = id;
    this.modalDeleteImage = true;
    this.ocultarx = true;
  }
  eliminarImagen() {
    this._image.delete(this.idDelete).then(() => {
      this.images = this.images.filter((image) => image.id !== this.idDelete);
      this.toastr.error('Imagen eliminida');
      this.modalDeleteImage = false;
      this.previewImage = false;
    });
  }
  async opciones(i: any, comentario:any) {
    const user = await this.afAuth.currentUser;

    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com' ||
      user?.email == 'jeestrada377@gmail.com'
    ) {
      if (this.capIndex === i) {
        this.option = !this.option; // Toggle option if the same item is clicked
      } else {
        this.capIndex = i;
        this.option = true; // Show options for a new item
      }
    }
  }
}

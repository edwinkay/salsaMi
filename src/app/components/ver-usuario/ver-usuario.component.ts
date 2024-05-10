import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UsuariosImgService } from 'src/app/services/usuarios-img.service';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.component.html',
  styleUrls: ['./ver-usuario.component.scss'],
})
export class VerUsuarioComponent implements OnInit {
  usuario: any | null;
  id: any;
  usuariosInfo: any[] = [];
  info: any;
  urlPortada: any;
  showMoreInfo: boolean = false;
  ver = 'Ver mas...';
  gr = true;
  im = false;
  imageX: any[] = [];
  imageZ: any[] = [];
  currentUser: any | null;

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
  modalDeleteImage = false;
  idDelete: string = '';
  usuarioActual: any;
  esInvitado = false;

  constructor(
    private route: ActivatedRoute,
    private _user: UsersService,
    private afAuth: AngularFireAuth,
    private location: Location,
    private toastr: ToastrService,
    private _imageUser: UsuariosImgService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.getUsers();
    this.getUserImages();
    if (this.usuarioActual == 'Invitad@') {
      this.esInvitado = true;
    }
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
          (obj) => obj.idUser === this.id
        );
        this.info = buscarObjeto;
        this.urlPortada = this.info.portada;
        console.log(this.info.portada);
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
          (item) => item.idUser === this.id
        );
        this.imageX = imagenFiltrada;
      });
    });
  }
  goBack() {
    this.location.back();
  }
  toggleInfo() {
    this.showMoreInfo = !this.showMoreInfo;
    if (this.showMoreInfo) {
      this.ver = 'Ver menos';
    } else {
      this.ver = 'Ver mas...';
    }
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.toastr.success('Gracias por visitarnos, vuelve pronto.');
    });
  }
  grupos() {
    this.gr = true;
    this.im = false;
  }
  imagenes() {
    this.gr = false;
    this.im = true;
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
    this.modalDeleteImage = false;
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
    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com'
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
    this._imageUser.delete(this.idDelete).then(() => {
      this.imageX = this.imageX.filter((image) => image.id !== this.idDelete);
      this.toastr.error('Imagen eliminida');
      this.modalDeleteImage = false;
      this.previewImage = false;
    });
  }
}

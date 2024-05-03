import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Storage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { GetVideosService } from 'src/app/services/get-videos.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Users } from 'src/app/interfaces/users';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  videos: Users[] = [];
  currentUser: any | null;
  esInvitado = false;
  modal = false;
  modalcom = false;
  modalDelete = false;
  modalEditar = false;
  comentarioDel: any;
  comentario: string = '';
  esteComentario: string = '';
  dataVideoId: any = [];
  ocultarx = true;
  adm = false;

  constructor(
    private storage: Storage,
    private afAuth: AngularFireAuth,
    private _videosService: GetVideosService,
    private afs: AngularFirestore,
    private _users: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getVideos();
    this.afAuth.authState.subscribe((user) => {
      this.currentUser = user;
      const comprobar = user?.uid;
      if (comprobar == 'rm01jawdLvYSObMPDc8BTBasbJp2') {
        this.esInvitado = true;
      }
      if (comprobar == 'QxwJYfG0c2MwfjnJR70AdmmKOIz2') {
        this.adm = true;
      }
      // console.log(user);
      // if (user) {
      //   this.loadUserLikes(user.uid);
      // }
    });
  }
  getVideos() {
    this._videosService.getVideos().subscribe((data) => {
      this.videos = [];
      data.forEach((element: any) => {
        const videoData = element.payload.doc.data();
        this.videos.push({
          id: element.payload.doc.id,
          ...videoData,
          likesCountVideo: videoData.likesCountVideo || 0,
          likedByVideo: videoData.likedByVideo || [],
          userVideoLikes: videoData.userVideoLikes || [],
          commentsVideo: videoData.commentsVideo || [],
        });
        // console.log(this.videos);
      });
    });
  }

  async likeVideo(video: Users) {
    const user = await this.afAuth.currentUser;
    if (user && !this.esInvitado) {
      // Verificar si el usuario ya ha dado like
      const userId = user.uid;

      const usuario = user.displayName;
      const correo = user.email;

      const index = video.likedByVideo.indexOf(userId);

      if (index !== -1) {
        // Si ya ha dado like, quitar el like
        video.likedByVideo.splice(index, 1);
        video.userVideoLikes.splice(index, 1);
        video.likesCountVideo--;
      } else {
        // Si no ha dado like, agregar el like
        video.likedByVideo.push(userId);
        video.likesCountVideo++;
        video.userVideoLikes.push({ usuario, correo });
      }

      // Actualizar los likes en Firestore
      const id = video.id;
      const videox: any = {
        likesCountVideo: video.likesCountVideo,
        likedByVideo: video.likedByVideo,
        userVideoLikes: video.userVideoLikes,
      };
      await this._videosService.updateVideo(id, videox);
    } else {
      this.modal = true;
    }
  }
  async addComment(comentario: string) {
    // Obtener el usuario actual
    const user = await this.afAuth.currentUser;

    if (user) {
      const video = this.dataVideoId;
      // Obtener el ID del video
      const videoId = this.dataVideoId.id;
      const usuario = user.displayName;
      const correo = user.email;
      const imagen = user.photoURL;
      // Crear el comentario
      video.commentsVideo.push({ usuario, correo, comentario, imagen });

      // const newComment = {
      //   usuario: user.displayName,
      //   correo: user.email,
      //   comentario: comentario,
      // };
      const videox: any = {
        commentsVideo: video.commentsVideo,
      };
      // Actualizar los comentarios en Firestore
      await this._videosService.updateVideo(videoId, videox);
      this.comentario = '';
    }
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
  closeDelete() {
    this.modalDelete = false;
    this.modalEditar = false;
    this.ocultarx = true;
  }

  async abrirCom(video: Users) {
    this.dataVideoId = video;
    const user = await this.afAuth.currentUser;

    if (user && !this.esInvitado) {
      const username = user.displayName;
      this.modalcom = true;
    } else {
      this.modal = true;
    }
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
      this._videosService
        .updateVideo(videoId, videox)
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
  async abrirEditar(comentario: any) {
    const user = await this.afAuth.currentUser;
    if (user?.email === comentario.correo) {
      this.modalEditar = true;
      this.ocultarx = false;
    }
    this.comentarioDel = comentario;
    this.esteComentario = comentario.comentario;
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
      this._videosService
        .updateVideo(videoId, videox)
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
        await this._videosService.updateVideo(videoId, videox);
        console.log(videox);
      }
    } else {
      this.modal = true;
    }
  }
}

// Cargar likes del usuario logueado desde Firestore
// loadUserLikes(userId: string) {
//   this.afs
//     .collection('likes')
//     .doc(userId)
//     .valueChanges()
//     .subscribe((data: any) => {
//       if (data) {
//         // Actualizar el estado de los likes en los videos
//         this.videos.forEach((video) => {
//           if (data[video.id]) {
//             video.likesCountVideo = data[video.id].likesCount || 0;
//             video.likedByVideo = data[video.id].likedBy || [];
//           }
//         });
//       }
//     });
// }
  // subirArchivo($event: any) {
    //   const file = $event.target.files[0];

//   const videoRef = ref(this.storage, `videos/${file.name}`);
//   uploadBytes(videoRef, file)
//     .then(() => {
//       this.getVideos();
//     })
//     .catch((error) => console.log(error));
// }

// async getVideos() {
//   const videosRef = ref(this.storage, 'videos');

//   try {
//     const videoList = await listAll(videosRef);
//     this.videos = await Promise.all(
//       videoList.items.map(async (video, index) => {
//         const url = await getDownloadURL(video);
//         const title = this.titulos[index] || `Video ${index + 1}`;
//         return { title, url };
//       })
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }
//   async likeVideo(video: Users) {
//     const user = await this.afAuth.currentUser;
//     if (user) {
//       const userId = user.uid;
//       const index = video.likedByVideo.indexOf(userId);
//       if (index !== -1) {
//         // El usuario ya ha dado like, quitar el like
//         video.likedByVideo.splice(index, 1);
//         video.likesCountVideo--;
//       } else {
//         // El usuario no ha dado like, agregar el like
//         video.likedByVideo.push(userId);
//         video.likesCountVideo++;
//       }
//       // Actualizar los likes en Firestore
//       // await this._users.updateLikesVideo(video, userId);
//       const videox: any = {
//         nombre: 'Competencia',
//         url: 'https://edwinkay.github.io/asi-somos-asi-bailamos/video/video4.mp4',
//         likes: 2,
//       };
//       await this._videosService.updateVideo(userId, videox)
//       console.log(video)
//     } else {
//       console.log('Debe iniciar sesión para dar Me gusta');
//     }
//   }
// }

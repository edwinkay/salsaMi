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
  esInvitado: boolean | undefined;
  modal = false;

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
      this.esInvitado = user?.isAnonymous;
      console.log(user);
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
        });
        // console.log(this.videos);
      });
    });
  }

  async likeVideo(video: Users) {
    const user = await this.afAuth.currentUser;
    console.log(user);
    if (user && !this.esInvitado) {
      // Verificar si el usuario ya ha dado like
      const userId = user.uid;
      const index = video.likedByVideo.indexOf(userId);
      if (index !== -1) {
        // Si ya ha dado like, quitar el like
        video.likedByVideo.splice(index, 1);
        video.likesCountVideo--;
      } else {
        // Si no ha dado like, agregar el like
        video.likedByVideo.push(userId);
        video.likesCountVideo++;
      }

      // Actualizar los likes en Firestore
      const id = video.id;
      const videox: any = {
        likesCountVideo: video.likesCountVideo,
        likedByVideo: video.likedByVideo,
      };
      await this._videosService.updateVideo(id, videox);
      console.log(video);
    } else {
      this.modal = true;
    }
  }
  salir() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
  close(){
    this.modal = false
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

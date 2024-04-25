import { Component, OnInit } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';

interface Video {
  title: string;
  url: string;
}

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  videos: Video[] = [];
  titulos: string[] = [
    'Ensayo, 1',
    'Cecedit',
    'Ensayo, 2',
    'Ensayo, 3',
    'Parque corinto',
    'Casa de la cultura',
    'Padilla',
    'Parque corinto v2',
    'Nucleo corinto',
    'Ensayo 4',
    'Ensayo 5',
    'Ensayo 6',
    'Nucleo',
    'Casa de la cultura v2',
    'Happy birthday',
    'Algun lugar',
  ];

  constructor(private storage: Storage) {}

  ngOnInit(): void {
    // this.getVideos();
  }

  subirArchivo($event: any) {
    const file = $event.target.files[0];

    const videoRef = ref(this.storage, `videos/${file.name}`);
    uploadBytes(videoRef, file)
      .then(() => {
        this.getVideos();
      })
      .catch((error) => console.log(error));
  }

  async getVideos() {
    const videosRef = ref(this.storage, 'videos');

    try {
      const videoList = await listAll(videosRef);
      this.videos = await Promise.all(
        videoList.items.map(async (video, index) => {
          const url = await getDownloadURL(video);
          const title = this.titulos[index] || `Video ${index + 1}`;
          return { title, url };
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}

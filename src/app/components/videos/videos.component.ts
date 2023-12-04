import { Component, OnInit } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  videos: string[] = [];

  constructor(private storage: Storage) {}

  ngOnInit(): void {
    this.getVideos()
  }

  subirArchivo($event: any) {
    const file = $event.target.files[0];

    const imgRef = ref(this.storage, `videos/${file.name}`);
    uploadBytes(imgRef, file)
      .then((x) => {
        this.getVideos();
      })
      .catch((error) => console.log(error));
  }
  getVideos() {
    const imagesRef = ref(this.storage, 'videos');
    console.log(imagesRef)

    listAll(imagesRef)
      .then(async (videos) => {
        this.videos = [];
        for (let video of videos.items) {
          const url = await getDownloadURL(video);
          this.videos.push(url);
        }
      })
      .catch((error) => console.log(error));
  }
}

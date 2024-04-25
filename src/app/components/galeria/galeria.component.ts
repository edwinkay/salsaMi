import { Component, OnInit, ElementRef } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage'

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
})
export class GaleriaComponent implements OnInit {
  images: string[] = [];
  showCount = false;

  previewImage = false;
  showMask = false;
  currentLightboxImage = this.images[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;
  reset = 0;

  constructor(private storage: Storage, private el: ElementRef) {}

  ngOnInit(): void {
    // this.getImages();
  }

  subirArchivo($event: any) {
    const file = $event.target.files[0];

    const imgRef = ref(this.storage, `images/${file.name}`);
    uploadBytes(imgRef, file)
      .then((x) => {
        this.getImages();
      })
      .catch((error) => console.log(error));
  }
  getImages() {
    const imagesRef = ref(this.storage, 'images');
    console.log(imagesRef)
    listAll(imagesRef)
      .then(async (images) => {
        this.images = [];
        for (let image of images.items) {
          const url = await getDownloadURL(image);
          this.images.push(url);
        }
      })
      .catch((error) => console.log(error));
  }

  //insert function lightbox

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
    document.body.style.overflow = '';
  }
  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex > this.images.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.images[this.currentIndex];
  }
  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    }
    this.currentLightboxImage = this.images[this.currentIndex];
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
}

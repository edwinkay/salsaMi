import { Component, OnInit } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';

interface Music {
  title: string;
  url: string;
}

@Component({
  selector: 'app-musica',
  templateUrl: './musica.component.html',
  styleUrls: ['./musica.component.scss'],
})
export class MusicaComponent implements OnInit {
  musica: Music[] = [];
  titulos: string[] = [
    'Aguanile',
    'Arrepientete',
    'Asi soy yo',
    'Bam bam bidi bim bam bam',
    'Batman y el hombre Araña',
    'Caderona',
    'Con la punta del pie',
    'Donde estabas tu',
    'Welcome to party',
    'La negra tiene tumbao',
    'Llora Corazon',
    'Payaso',
    'Cancion 13',
    'Lupita',
    'Paloma',
    'Yo soy el rey',
    'Cancion 17',
    'Sangre son colora',
    'Sangre son colora (editado)',
    'boogalo 1',
    'Cancion 21',
    'Cancion 22',
    'Cancion 23',
    'Todo tiene su final (editado)',
    'Cancion 25',
    'Cancion 26',
    'Cancion 27',
    'Omele',
    'Boogalo 2',
    'Aguazate',
    'Aqui no ha pasado nada',
    'Saraguey santoja',
    'Arranca en fa',
    'Arroyando',
    'Asi soy yo (edit)',
    'Askarakatiski',
    'Ballandel',
    'Bam bam (edit)',
    'Bomba caranbomba',
    'Boogalo 3',
    'Boogalo 4',
    'Boogalo 5',
    'Boogalo 6',
    'Cancion 45',
    'Boogalo 7',
    'Boogalo 8',
    'Boogalo 9',
    'Boogalo 10',
    'Boogalo 11',
    'Boogalo 12',
    'Boogalo 13',
    'Cancion 53',
    'Cachondea',
    'Cancion 54',
    'Camina como chencha',
    'Cancion 56',
    'Carmen',
    'Cancion 57',
    'Cancion 58',
    'Cancion 59',
    'Cancion 60',
    'Cancion 61',
    'Ran kan kan',
    'Echo chi echo no',
    'El malo',
    'Cancion 65',
    'Federico boogalo',
    'Fuego pal 23',
    'Hagan silencio',
    'Indestructible',
    'Lancion 70',
    'cancion 71',
    'La bamba',
    'Cancion 73',
    'La luz del cielo',
    'La pelota',
    'Cancion 76',
    'Mambo rock',
    'Merecumbe',
    'Boogalo 14',
    'Boogalo 15',
    'Mondongo',
    'Oh mayi',
    'Pal 23',
    'Cancion 85',
    'Pruebalo',
    'Quimbara (edit)',
    'Quimbara',
    'Cancion 89',
    'Cancion 90',
    'Cancion 91',
    'Cancion 92',
    'Cancion 93',
    'Fuma el barco',
    'Sonido bestial',
    'Cancion 96',
    'Cancion 97',
    'Cancion 98',
    'Cancion 99',
    'El yoyo',
    'Tremendo rumbon',
    'Tres pata',
    'Tres pata v2',
    'Cancion 104',
    'Cancion 105',
  ];

  constructor(private storage: Storage) {}

  ngOnInit(): void {
    // this.getMusica();
  }

  subirArchivo($event: any) {
    const file = $event.target.files[0];

    const imgRef = ref(this.storage, `videos/${file.name}`);
    uploadBytes(imgRef, file)
      .then(() => {
        this.getMusica();
      })
      .catch((error) => console.log(error));
  }

  async getMusica() {
    const imagesRef = ref(this.storage, 'musica');

    try {
      const music = await listAll(imagesRef);
      this.musica = await Promise.all(
        music.items.map(async (item, index) => {
          const url = await getDownloadURL(item);
          const title = this.titulos[index] || `Canción ${index + 1}`;
          return { title, url };
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}

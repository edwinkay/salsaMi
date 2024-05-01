import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GetVideosService } from 'src/app/services/get-videos.service';

@Component({
  selector: 'app-form-video',
  templateUrl: './form-video.component.html',
  styleUrls: ['./form-video.component.scss'],
})
export class FormVideoComponent implements OnInit {
  subir: { nombre: string; url: string } = { nombre: '', url: '' };

  constructor(
    private _videosService: GetVideosService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  subirVideo(): void {
    console.log(this.subir);
    this._videosService.addImagenInfo(this.subir).then(() => {
      this.router.navigate(['/videos']);
      this.toastr.success('Agregando nuevo video');
    });
  }
}

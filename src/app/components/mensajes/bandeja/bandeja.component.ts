import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ComunicationService } from 'src/app/services/comunication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss'],
})
export class BandejaComponent implements OnInit {
  mensajes: any[] = [];
  usuario: any

  constructor(
    private location: Location,
    private _msj: ComunicationService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
    });
  }
  getMessages(){}
  volver() {
    this.location.back();
  }
}

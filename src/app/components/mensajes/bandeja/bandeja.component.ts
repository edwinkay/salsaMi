import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ComunicationService } from 'src/app/services/comunication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss'],
})
export class BandejaComponent implements OnInit {
  mensajes: any[] = [];
  mensajes2: any[] = [];
  misMensajes: any[] = [];
  misMensajes2: any[] = [];
  users: any[] = [];
  usuario: any;
  usuarioActual: any;

  constructor(
    private location: Location,
    private _msj: ComunicationService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private _user: UsersService
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.usuarioActual = this.usuario?.uid;
      this.getMessages();
      this.getUsers();
    });
  }
  getUsers() {
    this.users = [];
    this._user.getUsers().subscribe((user)=>{
      user.forEach((element:any)=>{
        this.users.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      })
    })
  }
  getMessages() {
    this._msj.getUMessage().subscribe((msj) => {
      this.mensajes2 = [];
      msj.forEach((element: any) => {
        const soloData = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        };
        this.mensajes2.push(soloData);
        const misMsjs = this.mensajes2.find(
          (obj) => obj.idReceptor == this.usuarioActual
        );
        this.mensajes.push(misMsjs)
        // const misMsjs2 = this.mensajes.find(
        //   (obj) => obj.idEmisor == this.usuarioActual
        // );
      });
    });
  }
  abrirMensaje(id: string) {
    this.router.navigate(['enviar-mensaje', id]);
  }
  volver() {
    this.location.back();
  }
}

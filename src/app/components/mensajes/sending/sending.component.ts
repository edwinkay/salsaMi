import { Component, ElementRef, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { UsersService } from 'src/app/services/users.service';
import { UsuariosImgService } from 'src/app/services/usuarios-img.service';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
  selector: 'app-sending',
  templateUrl: './sending.component.html',
  styleUrls: ['./sending.component.scss'],
})
export class SendingComponent implements OnInit {
  mensaje: string = '';
  usuario: any | null;
  id: any;
  usuariosInfo: any[] = [];
  info: any;
  idUserActual:any
  mensajes: any[] = []
  idBody:any
  idBody2:any
  objetoMensaje:any
  objetoMensaje2:any
  nombreActual:any

  entrante:any
  saliente:any

  constructor(
    private route: ActivatedRoute,
    private _user: UsersService,
    private afAuth: AngularFireAuth,
    private location: Location,
    private toastr: ToastrService,
    private _imageUser: UsuariosImgService,
    private router: Router,
    private _msj: ComunicationService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.getUsers()
    this.getMessages()
  }
  getMessages(){
    this._msj.getUMessage().subscribe((msj)=>{
      this.mensajes = []
      msj.forEach((element:any)=>{
        const soloData = {
          ...element.payload.doc.data(),
        };
        const mensajeData = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
          mensaje: soloData.mensaje || []
        };
        this.mensajes.push(mensajeData)
        //capturando el id array mensaje
        const idEnvio = this.usuario?.uid
        const idBodyEnvio = this.mensajes.find(obj => obj.idEmisor && obj.idReceptor === idEnvio && this.id)?.id
        const idBodyRecido = this.mensajes.find(
          (obj) => obj.idEmisor && obj.idReceptor === this.id && idEnvio
        )?.id;
        this.idBody = idBodyEnvio
        this.idBody2 = idBodyRecido
        //capturando el cuerpo array mensaje
        const bodyEnvio = this.mensajes.find(
          (obj) => obj.idEmisor && obj.idReceptor === idEnvio && this.id
        );
        const bodyRecibido = this.mensajes.find(
          (obj) => obj.idEmisor && obj.idReceptor === this.id && idEnvio
        );

        this.objetoMensaje = bodyEnvio;
        if (this.objetoMensaje == undefined) {
          this.objetoMensaje = bodyRecibido
        }
        this.entrante = this.objetoMensaje.para
        this.saliente = this.objetoMensaje.de
        console.log(this.objetoMensaje.de);
        console.log(this.objetoMensaje.para);
      })
    })
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
      });
    });
  }

  addMessage(mensaje: string) {
    this.mensaje = '';

    if (this.idBody == undefined && this.idBody2 == undefined) {
      const para = this.info?.usuario;
      const de = this.usuario?.displayName;
      let foto = this.usuario?.photoURL;
      if (foto == undefined) {
        foto =
          'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
      }
      const encapsular = []
      encapsular.push({ mensaje, foto, para, de });
      const datos = {
        de: de,
        para: para,
        idEmisor: this.id,
        idReceptor: this.idUserActual,
        mensaje: encapsular,
      };
      this._msj.addMessage(datos).then(() => {
      });
    }else{
      let foto = this.usuario?.photoURL;
      if (foto == undefined) {
        foto =
          'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
      }
      const para = this.info?.usuario;
      const de = this.usuario?.displayName;
      const nuevoMensaje = this.objetoMensaje.mensaje;
      nuevoMensaje.push({ mensaje, de, para, foto});
      const datos = {
        mensaje: nuevoMensaje,
      };
      if (this.idBody == undefined) {
        this.idBody = this.idBody2
      }
      this._msj.update(this.idBody, datos).then(()=>{
      })
    }
  }
  volver(){
    this.location.back()
  }
}

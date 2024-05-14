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
  idUserActual: any;
  mensajes: any[] = [];
  idBody: any;
  idBody2: any;
  objetoMensaje: any;
  objetoMensaje2: any;
  nombreActual: any;

  entrante: any;
  saliente: any;

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
      this.idUserActual = this.usuario?.uid;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.getUsers();
    this.getMessages();
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

  getMessages() {
    this._msj.getUMessage().subscribe((msj) => {
      this.mensajes = [];
      msj.forEach((element: any) => {
        const soloData = {
          ...element.payload.doc.data(),
        };
        const mensajeData = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
          mensaje: soloData.mensaje || [],
        };
        this.mensajes.push(mensajeData);
        //capturando el id array mensaje
        const idBody = this.mensajes.find(obj => obj.idEmisor == this.id)?.id
        const body = this.mensajes.find(obj => obj.idEmisor == this.id)
        const idBody2 = this.mensajes.find(obj => obj.idEmisor == this.idUserActual)?.id
        const body2 = this.mensajes.find(obj => obj.idEmisor == this.idUserActual)

        const objetoMensaje = body
        const objetoMensaje2 = body2

        if (
          (objetoMensaje?.idReceptor == this.idUserActual &&
            objetoMensaje?.idEmisor == this.id)
        ) {
          this.objetoMensaje = objetoMensaje;
          this.idBody = objetoMensaje?.id
        } else if (
          objetoMensaje2?.idReceptor == this.id &&
          objetoMensaje == undefined
        ) {
          if (
            objetoMensaje2?.idReceptor == this.id &&
            objetoMensaje2?.idEmisor == this.idUserActual
          ){
            this.idBody = objetoMensaje2?.id
            this.objetoMensaje2 = objetoMensaje2;
          }

        } else {
          this.objetoMensaje = undefined
          this.objetoMensaje2 = undefined
        }

        this.entrante = this.objetoMensaje?.para;
        this.saliente = this.objetoMensaje?.de;
      });
    });
  }

  addMessage(mensaje: string) {
    this.mensaje = '';

    if (this.objetoMensaje == undefined && this.objetoMensaje2 == undefined) {
      const para = this.info?.usuario;
      const de = this.usuario?.displayName;
      let foto1 = this.usuario?.photoURL
      if (foto1 == undefined) {
        foto1 =
          'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
      }
      let foto = this.info?.foto;
      if (foto == undefined) {
        foto =
          'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
      }
      const encapsular = [];
      encapsular.push({ mensaje, foto, para, de });
      const datos = {
        de: de,
        para: para,
        foto,
        foto1,
        idEmisor: this.id,
        idReceptor: this.idUserActual,
        mensaje: encapsular,
      };
      this._msj.addMessage(datos).then(() => {
        console.log('creando un nuevo mensaje')
      });
    }
    // metodo para actualizar el mensaje

    else {
      let foto1 = this.usuario?.photoURL;
      if (foto1 == undefined) {
        foto1 =
          'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
      }
      let foto = this.info?.foto;
      if (foto == undefined) {
        foto =
          'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
      }
      const para = this.info?.usuario;
      const de = this.usuario?.displayName;

      if (this.objetoMensaje?.mensaje == undefined) {
        const nuevoMensaje = this.objetoMensaje2?.mensaje;
        nuevoMensaje.push({ mensaje, de, para, foto });
        const datos = {
          mensaje: nuevoMensaje,
        };
        this._msj.update(this.idBody, datos).then(() => {
          console.log('mensaje actualizado');
        });
      } else {
        const nuevoMensaje = this.objetoMensaje?.mensaje;
        nuevoMensaje.push({ mensaje, de, para, foto });
        const datos = {
          mensaje: nuevoMensaje,
        };
        this._msj.update(this.idBody, datos).then(() => {
          console.log('mensaje actualizado');
        });
      }

    }
  }
  volver() {
    this.location.back();
  }
}

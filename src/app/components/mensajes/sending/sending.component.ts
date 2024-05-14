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
  nombreActual: any;
  comprobarIgual1 = false;
  comprobarIgual2 = false;

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
      console.log('usuario actual',this.idUserActual)
      console.log('enviadno a', this.id)
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
        if (body == undefined) {
          this.idBody  = idBody2
          this.objetoMensaje = body2
        }else{
          this.objetoMensaje = body;
          this.idBody = idBody
        }
        console.log(this.objetoMensaje?.idReceptor, this.idUserActual)
        console.log(this.objetoMensaje?.idEmisor, this.idUserActual)
        console.log(this.idBody)

        if (this.idUserActual === this.objetoMensaje?.idReceptor) {
          console.log('verdadero')
          this.comprobarIgual1 = true
        }else{
          console.log('falso')
          this.comprobarIgual1 = false;
        }
        if (this.idUserActual === this.objetoMensaje?.idEmisor) {
          this.comprobarIgual2 = true;
          console.log('emisor verdadero');
        }else{
          this.comprobarIgual2 = false;
          console.log('emisor falso')
        }
        console.log(this.comprobarIgual1)
        console.log(this.comprobarIgual2)


        if (this.comprobarIgual1 && !this.comprobarIgual2) {
          console.log('es usuario uno');
        } else if (
          this.comprobarIgual1 === false && this.comprobarIgual2 === true
        ) {
          console.log('es usuario dos');
        } else if (!this.comprobarIgual1 && !this.comprobarIgual2) {
          console.log('es usuario 3')
          this.objetoMensaje = undefined
        }else {
          console.log('nada')
        }


        console.log(this.objetoMensaje)
        //capturando el cuerpo array mensaje

        this.entrante = this.objetoMensaje?.para;
        this.saliente = this.objetoMensaje?.de;
      });
    });
  }

  addMessage(mensaje: string) {
    this.mensaje = '';

    if (this.objetoMensaje == undefined) {
      const para = this.info?.usuario;
      const de = this.usuario?.displayName;
      let foto = this.usuario?.photoURL;
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
      let foto = this.usuario?.photoURL;
      if (foto == undefined) {
        foto =
          'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
      }
      const para = this.info?.usuario;
      const de = this.usuario?.displayName;
      const nuevoMensaje = this.objetoMensaje?.mensaje;
      nuevoMensaje.push({ mensaje, de, para, foto });
      const datos = {
        mensaje: nuevoMensaje,
      };

      this._msj.update(this.idBody, datos).then(() => {
        console.log('mensaje actualizado')
      });
    }
  }
  volver() {
    this.location.back();
  }
}

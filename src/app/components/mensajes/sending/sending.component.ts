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
      this.idUserActual = user?.uid
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
        const mensajeData = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        };
        this.mensajes.push(mensajeData)
        const idEnvio = this.usuario.uid
        const idBody = this.mensajes.find(obj => obj.idEmisor && obj.idReceptor === idEnvio && this.id)?.id
        this.idBody = idBody
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
    const datos = {
      idEmisor: this.id,
      idReceptor: this.idUserActual,
      mesaje: mensaje,
    };
    if (this.idBody == undefined) {
      this._msj.addMessage(datos).then(() => {
        console.log('mensaje enviado');

      });
    }else{
      this._msj.update(this.idBody, datos).then(()=>{
        console.log('mensage actualizado')
      })
    }
  }
}

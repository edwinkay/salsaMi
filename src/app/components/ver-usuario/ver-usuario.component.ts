import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.component.html',
  styleUrls: ['./ver-usuario.component.scss'],
})
export class VerUsuarioComponent implements OnInit {
  usuario: any | null;
  id: any;
  usuariosInfo: any[] = [];
  info: any;
  showMoreInfo: boolean = false;
  ver = 'Ver mas...';

  constructor(
    private route: ActivatedRoute,
    private _user: UsersService,
    private afAuth: AngularFireAuth,
    private location: Location,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      console.log(this.id);
    });
    this.getUsers();
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
  goBack() {
    this.location.back();
  }
  toggleInfo() {
    this.showMoreInfo = !this.showMoreInfo;
    if (this.showMoreInfo) {
      this.ver = 'Ver menos';
    } else {
      this.ver = 'Ver mas...';
    }
  }
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.toastr.success('Gracias por visitarnos, vuelve pronto.');
    });
  }
}

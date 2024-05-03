import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { VideosComponent } from './components/videos/videos.component';
import { MusicaComponent } from './components/musica/musica.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { AuthGuard } from './auth.guard';
import { FormVideoComponent } from './components/form-video/form-video.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PerfilEditarComponent } from './components/perfil-editar/perfil-editar.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  {
    path: 'registrar',
    component: RegistrarUsuarioComponent,
  },
  {
    path: 'recuperar',
    component: RecuperarContrasenaComponent,
  },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: 'galeria', component: GaleriaComponent, canActivate: [AuthGuard] },
  { path: 'videos', component: VideosComponent, canActivate: [AuthGuard] },
  {
    path: 'nuevo-video',
    component: FormVideoComponent,
    canActivate: [AuthGuard],
  },
  { path: 'musica', component: MusicaComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  {
    path: 'perfil-editar',
    component: PerfilEditarComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

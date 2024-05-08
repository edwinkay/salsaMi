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
import { VerUsuarioComponent } from './components/ver-usuario/ver-usuario.component';
import { MainActivateComponent } from './components/group-activate/main-activate/main-activate.component';
import { GaleriaActivateComponent } from './components/group-activate/galeria-activate/galeria-activate.component';
import { VideosActivateComponent } from './components/group-activate/videos-activate/videos-activate.component';

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
  { path: 'main-activate', component: MainActivateComponent, canActivate: [AuthGuard] },
  { path: 'galeria-activate', component: GaleriaActivateComponent, canActivate: [AuthGuard] },
  { path: 'videos-activate', component: VideosActivateComponent, canActivate: [AuthGuard] },
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
  {
    path: 'usuario/:id',
    component: VerUsuarioComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

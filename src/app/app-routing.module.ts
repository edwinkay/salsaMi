import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { VideosComponent } from './components/videos/videos.component';
import { MusicaComponent } from './components/musica/musica.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'registrar', component: RegistrarUsuarioComponent },
  { path: 'recuperar', component: RecuperarContrasenaComponent },
  { path: 'main', component: MainComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'musica', component: MusicaComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

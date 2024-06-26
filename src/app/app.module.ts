import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { VideosComponent } from './components/videos/videos.component';
import { MusicaComponent } from './components/musica/musica.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

//toastr
import { ToastrModule } from 'ngx-toastr';

//firebase
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormVideoComponent } from './components/form-video/form-video.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PerfilEditarComponent } from './components/perfil-editar/perfil-editar.component';
import { VerUsuarioComponent } from './components/ver-usuario/ver-usuario.component';
import { MainActivateComponent } from './components/group-activate/main-activate/main-activate.component';
import { NavbarActivateComponent } from './components/group-activate/navbar-activate/navbar-activate.component';
import { GaleriaActivateComponent } from './components/group-activate/galeria-activate/galeria-activate.component';
import { VideosActivateComponent } from './components/group-activate/videos-activate/videos-activate.component';
import { BandejaComponent } from './components/mensajes/bandeja/bandeja.component';
import { SendingComponent } from './components/mensajes/sending/sending.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GaleriaComponent,
    VideosComponent,
    MusicaComponent,
    LoginFormComponent,
    RegistrarUsuarioComponent,
    RecuperarContrasenaComponent,
    SpinnerComponent,
    NavbarComponent,
    FormVideoComponent,
    SafeUrlPipe,
    PerfilComponent,
    PerfilEditarComponent,
    VerUsuarioComponent,
    MainActivateComponent,
    NavbarActivateComponent,
    GaleriaActivateComponent,
    VideosActivateComponent,
    BandejaComponent,
    SendingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    AngularFireAuthModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

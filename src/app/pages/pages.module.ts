import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesaComponent } from './promesa/promesa.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,
    PromesaComponent,
    RxjsComponent,
    PerfilComponent,
    UsuariosComponent,
  ],
  exports: [  //Exporto todo estos componentes para que tambien puedan ser usados fuera de este modulo
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,
    PromesaComponent
  ],
  imports: [
    CommonModule,  //Modulo que me da acceso a directivas como Ngif y NgFor
    FormsModule,    //Este es el modulo de forms reactivos, sin esto el ngModel no funciona
    SharedModule,  //Modulo que me da acceso a los componentes compartidos (Header, Breadcrumbs, Sidebar, etc)
    RouterModule,  //Solo importo este para activar el router-outlet, no es necesario importar el AppRoutingModule
    ReactiveFormsModule, //Formularios reactivos, esto me permite usar el FormBuilder
    ComponentsModule
  ]
})

/**
 * Modulo que gestiona las páginas que estarán protegidas en la app
 *
 * 
 */
export class PagesModule { }

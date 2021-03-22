import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
  ],
  exports: [  //Exporto todo estos componentes para que tambien puedan ser usados fuera de este modulo
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
  ],
  imports: [
    CommonModule,  //Modulo que me da acceso a directivas como Ngif y NgFor
    SharedModule,  //Modulo que me da acceso a los componentes compartidos (Header, Breadcrumbs, Sidebar, etc)
    RouterModule  //Solo importo este para activar el router-outlet, no es necesario importar el AppRoutingModule
  ]
})

/**
 * Modulo que gestiona las páginas que estarán protegidas en la app
 *
 * 
 */
export class PagesModule { }

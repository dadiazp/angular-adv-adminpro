import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';



@NgModule({
  declarations: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent
  ],
  exports: [  //Exporto todo estos componentes para que tambien puedan ser usados fuera de este modulo
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule  //Modulo que me da acceso a directivas como Ngif y NgFor
  ]
})

/**
 * Modulo que gestiona los componentes comunes dentro de la app
 *
 * 
 */
export class SharedModule { }

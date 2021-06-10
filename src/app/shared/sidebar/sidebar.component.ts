import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  public imgUrl = '';
  public usuario: Usuario;

  constructor(private sidebarService: SidebarService, private usuarioService: UsuarioService) { 

    this.menuItems = this.sidebarService.menu;
    console.log(this.menuItems);

    this.imgUrl = this.usuarioService.usuario.imagenUrl;  
    this.usuario = this.usuarioService.usuario;   

  }

  ngOnInit(): void {
  }

}

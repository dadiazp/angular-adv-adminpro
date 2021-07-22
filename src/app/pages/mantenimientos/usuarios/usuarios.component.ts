import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(
              private usuarioService: UsuarioService, 
              private busquedaService: BusquedasService,
              private modalService: ModalImagenService
             ) { }

  ngOnInit(): void {

    this.cargarUsuarios();

    //Me suscribo al evento emitido desde el modal-imagen.component para de esta manera saber que se debe actualizar el listado de usuarios
    //Esto se hace cuando se cambia la imagen de algun usuario mediante el modal
    //Ojo, hago un pipe para demorar un poco la carga del componente para que de este modo no se cargue primero y aun no se tenga recibida la imagen
    this.imgSubs = this.modalService.nuevaImagen.
    pipe(
      delay(1000)
    ).
    subscribe(img => {
      this.cargarUsuarios();
    });
  
  }

  //Hago esto para desuscribirme del observable. La subscripcion sigue activa debido a que cuando la llamo anteriormente se recargará
  //la página, por lo tanto se mantiene activa
  ngOnDestroy(): void{
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios(){

    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde)
        //A continuacion desestructuro la respuesta e ingreso el total y los usuarios en variables
        .subscribe(({total, usuarios}) => {
          this.totalUsuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;
        });

  }

  cambiarPagina(valor: number){

    this.desde += valor;

    if(this.desde < 0){

      this.desde = 0

    }else if(this.desde >= this.totalUsuarios){

      this.desde -= valor

    }

    this.cargarUsuarios();

  }

  buscarTermino(termino: string){

    if(termino.length  === 0){
      return this.usuarios = this.usuariosTemp;
    }
    
    this.busquedaService.buscar('usuarios', termino)
        .subscribe((resp: Usuario[]) =>{
          this.usuarios = resp
        });

  }

  eliminarUsuario(usuario: Usuario){

    if(usuario.uid === this.usuarioService.usuario.uid){
      return Swal.fire('Error', 'No puede borrarse a sí mismo', 'error');
    }
    
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
            .subscribe(() => {
              this.cargarUsuarios();
              Swal.fire('Usuario borrado', `${usuario.nombre} fue eliminado correctamente`, 'success')
            });
      }
    })

  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
        .subscribe(resp => {
          console.log(resp);
        })
  }

  abrirModal(usuario: Usuario){
    this.modalService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
 
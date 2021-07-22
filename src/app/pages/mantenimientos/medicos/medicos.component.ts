import { Component, OnDestroy, OnInit } from '@angular/core';
import {Medico} from '../../../models/medico.model';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private modalService: ModalImagenService,
              private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalService.nuevaImagen.
    pipe(
      delay(1000)
    ).
    subscribe(img => {
      this.cargarMedicos();
    });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){  
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe(medicos => {
          this.cargando = false;
          this.medicos = medicos;
        });      
  }

  abrirModal(medico: Medico){
    this.modalService.abrirModal('medicos', medico._id, medico.img);
  }

  buscarTermino(termino: string){
    
    if(termino.length === 0){
      this.cargarMedicos();  
    }

    this.busquedaService.buscar('medicos', termino)
        .subscribe(resp => {
          this.medicos = resp;
        });
        
  }

  eliminarMedico(medico: Medico){

    Swal.fire({
      title: '¿Borrar medico?',
      text: `Está a punto de borrar  ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id)
        .subscribe(() => {
          this.cargarMedicos();
          Swal.fire('Medico borrado', `${medico.nombre} fue eliminado correctamente`, 'success');
        });  
      }
    })
    
  }

}

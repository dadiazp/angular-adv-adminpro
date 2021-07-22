import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(private hospitalService: HospitalService, 
              private modalService: ModalImagenService,
              private busquedaService: BusquedasService) { }

  ngOnInit(): void {

    this.cargarHospitales();

    this.imgSubs = this.modalService.nuevaImagen.
    pipe(
      delay(1000)
    ).
    subscribe(img => {
      this.cargarHospitales();
    });

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }


  cargarHospitales(){
    this.cargando = true;

    this.hospitalService.cargarHospitales()
        .subscribe(hospitales => {
          this.cargando = false;
          this.hospitales = hospitales;
        });

  }

  guardarCambios(hospital: Hospital){
    
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
        .subscribe(() => {
          Swal.fire('Actualizado', hospital.nombre, 'success');
        });

  }

  eliminarHospital(hospital: Hospital){

    Swal.fire({
      title: '¿Borrar hospital?',
      text: `Está a punto de borrar  ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id)
        .subscribe(() => {
          this.cargarHospitales();
          Swal.fire('Hospital borrado', `${hospital.nombre} fue eliminado correctamente`, 'success');
        });  
      }
    })
    
  }

  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del hospital'
    })
    
    if(value.trim().length > 0){
      this.hospitalService.crearHospital(value)
          .subscribe((resp: any) => {
            this.hospitales.push(resp.hospital); //En vez de llamar a cargarUsuarios, puedo hacer esto para actualizar el arreglo
          });
    }

  }

  abrirModal(hospital: Hospital){
    this.modalService.abrirModal('hospitales', hospital._id, hospital.img);
  }

  buscarTermino(termino: string){
    
    if(termino.length === 0){
      this.cargarHospitales();  
    }

    this.busquedaService.buscar('hospitales', termino)
        .subscribe(resp => {
          this.hospitales = resp;
        });
        
  }

} 

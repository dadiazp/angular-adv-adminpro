import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;

  constructor(private formBuilder: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    //Mediante esto obtengo los parametros de la URL
    //Es muy util ya que se dispara cada vez que cambia el parametro de la url, esto debido a que es un Observable
    //A continuacion desestructuro el params y le digo que recibiré el id
    this.activatedRoute.params.subscribe( ({id}) => {
      this.obtenerMedico(id);
    })

    this.medicoForm = this.formBuilder.group({
      nombre: ["", Validators.required],
      hospital: ["", Validators.required]
    });

    this.cargarHospitales();

    //Valuechanges es un observable que se dispara cada vez que cambia el valor de hospital
    //Cada vez que se cambie el hospital me devolverá el Id
    this.medicoForm.get('hospital')
        .valueChanges.subscribe(hospitalId => {
          //Es mas eficiente find que filter en este caso porque al encontrarlo termina de iterar
          this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId); 
        })
  }

  obtenerMedico(id: string){

    //Esto se hace debido a que si el usuario se va a crear no necesito que se siga ejecutando el resto del flujo
    if(id === 'nuevo'){
      return;
    }

    this.medicoService.obtenerMedico(id)
        //Hago este delay para poder cargar correctamente la imagen del hospital
        .pipe(
          delay(100)
        )
        .subscribe(medico => {

          //Si el usuario escrito está mal, no existe en db, etc
          if(!medico){
            return this.router.navigateByUrl(`/dashboard/medicos`)
          }

          //De esta forma desestructuro un objeto (hospital)
          const {nombre, hospital:{_id}} = medico
          this.medicoSeleccionado = medico;
          //Asigno los valores al formulario
          this.medicoForm.setValue({nombre, hospital: _id});
        });

  }

  guardarMedico(){

    const {nombre} = this.medicoForm.value;

    if(this.medicoSeleccionado){
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
          .subscribe(resp => {
            Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success')
          })
    }else{
      //crear
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((resp:any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success')
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
        });
    }
    
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
        .subscribe((hospitales: Hospital[]) => {
          this.hospitales = hospitales
        });
  }

}

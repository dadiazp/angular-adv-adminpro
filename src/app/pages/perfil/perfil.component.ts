import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = '';

  constructor(private formBuilder: FormBuilder, 
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) { 

                //Este usuario realmente apunta a la referencia de usuarioService.usuario
                this.usuario = usuarioService.usuario;
              }

  ngOnInit(): void {

    this.perfilForm = this.formBuilder.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });

  }

  actualizarPerfil(){
    console.log(this.perfilForm.value);

    this.usuarioService.actualizarUsuario(this.perfilForm.value)
      .subscribe((resp) => {

        console.log(resp);

        const {nombre, email} = this.perfilForm.value;

        //El usuario que tengo acá es una instancia del usuario que está en usuarioService,
        //Por tanto, hay que recordar que los servicios son singleton, es decir, solo se puede crear una instancia de los mismos
        //Eso significa, que esta instancia usuario es unica y se hace referencia a esta misma en cualquier sitio que se llame
        //En pocas palabras este usuario apunta a la misma referencia que el usuario del sidebar y del header(que viene siendo el del servicio), 
        //por lo que si modifico acá los valores de esta instancia, se actualizarán los datos en el header y sidebar
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire("Exito", "Perfil actualizado", "success");

      }, (err) => {
        Swal.fire("Error",err.error.msg, "error");
      });
  }

  cambiarImagen(file: File){
    this.imagenSubir = file;

    //De aqui hacia abajo realizo estos pasos para determinar si se cambia la imagen y así cambiar la previsualizacion
    if(!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      console.log(reader.result);
    }

  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
    .then(img => {
            this.usuario.img = img;// Acá pasa lo mismoo que anteriormente
            Swal.fire("Exito", "Imagen actualizada", "success");
         })
    .catch((err)=> {
      Swal.fire("Error", err, "error");
    })
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent {

  //Defino el formulario
  public registerForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [false, Validators.required]   //Para manejar el check de terminos y condiciones de formulario
  }, {  /***Validaciones personalizadas***/
    // Esto debe retornar una funcion porque las validaciones en angular
    //son referencias a funciones que se van a ejecutar cuando los valores cambien
    validators: this.passwordsIguales('password', 'password2')
  });

  public formSubmitted = false;

  constructor(private formBuilder: FormBuilder, 
              private usuarioService: UsuarioService,
              private router: Router) { }

  crearUsuario(){

    //De esta forma sé cuando el formulario se envió
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        this.router.navigateByUrl('/dashboard');
      }, err => {
        Swal.fire("Error", err.error.msg, "error");
      });
  }

  campoNoValido(campo: string):boolean{
    
    if(this.registerForm.get(campo).invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }

  }

  aceptaTerminos():boolean{

    if(!this.registerForm.get('terminos').value && this.formSubmitted){
      return true;
    }else{
      return false;
    }

  }

  verificarContrasena():boolean{

    if(this.registerForm.get('password').value !== this.registerForm.get('password2').value && this.formSubmitted){
      return true;
    }else{
      return false;
    }

  }

  passwordsIguales(pass1Name: string, pass2Name: string){

    //Esta funcion se dispara con el formGroup
    return (formGroup: FormGroup) => {
      
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        //Se setea un objeto que indica el error
        pass2Control.setErrors({noEsIgual:true});
      }

    }

  }

}

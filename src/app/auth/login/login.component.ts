import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2'

declare const gapi; // Cargo gapi del index.html


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Defino el formulario
  public loginForm = this.formBuilder.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  public formSubmitted = false;
  public auth2: any;

  constructor(private router: Router, 
              private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    //Renderizo el boton de Google
    this.renderButton();
  }

  login(){

    this.formSubmitted = true;

    if(this.loginForm.invalid){
      return;
    }

    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp => {
          
          if(this.loginForm.get('remember').value){
            localStorage.setItem('email', this.loginForm.get('email').value);
          }else{
            localStorage.removeItem('email');
          }

          this.router.navigateByUrl('/dashboard');

      }, err => {
        Swal.fire("Error", err.error.msg, "error");
      })
  
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.startApp();
  }

  async startApp(){
    
    await this.usuarioService.googleInit();
    
    //En este método startApp requiere que esté instanciado auth2 (No sé por qué)
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  
  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token)
                .subscribe(resp => {

                  //Se usa ngZone cuando se hace una redireccion desde un proceso externo a angular. En este caso
                  //la redireccion la estaba haciendo el proceso de google
                  //Es importante realizarlo ya que de lo contrario Angular puede perder el control de algunos procesos
                  //Por ejemplo, es posible que algunas funciones no se inicien
                  this.ngZone.run(()=> {
                    this.router.navigateByUrl('/dashboard');
                  })

                });

        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

  campoNoValido(campo: string){

    if(!this.loginForm.get(campo).value && this.formSubmitted){
      return true;
    }

    return false;

  }

}

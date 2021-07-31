import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';

import { loginForm } from '../interfaces/loginForm.interface';
import { registerForm } from '../interfaces/registerForm.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

//Lo hago acá afuera para no tener que llamarlo con this
const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { 

                //En Angular los servicios son singleton, solo va a haber una instancia de este servicio, solo se ejecutara esto 1 vez
                this.googleInit();
        
              }
  
  get token():string{
    return localStorage.getItem('token') || '';
  }

  get role():string{
    return this.usuario.role
  }

  get uid():string{
    return this.usuario.uid || '';
  }

  get getHeaders(){
    return {
      headers: {
      'x-token': this.token
      }
    }
  }

  googleInit(){

    return new Promise<void>(resolve =>{
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '433696774439-edb8h56l1pk5acpf5g2p3h3lga5rpjkh.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });
        resolve();
      });
    })
    
  }

  guardarLocalStorage(token: string, menu: any){
      localStorage.setItem('token', token);
      //Recuerda que en el localstorage solo se pueden guardar strings, la variable menu no lo es, por eso lo paso por el stringify
      localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout(){

    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    /** SignOut de Google**/
    this.auth2.signOut().then( () => {

      //Se usa ngZone cuando se hace una redireccion desde un proceso externo a angular. En este caso
      //la redireccion la estaba haciendo el proceso de google
      //Es importante realizarlo ya que de lo contrario Angular puede perder el control de algunos procesos
      //Por ejemplo, es posible que algunas funciones no se inicien
      this.ngZone.run(() => {
        this.router.navigateByUrl("/login");
      })

    });
    
  }

  validarToken(): Observable<boolean>{

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp:any) => {

        const {email, google, nombre, role, img = '', uid} = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

        this.guardarLocalStorage(resp.token, resp.menu)

        return true;
      }),
      //El catchError me atrapa los errores que ocurran en el flujo anterior
      //El of retornará un nuevo observable, de ese modo no rompemos el ciclo
      catchError(error => of(false))
    );

  }

  crearUsuario(formData: registerForm){
    
    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap((resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu)
                  })
                );

  }

  actualizarUsuario(data: {nombre:string, email:string, role:string}){

    //Data será lo que está dentro de data y ademas se añade role
    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.getHeaders);

  }

  login(formData: loginForm){
    
    //Tap simplemente me permite ejecutar un accion adicional en el observable. En este caso, se guarda el token en el Localstorage
    return this.http.post(`${base_url}/login`, formData)
               .pipe(
                 tap((resp: any) => {
                  this.guardarLocalStorage(resp.token, resp.menu)
                 })
               ); 

  }

  loginGoogle(token){
    
    //El token es un objeto, es por ello que el segundo parametro se envía así
    return this.http.post(`${base_url}/login/google`, {token})
               .pipe(
                 tap((resp: any) => {
                  this.guardarLocalStorage(resp.token, resp.menu)
                 })
               ); 

  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${desde}`;

    //A continuacion indico que el observable del get devolverá un objeto con esa informacion
    //Esto es necesario ya que en el usuario.component.ts al llamar este metodo puedo desestructurar sin problema
    //De lo contrario, dará error
    //También se puede colocar que el observable retorna any y ya está
    //O también podría crear una interface
    return this.http.get<{total: number, usuarios: Usuario[]}>(url, this.getHeaders)
    //A continuacion se realizó todo esto debido a que para mostrar la imagen debo invocar el getter getImage
    //Pero como este observable no devuelve una instancia de usuario no puedo acceder a ese getter
    //Por tanto se hizo esto
                .pipe(
                  map(resp => {

                    const usuarios = resp.usuarios.map(
                      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                    );

                    //Se debe retornar de esta forma, de lo contrario se pierde la estructura declarada anteriormente
                    //Si no coloco ningun return tambien dará error
                    return{
                      total: resp.total,
                      usuarios
                    };            

                  })
                );

  }

  eliminarUsuario(usuario: Usuario){
    
    const url = `${base_url}/usuarios/${usuario.uid}`;

    return this.http.delete(url, this.getHeaders)

  }

  //Metodo para actualizar un usuario desde la tabla de CRUD de usuarios
  guardarUsuario(usuario: Usuario){
  
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.getHeaders);

  }

}

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-promesa',
  templateUrl: './promesa.component.html',
  styles: [
  ]
})
export class PromesaComponent implements OnInit {

  constructor() { }

  //Generalmente las promesas se usan para ejecutar alguna tarea después de que algo suceda, o a destiempo de algo

  ngOnInit(): void {

    this.getUsers().then(usuarios => {
      console.log(usuarios)
    });

    // const promesa = new Promise( (resolve, reject) => {
      
    //   /*console.log("Hola Mundo");  <---Esto no es asincrono aun. Se hace sincrono cuando se le indica a 
    //   js la resolucion y el producto de la promesa como a continuación**/

    //   if(false){
        
    //     resolve("Hola Mundo");

    //   }else{

    //     reject("Algo salió mal");

    //   }

    // });


    // //Metodos: 
    // /*Then -> obtiene el resultado de la promesa si todo se ejecuta correctamente
    // /*Finally -> se ejecuta asi la promesa haya devuelto un error o se haya ejecutado correctamente
    // /*Catch -> captura algun error ocurrido en la promesa */

    // promesa.then( (mensaje) => {  //Ahora esto si es asincrono, primero se ejecutara Fin del init, y luego el Hola Mundo
    //   console.log(mensaje)
    // })
    // .catch(error => console.log("Error en mi promesa", error));

    // console.log("Fin del initi");

  }

  getUsers(){

    return new Promise( resolve => {
        
      fetch('https://reqres.in/api/users')
      .then(resp => resp.json())
      .then(body => resolve(body.data));

    });

  }

}
  
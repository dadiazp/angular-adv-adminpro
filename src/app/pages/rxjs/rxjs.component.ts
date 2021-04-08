import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() { 
    
    //  //El pipe permite transformar el flujo de informacion del observable entre otras cosas
    //  //El retry (sin argumentos) hace que el observable, si falla, vuelva a intentarse hasta dejar de fallar 
    //  //El retry con argumentos hace que se intente dependiendo del parametro que se le envie
    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe( //Con esto se empieza a ejecutar el obsevable, si nunca se subscribe, entonces no se ejecuta
    //   valor => console.log("Subs: ", valor),
    //   error => console.warn("Error: ", error),
    //   () => console.info('Obs terminado')
    // );

    this.intervalSubs = this.retornaIntervalo().subscribe(console.log); //  <--Es lo mismo que hacer esto: (valor) => console.log(valor)

  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo():Observable<number>{

    return interval(100).pipe(
      //take(10),   //Con esto puedo indicar cuantas emisiones del observable, en este caso el intervalo, se necesitan
      map( valor => {  //El map transforma la informacion que recibe el observable y mutarlo, transformarlo  de la manera que necesite
        return valor + 1;  //El map recibe el valor que emite el observable padre, en este caso, el del interval. De este modo el intervalo inicia desde 1
      }),
      filter( valor => (valor % 2 === 0) ? true: false), //Filter me ayuda a filtrar la info que devuelve el observable. Ojo, si esto es false, todo lo que esté por debajo no se ejecuta
    );

  }

  retornaObservable():Observable<number>{
    
    let i = -1;

    return new Observable<number>(observer => {


      //Coloco esto en una variable ya que es una funcion anonima y no se pueden referenciar a funciones anonimas a menos que esten en una var
      const intervalo = setInterval( () => {

        i++;
        observer.next(i); // next significa que es el siguiente valor que vamos a emitir

        if(i === 4){
          //De este modo cancelo el intervalo y completo el observable, de no hacer esto el observable seguirá ejecutandose de forma infinita
          clearInterval(intervalo);
          observer.complete();
        }
        if(i === 2){
          //Cuando se dispara el error se cancela el observable, no se sigue ejecutando
          observer.error("i llegó al valor de 2");
        }

      }, 1000)

    });

    //Parametros del subscribe:
    /**
     next => se ejecuta cuando el observable emite el siguiente valor
     error => se ejecuta cuando ocurre un error
     complete => se ejecuta cuando se completa el observable (Cuando el complete no devuelve parametros entonces se coloca parentesis vacios)
     */
  }

} 

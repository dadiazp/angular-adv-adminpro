import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels0:string[] = ['Pepitos', 'Jugos', 'Hamburguesas'];

  public labels1:string[] = ['Pan', 'Refrescos', 'Tacos'];

  public data0: any = [
    [30, 5, 20],
  ];

  public data1: any = [
    [10, 15, 40],
  ];

}

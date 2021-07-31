import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarmenu(){
    //Esto es un string, hay que pasarlo como objeto
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];
  }
}

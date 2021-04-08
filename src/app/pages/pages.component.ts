import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

//Declaracion de funcion global para el funcionamiento correcto de los plugins (en el assets/custom.js)
declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    //De esta forma se repara un pequeño bug que se tenía al iniciar el tema, pero no funciona
    //Ver en el video 68 del curso
    //customInitFunctions();
  }

}

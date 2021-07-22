import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

//Lo hago acá afuera para no tener que llamarlo con this
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get getHeaders(){
    return {
      headers: {
      'x-token': this.token
      }
    }
  }

  cargarHospitales(){

    const url = `${base_url}/hospitales`;

    return this.http.get(url, this.getHeaders)
        .pipe(
          map( (resp:{ok: boolean, hospitales: Hospital[]}) => resp.hospitales) //Acá indico que el observale retornará un ok y hospitales
        )

  }

  crearHospital(nombre: string){

    const url = `${base_url}/hospitales`;
    return this.http.post(url, {nombre}, this.getHeaders);

  }

  actualizarHospital(_id: string, nombre: string){

    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, {nombre}, this.getHeaders);

  }

  borrarHospital(_id: string){

    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.getHeaders);

  }


}

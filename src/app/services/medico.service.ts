import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import {Medico} from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos(){

    const url = `${base_url}/medicos`;
    return this.http.get(url, this.getHeaders)
                .pipe(
                  map( (resp: any) => resp.medicos) //Acá indico que el observale retornará un any, en hospital hay otra forma de hacerlo
                )

  }

  obtenerMedico(id: string){

    const url = `${base_url}/medicos/${id}`;
    return this.http.get(url, this.getHeaders)
               .pipe(
                 map((resp: {ok: boolean, medico: Medico}) => resp.medico)
               )

  }

  crearMedico(medico: {nombre: string, hospital: string}){

    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.getHeaders);

  }

  actualizarMedico(medico: Medico){

    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.getHeaders);

  }

  borrarMedico(_id: string){

    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url, this.getHeaders);

  }

}

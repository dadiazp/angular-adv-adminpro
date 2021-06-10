import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  //Si se usa el async es bueno manejar el try y catch
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string
  ){

    try{

      const url = `${base_url}/upload/${tipo}/${id}`;

      //FormData es una forma distinta de http de crear la data que quiero enviar al backend
      const formData = new FormData()
      //image es el campo que espera el backend
      formData.append('imagen', archivo);

      //Fetch permite hacer peticiones http
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      //Paso de ReadableStream a json 
      const data = await resp.json();

      if(data.ok){
        return data.nombreArchivo;
      }else{
        console.log(data.msg);
        return data.msg;
      }
    
    }catch(error){  
      console.log(error);
      return false;
    }

  }

}

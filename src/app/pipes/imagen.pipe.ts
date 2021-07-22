import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})

//Un pipe me sirve para transformar la forma visual de cómo recibo la información
//Es decir, si recibo un string puedo transformarlo, pero esa transfomración solo será de manera visual
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios' | 'medicos' | 'hospitales'): string {

    if(!img){
      return `${base_url}/upload/usuarios/no-image`;
    }else if(img.includes('https')){
        return img;
    }else if(img){
        return `${base_url}/upload/${tipo}/${img}`;
    }else{
        return `${base_url}/upload/usuarios/no-image`;
    } 
    
  } 

}


import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  //Cuando cierro el modal yo quiero hacer una especie de limpieza, como limpiar la imagen, por eso se coloca privado
  private _ocultarModal: boolean = true;
  public tipo: 'usuarios'|'medicos'|'hospitales';
  public id: string;
  public img: string

  //Esto emitirá la url de la nueva imagen para así actualizar el componente del listado de usarios y actualizar su foto
  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultarModal;
  }

  constructor() { }

  //Inicializo la img con una no_img para que se forme un path de la imagen no existente
  //De ese modo el backend no fallará, simplemente mostrará la no-image que tenemos por defecto
  abrirModal(tipo: 'usuarios'|'medicos'|'hospitales', id:string, img: string = 'no-img'){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    //this.img = img;
    if(img.includes("https")){
      this.img = img;
    }else{
      this.img = `${base_url}/upload/${tipo}/${img}`
    }
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

}

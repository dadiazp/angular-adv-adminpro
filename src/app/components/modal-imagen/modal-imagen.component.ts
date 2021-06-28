import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = '';

  //Lo coloco publico porque usaré la propiedad en el html
  constructor(public modalService: ModalImagenService, public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalService.cerrarModal();
  }

  cambiarImagen(file: File){
    this.imagenSubir = file;

    //De aqui hacia abajo realizo estos pasos para determinar si se cambia la imagen y así cambiar la previsualizacion
    if(!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      console.log(reader.result);
    }

  }

  subirImagen(){

    const id = this.modalService.id;
    const tipo = this.modalService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
    .then(img => {
            Swal.fire("Exito", "Imagen actualizada", "success");
            //Emito este evento para avisar que se debe actualizar el listado de usuarios
            this.modalService.nuevaImagen.emit(img)
            this.cerrarModal();
         })
    .catch((err)=> {
      Swal.fire("Error", err, "error");
    })
  }

}

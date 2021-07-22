import {Hospital} from '../models/hospital.model';

interface _MedicoUser{
    _id: string,
    nombre: string,
    img: string
}

export class Medico{

    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _MedicoUser, //Hago esto para indicar qué campos tendrá el Medicouser
        public hospital?: Hospital
    ){}
}
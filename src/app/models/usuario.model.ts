export class Usuario {

    constructor(
        public nombre:string,
        public email:string,
        public password?:string, //opcional
        public img?:string,
        public google?:boolean, //opcional
        public role?:string, //opcional
        public uid?:string //opcional
    ){}

}
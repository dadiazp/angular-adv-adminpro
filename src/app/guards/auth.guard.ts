import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usuarioService: UsuarioService,
              private router: Router){}


  //Implemento el canLoad porque en el pageRouting lo implementé con el auth guard
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.usuarioService.validarToken()
                 .pipe(
                   tap(estaAutenticado => {
                     if(!estaAutenticado){
                       this.router.navigateByUrl('/login');
                     }
                   })
                 );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

      return this.usuarioService.validarToken()
                 .pipe(
                   tap(estaAutenticado => {
                     if(!estaAutenticado){
                       this.router.navigateByUrl('/login');
                     }
                   })
                 );

  }
  
}

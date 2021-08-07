import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard'; 


const routes: Routes = [
    {
        path: 'dashboard', 
        component: PagesComponent, 
        canActivate: [AuthGuard],
        //Lazy load de las principales rutas del proyecto
        canLoad:[AuthGuard],
        loadChildren: () => import('./child-routes.module').then(modulo => modulo.ChildRoutesModule)
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}

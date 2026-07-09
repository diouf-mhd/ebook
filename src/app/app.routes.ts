import { Routes } from '@angular/router';
import { AppComponent } from './app';
import { AdminComponent } from './admin';

export const routes: Routes = [
  { path: '',      component: AppComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**',    redirectTo: '' }
];
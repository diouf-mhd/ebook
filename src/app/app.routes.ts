import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AdminComponent } from './admin'; // <-- RETIRE LE ".ts" ICI

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
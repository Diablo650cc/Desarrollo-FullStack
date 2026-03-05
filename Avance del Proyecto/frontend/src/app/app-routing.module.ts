import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { UsuariosComponent } from './components/admin/usuarios/usuarios.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard],
    component: PerfilComponent
  },
  {
    path: 'pagos',
    canActivate: [AuthGuard],
    component: PagosComponent
  },
  {
    path: 'admin/usuarios',
    canActivate: [AdminGuard],
    component: UsuariosComponent
  },
  {
    path: 'admin/dashboard',
    canActivate: [AdminGuard],
    component: DashboardAdminComponent
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


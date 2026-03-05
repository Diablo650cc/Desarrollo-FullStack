import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AxiosResponse, AxiosError } from 'axios';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fas fa-rocket"></i> FullStack App
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/perfil" routerLinkActive="active">Perfil</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/pagos" routerLinkActive="active">Pagos</a>
            </li>
            <li class="nav-item" *ngIf="auth.esAdmin()">
              <a class="nav-link" routerLink="/admin/dashboard" routerLinkActive="active">Admin</a>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-light ms-2" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i> Salir
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
      font-size: 1.5rem;
    }
    .nav-link.active {
      color: #fff !important;
      border-bottom: 2px solid #007bff;
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8">
          <h1>Bienvenido, {{ usuario?.nombre }}!</h1>
          <p class="text-muted">Rol: {{ usuario?.rol }}</p>

          <div class="row mt-4">
            <div class="col-md-6 mb-3">
              <div class="card text-center shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">Mi Perfil</h5>
                  <p class="card-text">{{ usuario?.email }}</p>
                  <a routerLink="/perfil" class="btn btn-primary">
                    <i class="fas fa-user"></i> Ir al perfil
                  </a>
                </div>
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <div class="card text-center shadow-sm">
                <div class="card-body">
                  <h5 class="card-title">Pagos</h5>
                  <p class="card-text">Gestiona tus pagos</p>
                  <a routerLink="/pagos" class="btn btn-success">
                    <i class="fas fa-credit-card"></i> Ver pagos
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-4" *ngIf="auth.esAdmin()">
            <div class="col-md-12">
              <div class="alert alert-info">
                <h5>Panel de Administrador</h5>
                <p>Tienes acceso a funciones administrativas</p>
                <a routerLink="/admin/usuarios" class="btn btn-info btn-sm">
                  <i class="fas fa-users"></i> Gestionar Usuarios
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card bg-light shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Información Rápida</h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <strong>Usuario ID:</strong> {{ usuario?.id }}
                </li>
                <li class="mb-2">
                  <strong>Email:</strong> {{ usuario?.email }}
                </li>
                <li class="mb-2">
                  <strong>Rol:</strong> 
                  <span [ngClass]="usuario?.rol === 'admin' ? 'badge bg-danger' : 'badge bg-primary'">
                    {{ usuario?.rol }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  usuario: any;

  constructor(
    public auth: AuthService,
    private api: ApiService
  ) {
    this.usuario = this.auth.obtenerUsuarioActual();
  }

  ngOnInit() {
    if (!this.usuario) {
      this.api.obtenerPerfil().then((response: AxiosResponse<any>) => {
        this.usuario = response.data.data;
      }).catch((error: AxiosError<any>) => {
        console.error('Error al obtener perfil:', error);
      });
    }
  }
}

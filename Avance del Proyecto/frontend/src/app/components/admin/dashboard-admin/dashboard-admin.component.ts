import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AxiosResponse, AxiosError } from 'axios';
import { NavbarComponent } from '../../dashboard/dashboard.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid mt-5">
      <h2>Panel de Administración</h2>

      <div class="row mt-4">
        <div class="col-md-3">
          <div class="card shadow">
            <div class="card-body text-center">
              <h6 class="card-title">Usuarios Totales</h6>
              <h4>{{ totalUsuarios }}</h4>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card shadow">
            <div class="card-body text-center">
              <h6 class="card-title">Pagos Completados</h6>
              <h4>{{ totalPagos }}</h4>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card shadow">
            <div class="card-body text-center">
              <h6 class="card-title">Administradores</h6>
              <h4>{{ totalAdmins }}</h4>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card shadow">
            <div class="card-body text-center">
              <h6 class="card-title">Precio del Dólar</h6>
              <h4>{{ tasaCambio?.ars | number:'1.2-2' }} ARS</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Acciones Rápidas</h5>
            </div>
            <div class="card-body">
              <button class="btn btn-primary w-100 mb-2">
                <i class="fas fa-user-plus"></i> Crear Nuevo Usuario
              </button>
              <button class="btn btn-info w-100 mb-2">
                <i class="fas fa-users"></i> Gestionar Usuarios
              </button>
              <button class="btn btn-warning w-100">
                <i class="fas fa-cog"></i> Configuración
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">Estado del Sistema</h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li class="mb-2"><strong>Base de Datos:</strong> <span class="badge bg-success">Conectada</span></li>
                <li class="mb-2"><strong>API Dólar:</strong> <span class="badge bg-success">Operativa</span></li>
                <li class="mb-2"><strong>Pagos Stripe:</strong> <span class="badge bg-info">Configurado</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardAdminComponent implements OnInit {
  totalUsuarios = 0;
  totalPagos = 0;
  totalAdmins = 0;
  tasaCambio: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    // Cargar usuarios
    this.api.obtenerUsuarios(1, 1000)
      .then((response: AxiosResponse<any>) => {
        this.totalUsuarios = response.data.paginacion.total;
        this.totalAdmins = response.data.data.filter((u: any) => u.rol === 'admin').length;
      })
      .catch((error: AxiosError<any>) => console.error(error));

    // Cargar pagos
    this.api.obtenerPagos(1, 100)
      .then((response: AxiosResponse<any>) => {
        this.totalPagos = response.data.paginacion.total;
      })
      .catch((error: AxiosError<any>) => console.error(error));

    // Cargar tasa de cambio
    this.api.obtenerPrecioDolar()
      .then((response: AxiosResponse<any>) => {
        this.tasaCambio = response.data.data;
      })
      .catch((error: AxiosError<any>) => console.error(error));
  }
}

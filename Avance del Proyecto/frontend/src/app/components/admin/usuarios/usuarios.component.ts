import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AxiosResponse, AxiosError } from 'axios';
import { NavbarComponent } from '../../dashboard/dashboard.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container-fluid mt-5">
      <div class="row mb-4">
        <div class="col-md-8">
          <h2>Gestión de Usuarios</h2>
        </div>
        <div class="col-md-4">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar por nombre o email"
            [(ngModel)]="searchQuery"
            (change)="buscar()">
        </div>
      </div>

      <div *ngIf="errorr" class="alert alert-danger">{{ errorr }}</div>

      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registrado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let usuario of usuarios">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.email }}</td>
              <td>
                <span [ngClass]="usuario.rol === 'admin' ? 'badge bg-danger' : 'badge bg-primary'">
                  {{ usuario.rol }}
                </span>
              </td>
              <td>{{ usuario.created_at | date:'short' }}</td>
              <td>
                <button class="btn btn-sm btn-info me-2" (click)="editar(usuario)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" (click)="eliminar(usuario.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" [ngClass]="{ disabled: paginaActual === 1 }">
            <button class="page-link" (click)="irAPagina(paginaActual - 1)">Anterior</button>
          </li>
          <li class="page-item active">
            <span class="page-link">Página {{ paginaActual }} de {{ totalPaginas }}</span>
          </li>
          <li class="page-item" [ngClass]="{ disabled: paginaActual === totalPaginas }">
            <button class="page-link" (click)="irAPagina(paginaActual + 1)">Siguiente</button>
          </li>
        </ul>
      </nav>
    </div>
  `
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  searchQuery = '';
  paginaActual = 1;
  totalPaginas = 1;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.api.obtenerUsuarios(this.paginaActual, 10, this.searchQuery)
      .then((response: AxiosResponse<any>) => {
        this.usuarios = response.data.data;
        this.totalPaginas = response.data.paginacion.totalPaginas;
      })
      .catch((error: AxiosError<any>) => {
        this.error = error.response?.data?.message || 'Error al cargar usuarios';
      });
  }

  buscar() {
    this.paginaActual = 1;
    this.cargarUsuarios();
  }

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarUsuarios();
    }
  }

  editar(usuario: any) {
    alert(`Editar usuario ${usuario.nombre} - Funcionalidad en desarrollo`);
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      // Implementar eliminación
      alert('Eliminación en desarrollo');
    }
  }
}

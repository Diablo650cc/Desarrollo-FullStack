import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AxiosResponse, AxiosError } from 'axios';
import { NavbarComponent } from '../dashboard/dashboard.component';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">Mi Perfil</h4>
            </div>
            <div class="card-body p-4">
              <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
              <div *ngIf="success" class="alert alert-success">{{ success }}</div>

              <div class="mb-3">
                <label class="form-label"><strong>ID:</strong></label>
                <p>{{ usuario?.id }}</p>
              </div>

              <div class="mb-3">
                <label class="form-label"><strong>Rol:</strong></label>
                <p>
                  <span [ngClass]="usuario?.rol === 'admin' ? 'badge bg-danger' : 'badge bg-primary'">
                    {{ usuario?.rol }}
                  </span>
                </p>
              </div>

              <form [formGroup]="form" (ngSubmit)="submit()">
                <div class="mb-3">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nombre"
                    formControlName="nombre">
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email">
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;
  usuario: any;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private api: ApiService
  ) {
    this.usuario = this.auth.obtenerUsuarioActual();
  }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: [this.usuario?.nombre, Validators.required],
      email: [this.usuario?.email, [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const { nombre, email } = this.form.value;

    this.api.actualizarPerfil(nombre, email).then((response: AxiosResponse<any>) => {
      this.success = 'Perfil actualizado correctamente';
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      this.loading = false;
    }).catch((error: AxiosError<any>) => {
      this.error = error.response?.data?.message || 'Error al actualizar';
      this.loading = false;
    });
  }
}

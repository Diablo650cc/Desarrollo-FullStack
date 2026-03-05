import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AxiosResponse, AxiosError } from 'axios';
import { NavbarComponent } from '../dashboard/dashboard.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6">
          <div class="card shadow mb-4">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">Nuevo Pago</h5>
            </div>
            <div class="card-body">
              <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
              <div *ngIf="success" class="alert alert-success">{{ success }}</div>

              <form [formGroup]="formPago" (ngSubmit)="procesarPago()">
                <div class="mb-3">
                  <label for="monto" class="form-label">Monto</label>
                  <input
                    type="number"
                    class="form-control"
                    id="monto"
                    formControlName="monto"
                    step="0.01"
                    min="0.50">
                </div>

                <div class="mb-3">
                  <label for="moneda" class="form-label">Moneda</label>
                  <select class="form-control" id="moneda" formControlName="moneda">
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                    <option value="MXN">MXN</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="descripcion" class="form-label">Descripción</label>
                  <textarea
                    class="form-control"
                    id="descripcion"
                    formControlName="descripcion"
                    rows="3"></textarea>
                </div>

                <button type="submit" class="btn btn-success w-100" [disabled]="formPago.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Procesando...' : 'Procesar Pago' }}
                </button>
              </form>
            </div>
          </div>

          <div class="card bg-light">
            <div class="card-body">
              <h6 class="card-title">Tasa de Cambio</h6>
              <p *ngIf="tasaCambio">
                1 USD = {{ tasaCambio.ars | number:'1.2-2' }} ARS<br>
                1 USD = {{ tasaCambio.mxn | number:'1.2-2' }} MXN
              </p>
              <button class="btn btn-sm btn-info" (click)="cargarTasaCambio()">Actualizar tasas</button>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Historial de Pagos</h5>
            </div>
            <div class="card-body">
              <div *ngIf="pagos.length === 0" class="alert alert-info">
                No hay pagos registrados
              </div>
              <div *ngFor="let pago of pagos" class="mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between">
                  <strong>{{ pago.descripcion }}</strong>
                  <span class="badge bg-success">{{ pago.estado }}</span>
                </div>
                <small class="text-muted">
                  {{ pago.monto }} {{ pago.moneda }} - {{ pago.created_at | date:'short' }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PagosComponent implements OnInit {
  formPago!: FormGroup;
  pagos: any[] = [];
  tasaCambio: any;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.formPago = this.fb.group({
      monto: [0, [Validators.required, Validators.min(0.50)]],
      moneda: ['USD', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.cargarPagos();
    this.cargarTasaCambio();
  }

  procesarPago() {
    if (this.formPago.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const { monto, moneda, descripcion } = this.formPago.value;

    this.api.procesarPago(monto, moneda, descripcion).then((response: AxiosResponse<any>) => {
      this.success = 'Pago procesado correctamente!';
      this.formPago.reset({ moneda: 'USD' });
      this.cargarPagos();
      this.loading = false;
    }).catch((error: AxiosError<any>) => {
      this.error = error.response?.data?.message || 'Error al procesar pago';
      this.loading = false;
    });
  }

  cargarPagos() {
    this.api.obtenerPagos(1, 5).then((response: AxiosResponse<any>) => {
      this.pagos = response.data.data;
    }).catch((error: AxiosError<any>) => console.error(error));
  }

  cargarTasaCambio() {
    this.api.obtenerPrecioDolar().then((response: AxiosResponse<any>) => {
      this.tasaCambio = response.data.data;
    }).catch((error: AxiosError<any>) => console.error(error));
  }
}

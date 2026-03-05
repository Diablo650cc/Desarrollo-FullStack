import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiClient: AxiosInstance;
  private baseURL = 'http://localhost:3000/api';

  constructor() {
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para agregar token al header
    this.apiClient.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  // Autenticación
  registro(nombre: string, email: string, password: string) {
    return this.apiClient.post('/usuarios/registro', {
      nombre,
      email,
      password
    });
  }

  login(email: string, password: string) {
    return this.apiClient.post('/usuarios/login', {
      email,
      password
    });
  }

  // Usuarios
  obtenerPerfil() {
    return this.apiClient.get('/usuarios/perfil');
  }

  actualizarPerfil(nombre: string, email: string) {
    return this.apiClient.put('/usuarios/perfil', {
      nombre,
      email
    });
  }

  obtenerUsuarios(page = 1, limit = 10, search = '') {
    return this.apiClient.get('/usuarios', {
      params: { page, limit, search }
    });
  }

  obtenerUsuario(id: number) {
    return this.apiClient.get(`/usuarios/${id}`);
  }

  // Pagos
  procesarPago(monto: number, moneda: string, descripcion: string) {
    return this.apiClient.post('/pagos/procesar', {
      monto,
      moneda,
      descripcion
    });
  }

  obtenerPagos(page = 1, limit = 10) {
    return this.apiClient.get('/pagos', {
      params: { page, limit }
    });
  }

  obtenerPago(id: number) {
    return this.apiClient.get(`/pagos/${id}`);
  }

  // APIs Externas
  obtenerPrecioDolar() {
    return this.apiClient.get('/external/dolar');
  }

  convertirDolar(cantidad: number, towards: string) {
    return this.apiClient.get('/external/dolar/convertir', {
      params: { cantidad, towards }
    });
  }
}

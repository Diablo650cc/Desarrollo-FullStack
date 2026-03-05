import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual: any = null;

  constructor(private router: Router) {
    this.cargarUsuarioDelStorage();
  }

  private cargarUsuarioDelStorage() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioActual = JSON.parse(usuario);
    }
  }

  login(email: string, password: string, usuarioData: any, token: string) {
    this.usuarioActual = usuarioData;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
  }

  logout() {
    this.usuarioActual = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  isAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerUsuarioActual(): any {
    return this.usuarioActual;
  }

  esAdmin(): boolean {
    return this.usuarioActual?.rol === 'admin';
  }
}

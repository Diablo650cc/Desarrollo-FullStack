import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthResponse } from '../models/auth.model';

interface JwtPayload {
  id: string;
  email: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private readonly apiFallbackBaseUrl = 'http://localhost:5000';
  private readonly tokenKey = 'authToken';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          // Fallback para entornos donde no esta activo el proxy de Angular.
          if (error?.status === 0 || error?.status === 404) {
            return this.http.post<AuthResponse>(
              `${this.apiFallbackBaseUrl}${this.apiUrl}/login`,
              { email, password }
            );
          }

          return throwError(() => error);
        }),
        tap((response) => this.setToken(response.token))
      );
  }

  register(email: string, password: string, role: 'admin' | 'user' = 'user'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      email,
      password,
      role
    }).pipe(
      catchError((error) => {
        if (error?.status === 0 || error?.status === 404) {
          return this.http.post<AuthResponse>(
            `${this.apiFallbackBaseUrl}${this.apiUrl}/register`,
            {
              email,
              password,
              role
            }
          );
        }

        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const payload = this.getPayload();
    if (!payload) {
      return false;
    }
    return payload.exp * 1000 > Date.now();
  }

  getUserEmail(): string {
    return this.getPayload()?.email ?? 'Usuario';
  }

  getUserRole(): 'admin' | 'user' {
    return this.getPayload()?.role ?? 'user';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  private getPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const [, payload] = token.split('.');
      return JSON.parse(this.decodeBase64Url(payload)) as JwtPayload;
    } catch {
      return null;
    }
  }

  private decodeBase64Url(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return atob(padded);
  }
}

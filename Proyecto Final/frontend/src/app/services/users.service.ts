import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UpdateUserPayload, UserRecord } from '../models/user.model';

type UsersApiResponse =
  | UserRecord[]
  | {
      users?: UserRecord[];
      data?: UserRecord[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
      [key: string]: unknown;
    };

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly apiUrl = '/api/users';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getUsers(): Observable<UserRecord[]> {
    const headers = this.getHeaders();

    return this.http.get<UsersApiResponse>(this.apiUrl, { headers }).pipe(
      map((response) => this.normalizeUsersResponse(response)),
      catchError((error) => {
        // Fallback para entornos donde no esta activo el proxy de Angular.
        if (error?.status === 0 || error?.status === 404) {
          return this.http
            .get<UsersApiResponse>(`http://localhost:5000${this.apiUrl}`, { headers })
            .pipe(map((response) => this.normalizeUsersResponse(response)));
        }

        return throwError(() => error);
      })
    );
  }

  updateUser(id: string, payload: UpdateUserPayload): Observable<UserRecord> {
    return this.http.put<UserRecord>(`${this.apiUrl}/${id}`, payload, {
      headers: this.getHeaders()
    });
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });
  }

  private normalizeUsersResponse(response: UsersApiResponse): UserRecord[] {
    if (Array.isArray(response)) {
      return response.map((user) => this.normalizeUser(user));
    }

    const wrappedUsers = response?.users ?? response?.data;
    if (Array.isArray(wrappedUsers)) {
      return wrappedUsers.map((user) => this.normalizeUser(user));
    }

    return [];
  }

  private normalizeUser(user: Partial<UserRecord>): UserRecord {
    return {
      id: String(user.id ?? ''),
      email: user.email ?? '',
      role: (user.role as 'admin' | 'user') ?? 'user',
      createdAt: user.createdAt ?? ''
    };
  }
}

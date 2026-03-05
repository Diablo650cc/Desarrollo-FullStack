import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, retry, timeout } from 'rxjs/operators';
import { UserRecord } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-users-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.page.html',
  styleUrl: './admin-users.page.css'
})
export class AdminUsersPage implements OnInit, OnDestroy {
  private readonly usersCacheKey = 'adminUsersCache';
  private readonly autoRefreshMs = 5000;
  private refreshIntervalId: ReturnType<typeof setInterval> | null = null;
  private requestInFlight = false;

  users: UserRecord[] = [];
  loading = false;
  loadError = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  editingUserId: string | null = null;

  form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['user', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/products']);
      return;
    }

    this.hydrateUsersFromCache();
    this.loadUsers();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadUsers(showLoader = true): void {
    if (this.requestInFlight) {
      return;
    }

    this.requestInFlight = true;
    if (showLoader) {
      this.loading = true;
    }
    this.loadError = false;
    this.usersService
      .getUsers()
      .pipe(
        timeout(20000),
        retry({ count: 2, delay: 800 }),
        finalize(() => {
          this.requestInFlight = false;
          if (showLoader) {
            this.loading = false;
          }
        })
      )
      .subscribe({
      next: (users) => {
        this.users = users;
        this.loadError = false;
        this.persistUsersCache(users);
      },
      error: (error) => {
        this.loadError = this.users.length === 0;
        if (error?.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }
        this.showMessage(
          error?.name === 'TimeoutError'
            ? 'La carga de usuarios tardo demasiado. Se mantienen los ultimos datos visibles.'
            : error?.error?.message ?? 'No se pudo cargar usuarios',
          'error'
        );
      }
    });
  }

  startEdit(user: UserRecord): void {
    this.editingUserId = user.id;
    this.form.reset({
      email: user.email,
      password: '',
      role: user.role
    });
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.form.reset({
      email: '',
      password: '',
      role: 'user'
    });
  }

  saveEdit(): void {
    if (!this.editingUserId || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, role } = this.form.getRawValue();
    const payload: { email?: string; password?: string; role?: 'admin' | 'user' } = {
      email: email ?? '',
      role: (role as 'admin' | 'user') ?? 'user'
    };

    if (password) {
      payload.password = password;
    }

    this.usersService.updateUser(this.editingUserId, payload).subscribe({
      next: () => {
        this.showMessage('Usuario actualizado correctamente', 'success');
        this.cancelEdit();
        this.loadUsers();
      },
      error: (error) => {
        if (error?.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }
        this.showMessage(error?.error?.message ?? 'No se pudo actualizar usuario', 'error');
      }
    });
  }

  deleteUser(user: UserRecord): void {
    const confirmed = window.confirm(`¿Eliminar usuario ${user.email}?`);
    if (!confirmed) {
      return;
    }

    this.usersService.deleteUser(user.id).subscribe({
      next: () => {
        this.showMessage('Usuario eliminado correctamente', 'success');
        this.loadUsers();
      },
      error: (error) => {
        if (error?.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }
        this.showMessage(error?.error?.message ?? 'No se pudo eliminar usuario', 'error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  trackById(_: number, user: UserRecord): string {
    return user.id;
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  private persistUsersCache(users: UserRecord[]): void {
    try {
      localStorage.setItem(this.usersCacheKey, JSON.stringify(users));
    } catch {
      // Ignorar errores de almacenamiento local.
    }
  }

  private hydrateUsersFromCache(): void {
    try {
      const raw = localStorage.getItem(this.usersCacheKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as UserRecord[];
      if (Array.isArray(parsed)) {
        this.users = parsed;
      }
    } catch {
      this.users = [];
    }
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.refreshIntervalId = setInterval(() => {
      this.loadUsers(false);
    }, this.autoRefreshMs);
  }

  private stopAutoRefresh(): void {
    if (!this.refreshIntervalId) {
      return;
    }

    clearInterval(this.refreshIntervalId);
    this.refreshIntervalId = null;
  }
}

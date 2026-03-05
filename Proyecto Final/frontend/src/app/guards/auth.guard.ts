import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data?.['roles'] as Array<'admin' | 'user'> | undefined;
  if (expectedRoles && expectedRoles.length > 0) {
    const userRole = authService.getUserRole();
    if (!expectedRoles.includes(userRole)) {
      router.navigate(['/products']);
      return false;
    }
  }

  return true;
};

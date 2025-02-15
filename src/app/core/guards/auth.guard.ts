import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router); // Inject Router
  const requiredRole = route.data['role'] as string[];
  if (authService.isAuthenticated()) {
    const userRole = authService.getRoles();
    const hasAccess = requiredRole.includes(userRole);
    if (!requiredRole || hasAccess) {
      return true; // Allow access
    } else {
      // If role does not match, redirect to unauthorized page lee pal Pyae Paing
      router.navigate(['/401']);
      return false;
    }
  } else {
    authService.logout();
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};

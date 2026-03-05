import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginPage } from './pages/login/login.page';
import { ProductsPage } from './pages/products/products.page';
import { RegisterPage } from './pages/register/register.page';
import { AdminUsersPage } from './pages/admin-users/admin-users.page';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginPage },
	{ path: 'register', component: RegisterPage },
	{ path: 'products', component: ProductsPage, canActivate: [authGuard] },
	{ path: 'admin/users', component: AdminUsersPage, canActivate: [authGuard] },
	{ path: '**', redirectTo: 'login' }
];

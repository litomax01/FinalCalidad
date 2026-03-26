import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { ProductsComponent } from './pages/products.component';
import { CartComponent } from './pages/cart.component';
import { AdminProductsComponent } from './pages/admin-products.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'admin-products', component: AdminProductsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];

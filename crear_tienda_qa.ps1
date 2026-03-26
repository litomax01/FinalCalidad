# ============================================
# Crear proyecto Angular: tienda-qa
# Login + Register + Productos + Carrito
# Datos locales en JSON + LocalStorage
# ============================================

$ErrorActionPreference = "Stop"

Write-Host "==> Verificando Node y npm..."
node -v
npm -v

Write-Host "==> Instalando Angular CLI globalmente si hace falta..."
npm install -g @angular/cli

Write-Host "==> Creando proyecto Angular..."
ng new tienda-qa --routing --style=css --skip-git --defaults

Set-Location tienda-qa

Write-Host "==> Creando carpetas..."
New-Item -ItemType Directory -Force -Path src/app/pages | Out-Null
New-Item -ItemType Directory -Force -Path src/app/services | Out-Null
New-Item -ItemType Directory -Force -Path src/app/guards | Out-Null
New-Item -ItemType Directory -Force -Path src/app/shared | Out-Null
New-Item -ItemType Directory -Force -Path src/assets/data | Out-Null

Write-Host "==> Instalando dependencias..."
npm install

Write-Host "==> Escribiendo archivos del proyecto..."

@'
export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}
'@ | Set-Content src/app/shared/models.ts -Encoding UTF8

@'
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { ProductsComponent } from './pages/products.component';
import { CartComponent } from './pages/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
'@ | Set-Content src/app/app.routes.ts -Encoding UTF8

@'
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
'@ | Set-Content src/app/guards/auth.guard.ts -Encoding UTF8

@'
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product, User } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class DataSeedService {
  private readonly usersKey = 'qa_users';
  private readonly productsKey = 'qa_products';
  private readonly cartKey = 'qa_cart';
  private readonly sessionKey = 'qa_session';

  constructor(private http: HttpClient) {}

  async seedAppData(): Promise<void> {
    if (!localStorage.getItem(this.usersKey)) {
      const users = await firstValueFrom(
        this.http.get<User[]>('assets/data/users.json')
      );
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    if (!localStorage.getItem(this.productsKey)) {
      const products = await firstValueFrom(
        this.http.get<Product[]>('assets/data/products.json')
      );
      localStorage.setItem(this.productsKey, JSON.stringify(products));
    }

    if (!localStorage.getItem(this.cartKey)) {
      localStorage.setItem(this.cartKey, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.sessionKey)) {
      localStorage.setItem(this.sessionKey, '');
    }
  }
}
'@ | Set-Content src/app/services/data-seed.service.ts -Encoding UTF8

@'
import { Injectable } from '@angular/core';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersKey = 'qa_users';
  private readonly sessionKey = 'qa_session';

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const foundUser = users.find(
      user => user.username === username && user.password === password
    );

    if (!foundUser) {
      return false;
    }

    localStorage.setItem(this.sessionKey, foundUser.username);
    return true;
  }

  register(name: string, username: string, password: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const exists = users.some(user => user.username === username);

    if (exists) {
      return { success: false, message: 'El nombre de usuario ya existe.' };
    }

    const newUser: User = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      username,
      password
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return { success: true, message: 'Usuario registrado correctamente.' };
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.sessionKey);
  }

  getCurrentUsername(): string {
    return localStorage.getItem(this.sessionKey) || '';
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }
}
'@ | Set-Content src/app/services/auth.service.ts -Encoding UTF8

@'
import { Injectable } from '@angular/core';
import { Product } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsKey = 'qa_products';

  getProducts(): Product[] {
    return JSON.parse(localStorage.getItem(this.productsKey) || '[]');
  }
}
'@ | Set-Content src/app/services/product.service.ts -Encoding UTF8

@'
import { Injectable } from '@angular/core';
import { CartItem, Product } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartKey = 'qa_cart';

  getItems(): CartItem[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  addToCart(product: Product): void {
    const items = this.getItems();
    const existingItem = items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }

    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }

  clearCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify([]));
  }

  getTotal(): number {
    return this.getItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
'@ | Set-Content src/app/services/cart.service.ts -Encoding UTF8

@'
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private router: Router) {}
}
'@ | Set-Content src/app/app.ts -Encoding UTF8

@'
import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { DataSeedService } from './services/data-seed.service';

export function initializeApp(dataSeedService: DataSeedService) {
  return () => dataSeedService.seedAppData();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [DataSeedService]
    }
  ]
};
'@ | Set-Content src/app/app.config.ts -Encoding UTF8

@'
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
'@ | Set-Content src/main.ts -Encoding UTF8

@'
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="card">
        <h1>QA Shop</h1>
        <p>Inicia sesión para entrar a la tienda</p>

        <label for="username">Usuario</label>
        <input id="username" type="text" placeholder="Username" [(ngModel)]="username" />

        <label for="password">Contraseña</label>
        <input id="password" type="password" placeholder="Password" [(ngModel)]="password" />

        <button id="login-btn" (click)="login()">Ingresar</button>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

        <p class="link-text">¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>

        <div class="demo-box">
          <strong>Usuario demo:</strong> admin<br />
          <strong>Contraseña demo:</strong> 12345
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f172a,#1e293b);font-family:Arial,sans-serif;padding:24px}
    .card{width:100%;max-width:420px;background:#fff;border-radius:18px;padding:28px;box-shadow:0 12px 40px rgba(0,0,0,.22)}
    h1{margin:0 0 10px;color:#0f172a}
    p{color:#475569}
    label{display:block;margin:12px 0 6px;color:#0f172a;font-weight:700}
    input{width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:10px;outline:none;box-sizing:border-box}
    button{width:100%;margin-top:18px;padding:12px;border:none;border-radius:10px;background:#2563eb;color:#fff;font-weight:700;cursor:pointer}
    button:hover{background:#1d4ed8}
    .error{margin-top:12px;color:#dc2626;font-weight:700}
    .link-text{margin-top:16px;text-align:center}
    .demo-box{margin-top:18px;padding:12px;background:#eff6ff;border-radius:12px;color:#1e3a8a}
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errorMessage = '';

    const success = this.authService.login(this.username.trim(), this.password.trim());

    if (!success) {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
      return;
    }

    this.router.navigate(['/products']);
  }
}
'@ | Set-Content src/app/pages/login.component.ts -Encoding UTF8

@'
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="card">
        <h1>Crear cuenta</h1>
        <p>Registra un usuario local para la práctica QA</p>

        <label for="name">Nombre</label>
        <input id="name" type="text" [(ngModel)]="name" />

        <label for="register-username">Usuario</label>
        <input id="register-username" type="text" [(ngModel)]="username" />

        <label for="register-password">Contraseña</label>
        <input id="register-password" type="password" [(ngModel)]="password" />

        <button id="register-btn" (click)="register()">Registrar</button>

        <p class="message success" *ngIf="successMessage">{{ successMessage }}</p>
        <p class="message error" *ngIf="errorMessage">{{ errorMessage }}</p>

        <p class="link-text">¿Ya tienes cuenta? <a routerLink="/login">Volver al login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#14532d,#1f2937);font-family:Arial,sans-serif;padding:24px}
    .card{width:100%;max-width:420px;background:#fff;border-radius:18px;padding:28px;box-shadow:0 12px 40px rgba(0,0,0,.22)}
    h1{margin:0 0 10px;color:#14532d}
    p{color:#475569}
    label{display:block;margin:12px 0 6px;color:#0f172a;font-weight:700}
    input{width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:10px;outline:none;box-sizing:border-box}
    button{width:100%;margin-top:18px;padding:12px;border:none;border-radius:10px;background:#16a34a;color:#fff;font-weight:700;cursor:pointer}
    button:hover{background:#15803d}
    .message{margin-top:12px;font-weight:700}
    .success{color:#15803d}
    .error{color:#dc2626}
    .link-text{margin-top:16px;text-align:center}
  `]
})
export class RegisterComponent {
  name = '';
  username = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.name.trim() || !this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    const result = this.authService.register(
      this.name.trim(),
      this.username.trim(),
      this.password.trim()
    );

    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    this.successMessage = result.message;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
}
'@ | Set-Content src/app/pages/register.component.ts -Encoding UTF8

@'
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { Product } from '../shared/models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="page">
      <header class="topbar">
        <div>
          <h1>Tienda QA</h1>
          <p>Bienvenido, {{ currentUsername }}</p>
        </div>

        <div class="actions">
          <button id="view-cart-btn" class="secondary" (click)="goToCart()">Ver carrito</button>
          <button id="logout-btn" class="danger" (click)="logout()">Salir</button>
        </div>
      </header>

      <section class="grid">
        <article class="card" *ngFor="let product of products">
          <img [src]="product.image" [alt]="product.name" />
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <strong>{{ product.price | currency:'USD' }}</strong>
          <button [id]="'add-product-' + product.id" (click)="addProduct(product)">Agregar al carrito</button>
        </article>
      </section>

      <p class="message" *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .page{min-height:100vh;background:#f8fafc;font-family:Arial,sans-serif;padding:24px}
    .topbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;background:#fff;padding:20px;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,.08)}
    .topbar h1{margin:0;color:#0f172a}
    .topbar p{margin:6px 0 0;color:#475569}
    .actions{display:flex;gap:10px;flex-wrap:wrap}
    .actions button{padding:10px 14px;border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer}
    .secondary{background:#2563eb}
    .danger{background:#dc2626}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
    .card{background:#fff;border-radius:18px;padding:18px;box-shadow:0 8px 24px rgba(0,0,0,.08);display:flex;flex-direction:column}
    img{width:100%;height:180px;object-fit:cover;border-radius:14px;margin-bottom:12px}
    h2{margin:0 0 10px;color:#0f172a}
    p{flex:1;color:#475569}
    strong{display:block;margin:10px 0 14px;color:#16a34a;font-size:18px}
    .card button{padding:12px;border:none;border-radius:10px;background:#0f766e;color:#fff;font-weight:700;cursor:pointer}
    .message{margin-top:20px;color:#15803d;font-weight:700}
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  message = '';
  currentUsername = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.currentUsername = this.authService.getCurrentUsername();
  }

  addProduct(product: Product): void {
    this.cartService.addToCart(product);
    this.message = `${product.name} agregado al carrito.`;
    setTimeout(() => this.message = '', 1500);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
'@ | Set-Content src/app/pages/products.component.ts -Encoding UTF8

@'
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CartItem } from '../shared/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="page">
      <header class="topbar">
        <div>
          <h1>Carrito de compras</h1>
          <p>Revisa los productos agregados</p>
        </div>

        <div class="actions">
          <button id="back-products-btn" class="secondary" (click)="backToProducts()">Seguir comprando</button>
          <button id="clear-cart-btn" class="danger" (click)="clearCart()">Vaciar carrito</button>
        </div>
      </header>

      <section *ngIf="items.length > 0; else emptyCart">
        <div class="cart-item" *ngFor="let item of items; let i = index" [id]="'cart-item-' + item.productId">
          <div>
            <h2>{{ item.name }}</h2>
            <p>Cantidad: {{ item.quantity }}</p>
          </div>
          <strong>{{ (item.price * item.quantity) | currency:'USD' }}</strong>
        </div>

        <div class="total-box">
          Total:
          <span id="cart-total">{{ total | currency:'USD' }}</span>
        </div>
      </section>

      <ng-template #emptyCart>
        <div class="empty-box">
          <h2>El carrito está vacío</h2>
          <p>Agrega productos desde la tienda.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page{min-height:100vh;background:#f8fafc;font-family:Arial,sans-serif;padding:24px}
    .topbar{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;background:#fff;padding:20px;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,.08)}
    .topbar h1{margin:0;color:#0f172a}
    .topbar p{margin:6px 0 0;color:#475569}
    .actions{display:flex;gap:10px;flex-wrap:wrap}
    .actions button{padding:10px 14px;border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer}
    .secondary{background:#2563eb}
    .danger{background:#dc2626}
    .cart-item{display:flex;justify-content:space-between;align-items:center;background:#fff;padding:18px;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.08);margin-bottom:16px}
    .cart-item h2{margin:0 0 6px;color:#0f172a}
    .cart-item p{margin:0;color:#475569}
    .cart-item strong{color:#16a34a;font-size:18px}
    .total-box{margin-top:20px;background:#ecfeff;padding:18px;border-radius:16px;font-size:22px;font-weight:700;color:#0f172a}
    .empty-box{background:#fff;padding:26px;border-radius:18px;box-shadow:0 8px 24px rgba(0,0,0,.08)}
  `]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  backToProducts(): void {
    this.router.navigate(['/products']);
  }
}
'@ | Set-Content src/app/pages/cart.component.ts -Encoding UTF8

@'
[
  {
    "id": 1,
    "name": "Administrador",
    "username": "admin",
    "password": "12345"
  },
  {
    "id": 2,
    "name": "Edgar",
    "username": "edgar",
    "password": "12345"
  }
]
'@ | Set-Content src/assets/data/users.json -Encoding UTF8

@'
[
  {
    "id": 1,
    "name": "Mouse Gamer",
    "description": "Mouse ergonómico con seis botones para pruebas QA.",
    "price": 18.5,
    "image": "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200&auto=format&fit=crop"
  },
  {
    "id": 2,
    "name": "Teclado Mecánico",
    "description": "Teclado compacto ideal para trabajo y automatización.",
    "price": 32.99,
    "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1200&auto=format&fit=crop"
  },
  {
    "id": 3,
    "name": "Monitor 24 pulgadas",
    "description": "Pantalla Full HD para desarrollo y ejecución de pruebas.",
    "price": 120,
    "image": "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1200&auto=format&fit=crop"
  },
  {
    "id": 4,
    "name": "Audífonos",
    "description": "Accesorio adicional de catálogo para validar carrito.",
    "price": 24.75,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop"
  }
]
'@ | Set-Content src/assets/data/products.json -Encoding UTF8

Write-Host "==> Corrigiendo imports del router..."
(Get-Content src/app/app.routes.ts) -replace "import { LoginComponent } from './pages/login.component';", "import { LoginComponent } from './pages/login.component';" | Set-Content src/app/app.routes.ts -Encoding UTF8

Write-Host "==> Iniciando servidor..."
npm start

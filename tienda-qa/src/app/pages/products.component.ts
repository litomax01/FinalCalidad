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
        <div class="brand-box">
          <div class="logo">
            <img
              class="logo-image"
              [src]="getAssetSrc(logoBase)"
              alt="CafeyFlores"
              [attr.data-ext-index]="0"
              (error)="onAssetError($event, logoBase)"
            />
          </div>

          <div>
            <p class="brand-name">CafeyFlores</p>
            <h1>La esquina de la 24</h1>
          </div>
        </div>

        <div class="actions">
          <span class="user-chip">{{ currentUsername }}</span>

          <button class="admin-btn" (click)="goToAdminProducts()">Gestionar menú</button>

          <button id="view-cart-btn" class="secondary cart-btn" (click)="goToCart()">
            Ver carrito
            <span id="cart-count" class="cart-count" *ngIf="cartCount > 0">{{ cartCount }}</span>
          </button>

          <button id="logout-btn" class="danger" (click)="logout()">Cerrar sesión</button>
        </div>
      </header>

      <section class="hero">
        <div class="hero-text">
          <p class="section-tag">Menú destacado</p>
          <h2>Sabores tradicionales en un ambiente cálido</h2>
          <p>
            Explora el menú de CafeyFlores y agrega productos al carrito para
            simular una compra dentro del sistema.
          </p>
        </div>
        <div class="hero-badge">Desayunos, platos típicos y meriendas</div>
      </section>

      <section class="grid">
        <article
          class="card"
          *ngFor="let product of products"
          [class.card-added]="animatingProductId === product.id"
        >
          <div class="image-wrap">
            <img
              [src]="getAssetSrc(product.image)"
              [alt]="product.name"
              [attr.data-ext-index]="0"
              (error)="onAssetError($event, product.image)"
            />
          </div>

          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <strong>{{ product.price | currency:'USD' }}</strong>

          <button [id]="'add-product-' + product.id" (click)="addProduct(product)">
            Agregar al carrito
          </button>
        </article>
      </section>

      <p class="message" *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .page{
      min-height:100vh;
      background:linear-gradient(180deg,#fffaf0 0%,#fff4cc 100%);
      padding:24px;
    }
    .topbar{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:16px;
      flex-wrap:wrap;
      background:rgba(255,255,255,.88);
      backdrop-filter:blur(8px);
      padding:18px 22px;
      border-radius:24px;
      box-shadow:0 10px 28px rgba(99,72,0,.08);
      margin-bottom:24px;
    }
    .brand-box{
      display:flex;
      align-items:center;
      gap:14px;
    }
    .logo{
      width:64px;
      height:64px;
      border-radius:18px;
      background:linear-gradient(135deg,#ffe082,#ffd54f);
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 10px 20px rgba(212,169,11,.18);
      overflow:hidden;
      padding:6px;
    }
    .logo-image{
      width:100%;
      height:100%;
      object-fit:contain;
      border-radius:12px;
      background:#fff7dc;
    }
    .brand-name{
      margin:0;
      font-size:13px;
      text-transform:uppercase;
      letter-spacing:1px;
      color:#b18200;
      font-weight:700;
    }
    .topbar h1{
      margin:4px 0 0;
      font-size:28px;
      color:#4c3900;
    }
    .actions{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
    }
    .user-chip{
      padding:10px 14px;
      border-radius:999px;
      background:#fff3bf;
      color:#6d5207;
      font-weight:700;
    }
    .actions button{
      padding:12px 16px;
      border:none;
      border-radius:14px;
      color:#fff;
      font-weight:700;
      cursor:pointer;
      position:relative;
    }
    .admin-btn{
      background:#9c6f00;
    }
    .secondary{
      background:linear-gradient(90deg,#d4a90b,#f0bf1a);
    }
    .danger{
      background:#6d4c00;
    }
    .cart-btn{
      padding-right:46px;
    }
    .cart-count{
      position:absolute;
      top:-8px;
      right:-8px;
      min-width:24px;
      height:24px;
      padding:0 6px;
      border-radius:999px;
      background:#6d4c00;
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:12px;
      font-weight:700;
      box-shadow:0 6px 14px rgba(0,0,0,.18);
    }
    .hero{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:20px;
      flex-wrap:wrap;
      margin-bottom:24px;
      padding:28px;
      border-radius:28px;
      background:linear-gradient(135deg,#fff8dd,#ffe6a1);
      box-shadow:0 16px 40px rgba(99,72,0,.10);
    }
    .section-tag{
      margin:0 0 10px;
      text-transform:uppercase;
      font-size:12px;
      letter-spacing:1px;
      color:#b18200;
      font-weight:700;
    }
    .hero h2{
      margin:0 0 10px;
      font-size:34px;
      color:#4c3900;
    }
    .hero p{
      margin:0;
      color:#6d5a35;
      max-width:700px;
      line-height:1.6;
    }
    .hero-badge{
      padding:16px 18px;
      border-radius:18px;
      background:rgba(255,255,255,.7);
      color:#6d5207;
      font-weight:700;
    }
    .grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(255px,1fr));
      gap:22px;
    }
    .card{
      background:#fffdf7;
      border-radius:24px;
      padding:18px;
      box-shadow:0 16px 34px rgba(99,72,0,.08);
      display:flex;
      flex-direction:column;
      border:1px solid rgba(240,191,26,.18);
      transition:transform .25s ease, box-shadow .25s ease;
    }
    .card:hover{
      transform:translateY(-4px);
      box-shadow:0 20px 38px rgba(99,72,0,.12);
    }
    .card-added{
      animation:popAdd .55s ease;
    }
    @keyframes popAdd{
      0% { transform:scale(1); }
      35% { transform:scale(1.04); }
      70% { transform:scale(.985); }
      100% { transform:scale(1); }
    }
    .image-wrap{
      width:100%;
      height:190px;
      overflow:hidden;
      border-radius:18px;
      margin-bottom:18px;
      background:#f7eed0;
    }
    .image-wrap img{
      width:100%;
      height:100%;
      object-fit:cover;
    }
    .card h3{
      margin:0 0 10px;
      color:#4c3900;
      font-size:22px;
    }
    .card p{
      margin:0;
      flex:1;
      color:#6d5a35;
      line-height:1.55;
    }
    .card strong{
      display:block;
      margin:16px 0 14px;
      color:#b18200;
      font-size:22px;
    }
    .card button{
      padding:13px;
      border:none;
      border-radius:14px;
      background:linear-gradient(90deg,#d4a90b,#f0bf1a);
      color:#fff;
      font-weight:700;
      cursor:pointer;
      box-shadow:0 8px 16px rgba(212,169,11,.20);
    }
    .message{
      margin-top:20px;
      color:#6d5207;
      font-weight:700;
      background:#fff3bf;
      padding:12px 16px;
      border-radius:14px;
      display:inline-block;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  message = '';
  currentUsername = '';
  cartCount = 0;
  animatingProductId: number | null = null;
  logoBase = 'img/Logo';
  private readonly assetExtensions = ['png', 'jpg', 'jpeg', 'webp'];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.currentUsername = this.authService.getCurrentUsername();
    this.refreshCartCount();
  }

  refreshCartCount(): void {
    this.cartCount = this.cartService.getItemCount();
  }

  getAssetSrc(basePath: string, extIndex: number = 0): string {
    return `${basePath}.${this.assetExtensions[extIndex]}`;
  }

  onAssetError(event: Event, basePath: string): void {
    const img = event.target as HTMLImageElement;
    const currentIndex = Number(img.dataset['extIndex'] || '0');
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.assetExtensions.length) {
      img.dataset['extIndex'] = String(nextIndex);
      img.src = this.getAssetSrc(basePath, nextIndex);
      return;
    }

    img.style.display = 'none';
  }

  addProduct(product: Product): void {
    this.cartService.addToCart(product);
    this.refreshCartCount();

    this.animatingProductId = product.id;
    setTimeout(() => {
      this.animatingProductId = null;
    }, 550);

    this.message = `${product.name} agregado al carrito.`;
    setTimeout(() => this.message = '', 1500);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToAdminProducts(): void {
    this.router.navigate(['/admin-products']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

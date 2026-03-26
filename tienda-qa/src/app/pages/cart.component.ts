import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { CartItem, Product } from '../shared/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="page">
      <header class="topbar">
        <div>
          <p class="brand-name">CafeyFlores</p>
          <h1>Carrito de compras</h1>
          <p class="subtitle">Revisa tus productos antes de finalizar la simulación.</p>
        </div>

        <div class="actions">
          <button id="back-products-btn" class="secondary" (click)="backToProducts()">Seguir comprando</button>
          <button id="clear-cart-btn" class="warning" (click)="clearCart()">Vaciar carrito</button>
          <button id="logout-btn" class="danger" (click)="logout()">Cerrar sesión</button>
        </div>
      </header>

      <section *ngIf="items.length > 0; else emptyCart">
        <div class="cart-item" *ngFor="let item of items" [id]="'cart-item-' + item.productId">
          <div class="left">
            <div class="image-box">
              <img
                [src]="getAssetSrc(getItemImage(item))"
                [alt]="item.name"
                [attr.data-ext-index]="0"
                (error)="onAssetError($event, getItemImage(item))"
              />
            </div>

            <div class="info">
              <h2>{{ item.name }}</h2>
              <p>Cantidad: {{ item.quantity }}</p>
              <p>Subtotal: {{ (item.price * item.quantity) | currency:'USD' }}</p>

              <div class="item-actions">
                <button class="mini-btn secondary" (click)="increaseQuantity(item.productId)">+</button>
                <button class="mini-btn warning" (click)="decreaseQuantity(item.productId)">-</button>
                <button class="mini-btn danger" (click)="removeItem(item.productId)">Eliminar</button>
              </div>
            </div>
          </div>

          <strong>{{ (item.price * item.quantity) | currency:'USD' }}</strong>
        </div>

        <div class="total-box">
          <span>Total del pedido</span>
          <span id="cart-total">{{ total | currency:'USD' }}</span>
        </div>
      </section>

      <ng-template #emptyCart>
        <div class="empty-box">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos del menú para verlos aquí.</p>
          <button class="secondary empty-btn" (click)="backToProducts()">Ir al menú</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page{
      min-height:100vh;
      background:linear-gradient(180deg,#fffaf0 0%,#fff3c4 100%);
      padding:24px;
    }
    .topbar{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:16px;
      flex-wrap:wrap;
      background:#fffdf7;
      padding:24px;
      border-radius:24px;
      box-shadow:0 12px 30px rgba(99,72,0,.08);
      margin-bottom:24px;
    }
    .brand-name{
      margin:0 0 6px;
      font-size:13px;
      text-transform:uppercase;
      letter-spacing:1px;
      color:#b18200;
      font-weight:700;
    }
    .topbar h1{
      margin:0 0 6px;
      color:#4c3900;
      font-size:32px;
    }
    .subtitle{
      margin:0;
      color:#6d5a35;
    }
    .actions{
      display:flex;
      gap:10px;
      flex-wrap:wrap;
    }
    .actions button, .empty-btn{
      padding:12px 16px;
      border:none;
      border-radius:14px;
      color:#fff;
      font-weight:700;
      cursor:pointer;
    }
    .secondary{
      background:linear-gradient(90deg,#d4a90b,#f0bf1a);
    }
    .warning{
      background:#b18200;
    }
    .danger{
      background:#6d4c00;
    }
    .cart-item{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:20px;
      background:#fffdf7;
      padding:20px;
      border-radius:20px;
      box-shadow:0 12px 26px rgba(99,72,0,.07);
      margin-bottom:16px;
    }
    .left{
      display:flex;
      align-items:center;
      gap:16px;
      flex:1;
    }
    .image-box{
      width:96px;
      height:96px;
      border-radius:18px;
      overflow:hidden;
      background:#f7eed0;
      flex-shrink:0;
    }
    .image-box img{
      width:100%;
      height:100%;
      object-fit:cover;
    }
    .info h2{
      margin:0 0 6px;
      color:#4c3900;
    }
    .info p{
      margin:0 0 6px;
      color:#6d5a35;
    }
    .item-actions{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:10px;
    }
    .mini-btn{
      border:none;
      border-radius:10px;
      padding:8px 12px;
      color:#fff;
      font-weight:700;
      cursor:pointer;
    }
    .cart-item strong{
      color:#b18200;
      font-size:22px;
      white-space:nowrap;
    }
    .total-box{
      margin-top:18px;
      background:linear-gradient(90deg,#fff3bf,#ffe082);
      padding:20px 22px;
      border-radius:20px;
      display:flex;
      justify-content:space-between;
      align-items:center;
      font-size:24px;
      font-weight:700;
      color:#4c3900;
      box-shadow:0 12px 26px rgba(99,72,0,.08);
    }
    .empty-box{
      background:#fffdf7;
      border-radius:28px;
      padding:42px 24px;
      text-align:center;
      box-shadow:0 14px 30px rgba(99,72,0,.08);
    }
    .empty-box h2{
      margin:0 0 8px;
      color:#4c3900;
    }
    .empty-box p{
      margin:0 0 18px;
      color:#6d5a35;
    }
  `]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;
  private readonly assetExtensions = ['png', 'jpg', 'jpeg', 'webp'];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  getItemImage(item: CartItem): string {
    if (item.image) {
      return item.image;
    }

    const product = this.productService.getProducts().find((p: Product) => p.id === item.productId);
    return product ? product.image : 'img/Logo';
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

  increaseQuantity(productId: number): void {
    this.cartService.updateQuantity(productId, 1);
    this.loadCart();
  }

  decreaseQuantity(productId: number): void {
    this.cartService.updateQuantity(productId, -1);
    this.loadCart();
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  backToProducts(): void {
    this.router.navigate(['/products']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

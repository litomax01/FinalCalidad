import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Product } from '../shared/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="page">
      <header class="topbar">
        <div>
          <p class="brand-name">CafeyFlores</p>
          <h1>CRUD de productos</h1>
          <p class="subtitle">Crea, edita y elimina productos del menú.</p>
        </div>

        <div class="actions">
          <button class="secondary" (click)="backToProducts()">Volver al menú</button>
          <button class="danger" (click)="logout()">Cerrar sesión</button>
        </div>
      </header>

      <section class="layout">
        <div class="form-card">
          <h2>{{ editMode ? 'Editar producto' : 'Nuevo producto' }}</h2>

          <label>Nombre</label>
          <input type="text" [(ngModel)]="formData.name" />

          <label>Descripción</label>
          <textarea rows="4" [(ngModel)]="formData.description"></textarea>

          <label>Precio</label>
          <input type="number" step="0.01" [(ngModel)]="formData.price" />

          <label>Imagen</label>
          <input type="text" [(ngModel)]="formData.image" placeholder="Ejemplo: img/Bolon" />

          <div class="form-actions">
            <button class="save-btn" (click)="saveProduct()">
              {{ editMode ? 'Actualizar' : 'Guardar' }}
            </button>
            <button class="cancel-btn" *ngIf="editMode" (click)="resetForm()">Cancelar</button>
          </div>
        </div>

        <div class="list-card">
          <h2>Productos actuales</h2>

          <div class="product-row" *ngFor="let product of products">
            <div class="preview">
              <img
                [src]="getAssetSrc(product.image)"
                [alt]="product.name"
                [attr.data-ext-index]="0"
                (error)="onAssetError($event, product.image)"
              />
            </div>

            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <strong>{{ product.price | currency:'USD' }}</strong>
            </div>

            <div class="row-actions">
              <button class="edit-btn" (click)="editProduct(product)">Editar</button>
              <button class="delete-btn" (click)="deleteProduct(product.id)">Eliminar</button>
            </div>
          </div>
        </div>
      </section>
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
    .actions button{
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
    .danger{
      background:#6d4c00;
    }
    .layout{
      display:grid;
      grid-template-columns:380px 1fr;
      gap:24px;
      align-items:start;
    }
    .form-card, .list-card{
      background:#fffdf7;
      border-radius:24px;
      padding:24px;
      box-shadow:0 12px 30px rgba(99,72,0,.08);
    }
    .form-card h2, .list-card h2{
      margin-top:0;
      color:#4c3900;
    }
    label{
      display:block;
      margin:14px 0 8px;
      font-weight:700;
      color:#5e4700;
    }
    input, textarea{
      width:100%;
      padding:12px 14px;
      border-radius:12px;
      border:1px solid #ead38b;
      background:#fffdfa;
      outline:none;
      resize:none;
    }
    .form-actions{
      display:flex;
      gap:10px;
      margin-top:18px;
    }
    .save-btn, .cancel-btn, .edit-btn, .delete-btn{
      border:none;
      border-radius:12px;
      padding:10px 14px;
      color:#fff;
      font-weight:700;
      cursor:pointer;
    }
    .save-btn, .edit-btn{
      background:#b18200;
    }
    .cancel-btn{
      background:#6d4c00;
    }
    .delete-btn{
      background:#8b1e1e;
    }
    .product-row{
      display:grid;
      grid-template-columns:110px 1fr auto;
      gap:16px;
      align-items:center;
      padding:16px 0;
      border-bottom:1px solid #f1e2ad;
    }
    .preview{
      width:110px;
      height:90px;
      border-radius:14px;
      overflow:hidden;
      background:#f7eed0;
    }
    .preview img{
      width:100%;
      height:100%;
      object-fit:cover;
    }
    .product-info h3{
      margin:0 0 6px;
      color:#4c3900;
    }
    .product-info p{
      margin:0 0 6px;
      color:#6d5a35;
    }
    .product-info strong{
      color:#b18200;
    }
    .row-actions{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
    }
    @media (max-width: 980px){
      .layout{
        grid-template-columns:1fr;
      }
      .product-row{
        grid-template-columns:1fr;
      }
    }
  `]
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  editMode = false;
  editId: number | null = null;
  private readonly assetExtensions = ['png', 'jpg', 'jpeg', 'webp'];

  formData = {
    name: '',
    description: '',
    price: 0,
    image: ''
  };

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products = this.productService.getProducts();
  }

  saveProduct(): void {
    if (
      !this.formData.name.trim() ||
      !this.formData.description.trim() ||
      !this.formData.image.trim() ||
      this.formData.price <= 0
    ) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    if (this.editMode && this.editId !== null) {
      this.productService.updateProduct({
        id: this.editId,
        name: this.formData.name.trim(),
        description: this.formData.description.trim(),
        price: Number(this.formData.price),
        image: this.formData.image.trim()
      });
    } else {
      this.productService.addProduct({
        name: this.formData.name.trim(),
        description: this.formData.description.trim(),
        price: Number(this.formData.price),
        image: this.formData.image.trim()
      });
    }

    this.resetForm();
    this.loadProducts();
  }

  editProduct(product: Product): void {
    this.editMode = true;
    this.editId = product.id;
    this.formData = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image
    };
  }

  deleteProduct(productId: number): void {
    if (!confirm('¿Deseas eliminar este producto?')) {
      return;
    }

    this.productService.deleteProduct(productId);
    this.loadProducts();

    if (this.editId === productId) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.editMode = false;
    this.editId = null;
    this.formData = {
      name: '',
      description: '',
      price: 0,
      image: ''
    };
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

  backToProducts(): void {
    this.router.navigate(['/products']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

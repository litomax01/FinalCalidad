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
      if (!existingItem.image) {
        existingItem.image = product.image;
      }
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });
    }

    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }

  updateQuantity(productId: number, change: number): void {
    const items = this.getItems();
    const item = items.find(i => i.productId === productId);

    if (!item) {
      return;
    }

    item.quantity += change;

    const filtered = items.filter(i => i.quantity > 0);
    localStorage.setItem(this.cartKey, JSON.stringify(filtered));
  }

  removeItem(productId: number): void {
    const items = this.getItems().filter(item => item.productId !== productId);
    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }

  clearCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify([]));
  }

  getTotal(): number {
    return this.getItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  getItemCount(): number {
    return this.getItems().reduce((acc, item) => acc + item.quantity, 0);
  }
}

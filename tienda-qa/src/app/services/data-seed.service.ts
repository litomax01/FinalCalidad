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
      const users = await firstValueFrom(this.http.get<User[]>('assets/data/users.json'));
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    if (!localStorage.getItem(this.productsKey)) {
      const products = await firstValueFrom(this.http.get<Product[]>('assets/data/products.json'));
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

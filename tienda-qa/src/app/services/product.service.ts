import { Injectable } from '@angular/core';
import { Product } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsKey = 'qa_products';
  private readonly productsVersionKey = 'qa_products_version';
  private readonly currentVersion = 'cafeyflores_local_images_v5';

  private readonly defaultProducts: Product[] = [
    {
      id: 1,
      name: 'Bolón',
      description: 'Bolón tradicional, ideal para un desayuno fuerte y casero.',
      price: 2.75,
      image: 'img/Bolon'
    },
    {
      id: 2,
      name: 'Caucara',
      description: 'Preparación tradicional servida al estilo de la casa.',
      price: 3.25,
      image: 'img/Caucara'
    },
    {
      id: 3,
      name: 'Humita',
      description: 'Humita suave y artesanal, perfecta para acompañar una bebida caliente.',
      price: 2.00,
      image: 'img/Humita'
    },
    {
      id: 4,
      name: 'Quimbolito',
      description: 'Quimbolito tradicional, esponjoso y con sabor casero.',
      price: 1.75,
      image: 'img/Quimbolito'
    },
    {
      id: 5,
      name: 'Seco de Pollo',
      description: 'Plato fuerte con sabor tradicional y presentación casera.',
      price: 5.50,
      image: 'img/SecoDePollo'
    },
    {
      id: 6,
      name: 'Tigrillo',
      description: 'Tigrillo preparado al estilo tradicional, ideal para desayuno o merienda.',
      price: 3.75,
      image: 'img/Tigrillo'
    },
    {
      id: 7,
      name: 'Tortilla de Verde',
      description: 'Tortilla de verde dorada y suave, perfecta para acompañar el café.',
      price: 2.50,
      image: 'img/TortillaDeVerde'
    }
  ];

  getProducts(): Product[] {
    const savedProducts = localStorage.getItem(this.productsKey);
    const savedVersion = localStorage.getItem(this.productsVersionKey);

    if (!savedProducts || savedVersion !== this.currentVersion) {
      localStorage.setItem(this.productsKey, JSON.stringify(this.defaultProducts));
      localStorage.setItem(this.productsVersionKey, this.currentVersion);
      return this.defaultProducts;
    }

    return JSON.parse(savedProducts);
  }

  addProduct(productData: Omit<Product, 'id'>): void {
    const products = this.getProducts();
    const newProduct: Product = {
      id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...productData
    };

    products.push(newProduct);
    localStorage.setItem(this.productsKey, JSON.stringify(products));
  }

  updateProduct(updatedProduct: Product): void {
    const products = this.getProducts().map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    );

    localStorage.setItem(this.productsKey, JSON.stringify(products));
  }

  deleteProduct(productId: number): void {
    const products = this.getProducts().filter(product => product.id !== productId);
    localStorage.setItem(this.productsKey, JSON.stringify(products));
  }
}

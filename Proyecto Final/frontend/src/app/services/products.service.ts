import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductPayload } from '../models/product.model';
import { AuthService } from './auth.service';

type ProductsApiResponse =
  | Product[]
  | {
      products?: Product[];
      data?: Product[];
      [key: string]: unknown;
    };

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly apiUrl = '/api/products';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getProducts(): Observable<Product[]> {
    const headers = this.getHeaders();

    return this.http.get<ProductsApiResponse>(this.apiUrl, { headers }).pipe(
      map((response) => this.normalizeProductsResponse(response)),
      catchError((error) => {
        // Fallback para cuando el proxy de Angular no enruta /api.
        if (error?.status === 0 || error?.status === 404) {
          return this.http
            .get<ProductsApiResponse>(`http://localhost:5000${this.apiUrl}`, { headers })
            .pipe(map((response) => this.normalizeProductsResponse(response)));
        }

        return throwError(() => error);
      })
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, payload, {
      headers: this.getHeaders()
    });
  }

  updateProduct(id: string, payload: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, payload, {
      headers: this.getHeaders()
    });
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });
  }

  private normalizeProductsResponse(response: ProductsApiResponse): Product[] {
    if (Array.isArray(response)) {
      return response.map((product) => this.normalizeProduct(product));
    }

    const wrappedProducts = response?.products ?? response?.data;
    if (Array.isArray(wrappedProducts)) {
      return wrappedProducts.map((product) => this.normalizeProduct(product));
    }

    return [];
  }

  private normalizeProduct(product: Partial<Product>): Product {
    return {
      _id: String(product._id ?? ''),
      nombre: product.nombre ?? '',
      descripcion: product.descripcion ?? '',
      categoria: product.categoria ?? '',
      precio: Number(product.precio ?? 0),
      talla: product.talla ?? '',
      color: product.color ?? '',
      stock: Number(product.stock ?? 0),
      usuario: String(product.usuario ?? ''),
      createdAt: product.createdAt ?? '',
      updatedAt: product.updatedAt ?? ''
    };
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Product,
  ProductPayload,
  ProductQueryParams,
  ProductsListResponse
} from '../models/product.model';
import { AuthService } from './auth.service';

type ProductsApiResponse =
  | Product[]
  | {
      products?: Product[];
      data?: Product[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
      filters?: {
        categoria: string | null;
        status: string | null;
        search: string | null;
        minPrice: string | null;
        maxPrice: string | null;
      };
      [key: string]: unknown;
    };

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly apiUrl = '/api/products';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getProducts(query: ProductQueryParams = {}): Observable<ProductsListResponse> {
    const headers = this.getHeaders();
    const params = this.buildQueryParams(query);

    return this.http.get<ProductsApiResponse>(this.apiUrl, { headers, params }).pipe(
      map((response) => this.normalizeProductsResponse(response)),
      catchError((error) => {
        // Fallback para cuando el proxy de Angular no enruta /api.
        if (error?.status === 0 || error?.status === 404) {
          return this.http
            .get<ProductsApiResponse>(`http://localhost:5000${this.apiUrl}`, { headers, params })
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

  private normalizeProductsResponse(response: ProductsApiResponse): ProductsListResponse {
    const paginationFallback = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    };
    const filtersFallback = {
      categoria: null,
      status: null,
      search: null,
      minPrice: null,
      maxPrice: null
    };

    if (Array.isArray(response)) {
      return {
        data: response.map((product) => this.normalizeProduct(product)),
        pagination: {
          ...paginationFallback,
          total: response.length
        },
        filters: filtersFallback
      };
    }

    const wrappedProducts = response?.products ?? response?.data;
    if (Array.isArray(wrappedProducts)) {
      return {
        data: wrappedProducts.map((product) => this.normalizeProduct(product)),
        pagination: (response.pagination as ProductsListResponse['pagination']) ?? {
          ...paginationFallback,
          total: wrappedProducts.length
        },
        filters: (response.filters as ProductsListResponse['filters']) ?? filtersFallback
      };
    }

    return {
      data: [],
      pagination: paginationFallback,
      filters: filtersFallback
    };
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
      status: (product.status as 'active' | 'inactive') ?? 'active',
      usuario: String(product.usuario ?? ''),
      createdAt: product.createdAt ?? '',
      updatedAt: product.updatedAt ?? ''
    };
  }

  private buildQueryParams(query: ProductQueryParams): HttpParams {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }
}

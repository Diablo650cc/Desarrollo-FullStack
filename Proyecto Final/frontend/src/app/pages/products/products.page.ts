import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, retry, timeout } from 'rxjs/operators';
import { Product, ProductPayload } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.page.html',
  styleUrl: './products.page.css'
})
export class ProductsPage implements OnInit {
  private readonly productsCacheKey = 'productsCache';
  private readonly autoRefreshMs = 5000;
  private refreshIntervalId: ReturnType<typeof setInterval> | null = null;
  private requestInFlight = false;

  products: Product[] = [];
  userEmail = '';
  currentProductId: string | null = null;
  loading = false;
  loadError = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  readonly categories = [
    'Cascos',
    'Chaquetas',
    'Guantes',
    'Botas',
    'Accesorios',
    'Electronica',
    'Otro'
  ];

  form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      categoria: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0)]],
      talla: [''],
      color: [''],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userEmail = this.authService.getUserEmail();
    this.hydrateProductsFromCache();
    this.loadProducts();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadProducts(showLoader = true): void {
    if (this.requestInFlight) {
      return;
    }

    this.requestInFlight = true;
    if (showLoader) {
      this.loading = true;
    }
    this.loadError = false;
    this.productsService
      .getProducts()
      .pipe(
        timeout(20000),
        retry({ count: 2, delay: 800 }),
        finalize(() => {
          this.requestInFlight = false;
          if (showLoader) {
            this.loading = false;
          }
        })
      )
      .subscribe({
        next: (products) => {
          this.products = products;
          this.loadError = false;
          this.persistProductsCache(products);
        },
        error: (error) => {
          this.loadError = this.products.length === 0;
          if (error?.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
            return;
          }
          this.showMessage(
            error?.name === 'TimeoutError'
              ? 'La carga de productos tardo demasiado. Se mantienen los ultimos datos visibles.'
              : 'Error al cargar productos',
            'error'
          );
        }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as ProductPayload;

    const request$ = this.currentProductId
      ? this.productsService.updateProduct(this.currentProductId, payload)
      : this.productsService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.showMessage(
          this.currentProductId ? 'Producto actualizado' : 'Producto creado',
          'success'
        );
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        this.showMessage(error?.error?.message ?? 'No se pudo guardar', 'error');
      }
    });
  }

  editProduct(product: Product): void {
    this.currentProductId = product._id;
    this.form.patchValue({
      nombre: product.nombre,
      descripcion: product.descripcion ?? '',
      categoria: product.categoria,
      precio: product.precio,
      talla: product.talla ?? '',
      color: product.color ?? '',
      stock: product.stock
    });
    this.showMessage('Editando producto', 'success');
  }

  deleteProduct(product: Product): void {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.nombre}"?`
    );
    if (!confirmed) {
      return;
    }

    this.productsService.deleteProduct(product._id).subscribe({
      next: () => {
        this.showMessage('Producto eliminado', 'success');
        this.loadProducts();
      },
      error: () => {
        this.showMessage('No se pudo eliminar el producto', 'error');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToAdministration(): void {
    this.router.navigate(['/admin/users']);
  }

  resetForm(): void {
    this.currentProductId = null;
    this.form.reset({
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: 0,
      talla: '',
      color: '',
      stock: 0
    });
  }

  trackById(_: number, product: Product): string {
    return product._id;
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  private persistProductsCache(products: Product[]): void {
    try {
      localStorage.setItem(this.productsCacheKey, JSON.stringify(products));
    } catch {
      // Ignorar errores de almacenamiento local.
    }
  }

  private hydrateProductsFromCache(): void {
    try {
      const raw = localStorage.getItem(this.productsCacheKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed)) {
        this.products = parsed;
      }
    } catch {
      this.products = [];
    }
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.refreshIntervalId = setInterval(() => {
      this.loadProducts(false);
    }, this.autoRefreshMs);
  }

  private stopAutoRefresh(): void {
    if (!this.refreshIntervalId) {
      return;
    }

    clearInterval(this.refreshIntervalId);
    this.refreshIntervalId = null;
  }
}

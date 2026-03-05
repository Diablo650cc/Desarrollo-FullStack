export interface Product {
  _id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio: number;
  talla?: string;
  color?: string;
  stock: number;
  status: 'active' | 'inactive';
  usuario: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  talla: string;
  color: string;
  stock: number;
  status?: 'active' | 'inactive';
}

export interface ProductsListResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categoria: string | null;
    status: string | null;
    search: string | null;
    minPrice: string | null;
    maxPrice: string | null;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  categoria?: string;
  status?: 'active' | 'inactive';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

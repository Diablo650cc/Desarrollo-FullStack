export interface Product {
  _id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precio: number;
  talla?: string;
  color?: string;
  stock: number;
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
}

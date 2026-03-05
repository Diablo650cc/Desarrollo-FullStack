# 📚 Documentación de API REST

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Autenticación

Todos los endpoints protegidos requieren enviar el token JWT en el header:
```
Authorization: Bearer {token}
```

Tipos de token:
- **Public:** Sin autenticación
- **Protected:** Requiere usuario autenticado
- **Admin Only:** Solo usuarios con rol admin

---

## 👤 Endpoints de Usuarios

### 1. Registro (Public)
```http
POST /usuarios/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario registrado correctamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario"
  }
}
```

**Errores:**
- `400`: Email ya registrado
- `400`: Validación de campos fallida

---

### 2. Login (Public)
```http
POST /usuarios/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Respuesta (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario"
  }
}
```

**Errores:**
- `401`: Credenciales incorrectas

---

### 3. Obtener Perfil (Protected)
```http
GET /usuarios/perfil
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "message": "Perfil obtenido correctamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario",
    "created_at": "2026-03-05T10:30:00.000Z"
  }
}
```

---

### 4. Actualizar Perfil (Protected)
```http
PUT /usuarios/perfil
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "email": "juan.carlos@example.com"
}
```

**Respuesta (200):**
```json
{
  "message": "Perfil actualizado correctamente"
}
```

**Errores:**
- `400`: Email ya registrado
- `400`: No hay campos para actualizar

---

### 5. Listar Usuarios (Protected - Admin Only)
```http
GET /usuarios?page=1&limit=10&search=juan
Authorization: Bearer {token}
```

**Query Parameters:**
| Parámetro | Tipo | Default | Máximo | Descripción |
|-----------|------|---------|--------|-------------|
| page | number | 1 | - | Número de página |
| limit | number | 10 | 100 | Usuarios por página |
| search | string | - | 100 | Búsqueda por nombre/email |

**Respuesta (200):**
```json
{
  "message": "Usuarios obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "usuario",
      "created_at": "2026-03-05T10:30:00.000Z"
    }
  ],
  "paginacion": {
    "total": 42,
    "pagina": 1,
    "limite": 10,
    "totalPaginas": 5
  }
}
```

---

### 6. Obtener Usuario por ID (Protected)
```http
GET /usuarios/:id
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "message": "Usuario obtenido correctamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "usuario",
    "created_at": "2026-03-05T10:30:00.000Z"
  }
}
```

**Restricciones:**
- Usuario regular: Solo puede ver su propio perfil
- Admin: Puede ver cualquier perfil

---

### 7. Crear Usuario (Protected - Admin Only)
```http
POST /usuarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "María García",
  "email": "maria@example.com",
  "password": "Password456",
  "rol": "usuario"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario creado correctamente",
  "data": {
    "id": 2,
    "nombre": "María García",
    "email": "maria@example.com",
    "rol": "usuario"
  }
}
```

---

### 8. Actualizar Usuario (Protected - Admin Only)
```http
PUT /usuarios/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "María García López",
  "email": "maria.garcia@example.com",
  "rol": "admin"
}
```

**Respuesta (200):**
```json
{
  "message": "Usuario actualizado correctamente"
}
```

---

### 9. Eliminar Usuario (Protected - Admin Only)
```http
DELETE /usuarios/:id
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

**Restricciones:**
- No puede eliminar su propia cuenta por este endpoint
- Solo admin

---

## 💳 Endpoints de Pagos

### 1. Procesar Pago (Protected)
```http
POST /pagos/procesar
Authorization: Bearer {token}
Content-Type: application/json

{
  "monto": 50.00,
  "moneda": "USD",
  "descripcion": "Compra de servicios premium"
}
```

**Validaciones:**
- Monto: 0.50 - 10000
- Moneda: USD, ARS, MXN
- Descripción: 3-255 caracteres

**Respuesta (201):**
```json
{
  "message": "Pago procesado exitosamente",
  "pago": {
    "id": 1,
    "idTransaccion": "PAY_1709644200000_1",
    "monto": 50.00,
    "moneda": "USD",
    "estado": "completado",
    "timestamp": "2026-03-05T10:30:00.000Z"
  }
}
```

**Errores:**
- `400`: Monto inválido
- `400`: Moneda no soportada
- `400`: Error al procesar pago

---

### 2. Obtener Historial de Pagos (Protected)
```http
GET /pagos?page=1&limit=10
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "message": "Pagos obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "usuario_id": 1,
      "monto": 50.00,
      "moneda": "USD",
      "descripcion": "Compra de servicios",
      "estado": "completado",
      "created_at": "2026-03-05T10:30:00.000Z"
    }
  ],
  "paginacion": {
    "total": 5,
    "pagina": 1,
    "limite": 10,
    "totalPaginas": 1
  }
}
```

**Restricciones:**
- Usuario regular: Solo ve sus propios pagos
- Admin: Ve todos los pagos

---

### 3. Obtener Detalles de Pago (Protected)
```http
GET /pagos/:id
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "message": "Pago obtenido correctamente",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "monto": 50.00,
    "moneda": "USD",
    "descripcion": "Compra de servicios",
    "id_transaccion": "PAY_1709644200000_1",
    "estado": "completado",
    "created_at": "2026-03-05T10:30:00.000Z"
  }
}
```

---

## 💱 Endpoints de APIs Externas

### 1. Obtener Precio del Dólar (Public)
```http
GET /external/dolar
```

**Respuesta (200):**
```json
{
  "message": "Precio del dólar obtenido correctamente",
  "data": {
    "usd": 1,
    "ars": 850.50,
    "mxn": 17.20,
    "tasas": {
      "usdToArs": 850.50,
      "usdToMxn": 17.20
    },
    "actualizadoEn": "2026-03-05T15:45:00.000Z",
    "fuente": "exchangerate-api.com"
  }
}
```

---

### 2. Convertir Moneda (Public)
```http
GET /external/dolar/convertir?cantidad=100&towards=ARS
```

**Query Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| cantidad | number | Sí | Cantidad en USD |
| towards | string | Sí | Moneda destino (ARS, MXN) |

**Respuesta (200):**
```json
{
  "message": "Conversión realizada correctamente",
  "data": {
    "original": {
      "cantidad": 100,
      "moneda": "USD"
    },
    "convertido": {
      "cantidad": "85050.00",
      "moneda": "ARS"
    },
    "tasa": "850.50",
    "actualizadoEn": "2026-03-05T15:45:00.000Z"
  }
}
```

---

### 3. Verificar Estado de APIs (Protected)
```http
GET /external/health
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "message": "Estado de APIs externas",
  "apis": {
    "exchangeRate": {
      "estado": "operativo",
      "ultimaActualizacion": "2026-03-05T15:45:00.000Z",
      "error": null
    },
    "stripe": {
      "estado": "configurado",
      "modo": "test"
    }
  },
  "timestamp": "2026-03-05T15:50:00.000Z"
}
```

---

## 🔍 Códigos de Error

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos o validación fallida |
| 401 | Unauthorized | Token no válido o ausente |
| 403 | Forbidden | No tienes permisos para acceder |
| 404 | Not Found | Recurso no encontrado |
| 500 | Server Error | Error del servidor |

---

## 📋 Códigos de Estado de Pago

| Estado | Descripción |
|--------|------------|
| pendiente | Pago en proceso |
| completado | Pago realizado exitosamente |
| fallido | Error en el procesamiento |
| cancelado | Pago cancelado por el usuario |

---

## 🔑 Validación de Contraseña

La contraseña debe cumplir:
- ✅ Mínimo 6 caracteres
- ✅ Al menos 1 mayúscula
- ✅ Al menos 1 minúscula
- ✅ Al menos 1 número

Ejemplo válido: `Password123`

---

## 💡 Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'
```

### Obtener Usuarios (con token)
```bash
curl -X GET http://localhost:3000/api/usuarios?page=1&limit=5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Procesar Pago
```bash
curl -X POST http://localhost:3000/api/pagos/procesar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{"monto":100,"moneda":"USD","descripcion":"Compra"}'
```

---

## 📞 Support
Para más información, consulta el README.md o contacta al equipo de desarrollo.

# 🧪 Pruebas de API - Ejemplos cURL

## Configuración Base
```bash
API_URL=http://localhost:5000/api
```

## 1. AUTENTICACIÓN

### Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "message": "Usuario registrado correctamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com"
  }
}
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

## 2. PRODUCTOS

### Crear Producto
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nombre": "Casco Deportivo",
    "categoria": "Cascos",
    "descripcion": "Casco de motociclismo profesional",
    "precio": 150.99,
    "talla": "M",
    "color": "Negro",
    "stock": 10
  }'
```

### Obtener Todos los Productos
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Obtener un Producto Específico
```bash
curl -X GET http://localhost:5000/api/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Actualizar Producto
```bash
curl -X PUT http://localhost:5000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nombre": "Casco Deportivo Premium",
    "precio": 180.50,
    "stock": 15
  }'
```

### Eliminar Producto
```bash
curl -X DELETE http://localhost:5000/api/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. IMPORTAR EN POSTMAN

### 1. Crear Colección
- Abre Postman
- Haz clic en "+" para nueva colección
- Llámala "MotoGear API"

### 2. Agregar Requests

#### REQUEST 1: Registro
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

#### REQUEST 2: Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```
**Copia el token de la respuesta**

#### REQUEST 3: Crear Producto
```
POST http://localhost:5000/api/products
Headers:
  Authorization: Bearer <TOKEN>
Body (JSON):
{
  "nombre": "Casco Deportivo",
  "categoria": "Cascos",
  "precio": 150,
  "talla": "M",
  "color": "Negro",
  "stock": 10
}
```

#### REQUEST 4: Listar Productos
```
GET http://localhost:5000/api/products
Headers:
  Authorization: Bearer <TOKEN>
```

#### REQUEST 5: Actualizar Producto
```
PUT http://localhost:5000/api/products/<PRODUCT_ID>
Headers:
  Authorization: Bearer <TOKEN>
Body (JSON):
{
  "nombre": "Casco Premium",
  "precio": 200,
  "stock": 20
}
```

#### REQUEST 6: Eliminar Producto
```
DELETE http://localhost:5000/api/products/<PRODUCT_ID>
Headers:
  Authorization: Bearer <TOKEN>
```

## 4. USAR VARIABLES EN POSTMAN

### Variable: token
```javascript
// En el tab "Tests" de Login response:
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

### Variable: product_id
```javascript
// En el tab "Tests" de Create product:
var jsonData = pm.response.json();
pm.environment.set("product_id", jsonData._id);
```

### Usar en Headers
```
Authorization: Bearer {{token}}
```

### Usar en URLs
```
PUT http://localhost:5000/api/products/{{product_id}}
```

## 5. ERRORES COMUNES ET SOLUCIONES

### 401 Unauthorized
```
❌ Error: Token no proporcionado
✅ Solución: Agrega el header Authorization: Bearer <TOKEN>
```

### 404 Not Found
```
❌ Error: Producto no encontrado
✅ Solución: Verifica el product_id en la URL
```

### 400 Bad Request
```
❌ Error: Campos requeridos faltantes
✅ Solución: Verifica que incluyas nombre, categoria y precio
```

### 500 Internal Server Error
```
❌ Error: Error en el servidor
✅ Solución: Verifica que MongoDB está corriendo
```

## 6. CATEGORÍAS VÁLIDAS

```
- Cascos
- Guantes
- Chaquetas
- Botas
- Accesorios
- Motos
```

## 7. ESTRUCTURA DE RESPUESTA

### Producto
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Casco Deportivo",
  "descripcion": "Descripción",
  "categoria": "Cascos",
  "precio": 150.99,
  "talla": "M",
  "color": "Negro",
  "stock": 10,
  "usuario": "507f1f77bcf86cd799439012",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## 8. OBTENER TOKEN RÁPIDAMENTE

```bash
# Paso 1: Registrarse
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test'$(date +%s)'@example.com", "password": "password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4
```

## ✅ FLUJO COMPLETO DE PRUEBA

1. **Registrarse** → Obtienes un token
2. **Crear Producto** → Usas el token
3. **Listar Productos** → Ves el producto creado
4. **Actualizar** → Modifica el producto
5. **Eliminar** → Borra el producto
6. **Listar** → Confirma que fue eliminado

¡Listo para probar la API!

# Frontend - Product Management Dashboard

Aplicación web moderna para la gestión de productos con autenticación JWT, interfaz responsive y tema oscuro.

## 📄 Archivos

```
frontend/
├── login.html      # Página de login
├── register.html   # Página de registro
└── products.html   # Dashboard de productos (⭐ PRINCIPAL)
```

## 🌐 Rutas

- `/login.html` - Iniciar sesión → Redirige a `/products.html`
- `/register.html` - Crear cuenta → Redirige a `/login.html`
- `/products.html` - Dashboard completo (protegido con JWT)

## 🚀 Inicio Rápido

1. Iniciar backend (ver [backend/README.md](../backend/README.md))
2. Abrir en navegador: `http://localhost:5000`
3. Se redirige automáticamente a `/login.html`

## 🎨 Interfaz

### Página de Login (`login.html`)
- Email y contraseña
- Botón "Iniciar Sesión"
- Botón "Registrarse" (redirige a register.html)
- Almacena token en localStorage
- Redirige a products.html si login exitoso

### Página de Registro (`register.html`)
- Email y contraseña
- Validación de formato de email
- Botón "Registrarse"
- Redirige a login.html si registro exitoso
- Muestra errores en alerta

### Dashboard de Productos (`products.html`)
Principal página de la aplicación con funcionalidades completas.

#### Componentes:
1. **Navbar**
   - Logo/Título
   - Botón de logout
   - Usuario actual

2. **Statistics Panel**
   - Total productos
   - Stock total
   - Valor del inventario
   - Precio promedio

3. **Filter Tabs**
   - Vista: Todos
   - Categorías (Electrónica, Ropa, Hogar, etc.)

4. **Search/Add Form**
   - Barra de búsqueda
   - Botón "Agregar Producto"

5. **Product Cards**
   - Imagen placeholder
   - Nombre, descripción
   - Categoría, precio
   - Talla, color, stock
   - Botones editar/eliminar

6. **Modals**
   - Modal de creación/edición
   - Modal de confirmación de eliminación

## 💾 LocalStorage

```javascript
// Token JWT guardado automaticamente
localStorage.getItem('authToken')

// Usado en header de cada request
Authorization: Bearer {token}
```

## 📡 API Integration

### Endpoints utilizados:

```javascript
// Autenticación
POST /api/auth/register
POST /api/auth/login

// Productos (con token)
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## 🛠️ Desarrollo

### Variables en Frontend

```javascript
const API_URL = 'http://localhost:5000/api';
```

### Funciones Principales

```javascript
// Autenticación
async function register(email, password)
async function login(email, password)
function logout()
function isLoggedIn()

// Productos
async function fetchProducts()
async function createProduct(productData)
async function updateProduct(id, productData)
async function deleteProduct(id)

// UI
function loadProducts()
function renderProducts(products)
function openModal()
function closeModal()
function updateStats()
```

## 🔒 Seguridad

- ✅ Token almacenado en localStorage
- ✅ Validación en cliente
- ✅ CORS configurado en backend
- ✅ JWT validation en servidor
- ✅ Logout limpia localStorage

## 📱 Responsivo

Pantallas soportadas:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🎯 CSS Personalizado

- Tema oscuro moderno
- Variables CSS para colores
- Flexbox/Grid layout
- Animaciones suaves
- Estados hover/active

## 🧪 Testing Manual

### Flujo de Login
1. Ir a `/login.html`
2. Ingresar email y contraseña
3. Verificar que se guarda token en localStorage
4. Verificar redirect a `/products.html`

### Flujo de Registro
1. Ir a `/register.html`
2. Ingresar email y contraseña
3. Verificar mensaje de éxito
4. Verificar redirect a `/login.html`
5. Login con credenciales nuevas

### CRUD Productos
1. Editar: Click en botón editar → Modal se llena → Actualizar
2. Crear: Click "Agregar" → Por llenar form → Submit
3. Eliminar: Click delete → Confirmar → Eliminado
4. Filtrar: Click categoria → Mostrar solo esa categoría

## 🐛 Troubleshooting

**Token inválido o expirado**
- Limpiar localStorage: `localStorage.clear()`
- Hacer login nuevamente

**API no responde**
- Verificar backend está corriendo en puerto 5000
- Verificar MONGODB_URI en backend/.env
- Verificar no hay errores en consola (F12)

**CORS Error**
- Verificar backend tiene CORS habilitado
- Verificar API_URL es correcto

**Productos no se cargan**
- Abrir DevTools (F12)
- Ver tab "Network"
- Verificar status de requests a /api/products
- Ver Console para mensajes de error

## 📝 Notas

- Todos los archivos HTML son estáticos (no necesitan build)
- El backend sirve los archivos HTML automáticamente
- localStorage persiste datos de sesión
- API debe estar corriendo para que funcione

## 🚀 Deployment

Frontend se deploya automáticamente con el backend.

El backend en `server.js` sirve los archivos desde `/frontend`:
```javascript
app.use(express.static(path.join(__dirname, '../frontend')))
```

---

**Última actualización:** 2024  
**Version:** 1.0.0

# 🚀 Guía Rápida de Inicio - MotoGear

## 1️⃣ Instalación Rápida

```bash
# En la carpeta del proyecto
npm install
```

## 2️⃣ Configuración MongoDB

### Opción A: MongoDB Local
```bash
# Instalar MongoDB (si no lo tienes)
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# macOS: brew install mongodb-community
# Linux: https://docs.mongodb.com/manual/installation/

# Iniciar MongoDB
mongod

# El servidor se conectará a mongodb://localhost:27017/motogear
```

### Opción B: MongoDB Atlas (Cloud)
```bash
# 1. Ir a https://www.mongodb.com/cloud/atlas
# 2. Crear cuenta gratuita
# 3. Crear un cluster
# 4. Obtener la URL de conexión
# 5. Actualizar .env:
#    MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/motogear
```

## 3️⃣ Variables de Entorno

El archivo `.env` ya está configurado. Si necesitas cambiar algo:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/motogear
JWT_SECRET=your_jwt_secret_key_change_in_production_environment
NODE_ENV=development
```

## 4️⃣ Iniciar la Aplicación

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El servidor estará en: **http://localhost:5000**

## 5️⃣ Acceder a la Aplicación

### Página de Inicio
```
http://localhost:5000/login.html
```

### Crear una Cuenta
1. Haz clic en "Registrarse"
2. Ingresa email y contraseña
3. Haz clic en "Registrarse"

### Iniciar Sesión
1. Ingresa tu email
2. Ingresa tu contraseña
3. Haz clic en "Entrar"

### Gestión de Productos
Después de iniciar sesión:
1. Accede a **http://localhost:5000/products.html**
2. ➕ Añade nuevos productos
3. ✏️ Edita productos existentes
4. 🗑️ Elimina productos
5. 📊 Visualiza estadísticas

## 6️⃣ Ejecutar Pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas en modo watch (se ejecutan al guardar cambios)
npm run test:watch

# Con cobertura
npm test -- --coverage
```

## ⚡ Características del dashboard de productos

- ✅ **Listado de productos**: Ve todos tus productos
- ✅ **Crear producto**: Agrega nueva mercancía
- ✅ **Editar producto**: Actualiza información
- ✅ **Eliminar producto**: Quita productos
- ✅ **Filtros**: Busca por stock bajo o sin stock
- ✅ **Estadísticas**: Ve el total de stock y valor del inventario
- ✅ **Categorías**: Cascos, Guantes, Chaquetas, Botas, Accesorios, Motos

## 🔧 Cambiar Puerto

Si quieres usar otro puerto (por ejemplo 3000):

```bash
# Opción 1: Variable de entorno
PORT=3000 npm run dev

# Opción 2: Editar .env
# PORT=3000
```

## 📝 Estructura de Archivos Importante

```
.
├── products.html          ⭐ NUEVO - Interfaz de gestión de productos
├── login.html             Página de login
├── register.html          Página de registro
├── server.js              Servidor Express
├── package.json           Dependencias
├── .env                   Variables de entorno
├── models/
│   ├── User.js            Modelo de usuario
│   └── Product.js         Modelo de producto
├── routes/
│   ├── auth.js            Rutas de autenticación
│   └── products.js        Rutas de productos
├── middleware/
│   └── auth.js            Middleware JWT
└── tests/
    ├── api.test.js        Pruebas de API
    └── models.test.js     Pruebas de modelos
```

## 🆘 Problemas Comunes

### Error: "Cannot find module 'express'"
```bash
npm install
```

### MongoDB connection failed
- Verificar que MongoDB está corriendo
- Si usas Atlas, verificar la URL en .env
- Verificar credenciales de MongoDB

### Puerto 5000 en uso
```bash
# Cambiar en .env o usar:
PORT=3000 npm run dev
```

### El token está vencido
- Limpia el localStorage:
  ```javascript
  localStorage.clear()
  ```
- Vuelve a iniciar sesión

## 📊 API Endpoints Principales

```
# Autenticación
POST   /api/auth/register       Crear cuenta
POST   /api/auth/login          Iniciar sesión

# Productos (requieren token JWT)
GET    /api/products            Listar productos
GET    /api/products/:id        Obtener un producto
POST   /api/products            Crear producto
PUT    /api/products/:id        Actualizar producto
DELETE /api/products/:id        Eliminar producto
```

## 🎉 ¡Listo!

Ahora puedes:
- Crear productos
- Editar productos
- Eliminar productos
- Ver estadísticas
- Filtrar por stock

¿Necesitas ayuda? Revisa el README.md para más detalles.

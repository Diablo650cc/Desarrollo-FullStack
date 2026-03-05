# 📱 Avance Full Stack - Proyecto Mejorado v2.0

## 🎯 Descripción

Proyecto Full Stack completo con mejoras significativas en backend y frontend:

### Backend (Node.js + Express)
- ✅ Autenticación JWT con roles (admin/usuario)
- ✅ Middleware de autorización avanzada
- ✅ Validación de datos con express-validator
- ✅ Paginación y filtros en GET
- ✅ Integración con API de pagos (Stripe)
- ✅ Integración con API de tipos de cambio

### Frontend (Angular + Bootstrap)
- ✅ Estructura modular con Angular
- ✅ Sistema de rutas y navegación
- ✅ Diseño completamente responsivo
- ✅ Componentes reutilizables
- ✅ Guards para rutas protegidas

---

## 🚀 Instalación y Configuración

### Backend

#### 1. Instalar dependencias
```bash
cd "Avance del Proyecto"
npm install
```

#### 2. Configurar variables de entorno
Copia el archivo `.env.example` a `.env` y actualiza con tus valores:
```bash
cp .env.example .env
```

**Variables necesarias:**
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=proyecto_api
JWT_SECRET=tu_jwt_secret_muy_seguro
STRIPE_SECRET_KEY=sk_test_mock_key
```

#### 3. Crear base de datos
Copia y ejecuta las queries del archivo `proyecto_api_v2.sql` en tu cliente MySQL:
```sql
source proyecto_api_v2.sql;
```

O manualmente:
```bash
mysql -u root -p < proyecto_api_v2.sql
```

#### 4. Iniciar el servidor
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

---

### Frontend (Angular)

#### 1. Navegar a la carpeta frontend
```bash
cd frontend
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

O para solo iniciar sin abrir el navegador:
```bash
npm start
```

El frontend estará disponible en: `http://localhost:4200`

#### 4. Compilar para producción
```bash
npm run build:prod
```

---

## 📚 Estructura del Proyecto

### Backend
```
├── config/
│   └── db.js                 # Configuración de conexión MySQL
├── middlewares/
│   ├── auth.middleware.js    # Middleware básico de autenticación
│   ├── authorization.middleware.js  # Autorización con roles
│   └── validation.middleware.js     # Validación de datos
├── routes/
│   ├── usuarios.routes.js    # Rutas de usuarios
│   ├── pagos.routes.js       # Rutas de pagos
│   └── external.routes.js    # Rutas de APIs externas
├── services/
│   └── external.service.js   # Servicios de APIs externas
├── index.js                  # Punto de entrada
├── package.json
└── .env.example
```

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── registro/
│   │   │   ├── dashboard/
│   │   │   ├── perfil/
│   │   │   ├── pagos/
│   │   │   └── admin/
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   └── auth.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── styles.css
│   └── index.html
├── package.json
├── angular.json
├── tsconfig.json
└── karma.conf.js
```

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación
1. Usuario se registra en `/registro`
2. Usuario inicia sesión en `/login`
3. Backend genera JWT token
4. Token se almacena en localStorage
5. Token se envía en header `Authorization: Bearer {token}`

### Roles y Permisos

#### Usuario Regular
- Ver su propio perfil
- Realizar pagos
- Ver su historial de pagos
- Acceder al dashboard público

#### Admin
- Acceso completo a todos los usuarios
- Crear, editar y eliminar usuarios
- Ver todos los pagos del sistema
- Acceso al panel de administración
- Gestionar roles de usuarios

---

## 🛠 Endpoints Disponibles

### Autenticación
```
POST   /api/usuarios/registro      # Registrar nuevo usuario
POST   /api/usuarios/login         # Iniciar sesión
```

### Usuarios (Protegido)
```
GET    /api/usuarios/perfil        # Obtener perfil del usuario autenticado
PUT    /api/usuarios/perfil        # Actualizar perfil propio
GET    /api/usuarios               # Listar usuarios (solo admin)
GET    /api/usuarios/:id           # Obtener usuario específico
POST   /api/usuarios               # Crear usuario (solo admin)
PUT    /api/usuarios/:id           # Actualizar usuario (solo admin)
DELETE /api/usuarios/:id           # Eliminar usuario (solo admin)
```

**Query params para GET /api/usuarios:**
- `page` (número de página, default: 1)
- `limit` (máximo 100, default: 10)
- `search` (buscar por nombre o email)

### Pagos (Protegido)
```
POST   /api/pagos/procesar         # Procesar un pago
GET    /api/pagos                  # Obtener historial de pagos
GET    /api/pagos/:id              # Obtener detalles de un pago
```

### APIs Externas (Públicas)
```
GET    /api/external/dolar         # Obtener precio del dólar
GET    /api/external/dolar/convertir?cantidad=100&towards=ARS  # Convertir moneda
```

---

## 📝 Validación de Datos

### Registro/Login
- Email debe ser válido y único
- Nombre mínimo 2 caracteres
- Contraseña mínimo 6 caracteres (debe incluir mayúsculas, minúsculas y números)

### Pagos
- Monto entre 0.50 y 10000
- Moneda válida (USD, ARS, MXN)
- Descripción obligatoria (máximo 255 caracteres)

---

## 🧪 Usuarios de Prueba

Se insertan automáticamente dos usuarios de prueba:

### Admin
```
Email: admin@example.com
Contraseña: Admin@123
Rol: admin
```

### Usuario Regular
```
Email: usuario@example.com
Contraseña: Usuario@123
Rol: usuario
```

---

## 🌐 Integración de APIs Externas

### API de Tipos de Cambio
- Fuente: `exchangerate-api.com`
- No requiere autenticación
- Actualiza automáticamente en tiempo real
- Tipos soportados: ARS, MXN

### API de Pagos (Stripe)
- Modo test configurado por defecto
- Se pueden cambiar a credenciales reales
- Procesa pagos simulados en desarrollo
- Integración lista para producción

---

## 📱 Componentes Frontend

### Login
- Formulario con validación en tiempo real
- Gestión de errores
- Redireccionamiento automático

### Registro
- Validación de contraseña
- Confirmación de contraseña
- Prevención de emails duplicados

### Dashboard
- información del usuario
- Acceso rápido a funcionalidades
- Indicadores de rol

### Perfil
- Edición de nombre y email
- Cambio de contraseña (en desarrollo)
- Información de seguridad

### Pagos
- Formulario para procesar pagos
- Historial de pagos paginado
- Conversión de monedas en tiempo real

### Admin Dashboard
- Estadísticas del sistema
- Gestión de usuarios
- Visualización de pagos
- Estado de APIs externas

---

## 🎨 Diseño Responsivo

El diseño es completamente responsivo con Bootstrap 5:
- ✅ Mobile (< 576px)
- ✅ Tablet (576px - 768px)
- ✅ Desktop (> 768px)
- ✅ Gradientes personalizados
- ✅ Animaciones suaves

---

## 🔧 Solución de Problemas

### Error de conexión a BD
- Verificar que MySQL está corriendo
- Verificar credenciales en .env
- Verificar que la BD existe

### Token expirado
- El token expira cada 24 horas
- El usuario será redireccionido a login automáticamente
- Vuelve a iniciar sesión

### CORS Error
- Verificar que el backend está en `http://localhost:3000`
- Verificar que el frontend está en `http://localhost:4200`
- CORS ya está configurado en el backend

---

## 📦 Dependencias Principales

### Backend
- `express@5.2.1` - Framework web
- `mysql2@3.16.3` - Cliente MySQL
- `jsonwebtoken@9.0.3` - JWT
- `bcryptjs@3.0.3` - Hashing de contraseñas
- `express-validator@7.0.0` - Validación de datos
- `axios@1.7.4` - HTTP client
- `stripe@14.20.0` - Integración de pagos
- `cors@2.8.6` - CORS
- `dotenv@17.2.4` - Variables de entorno

### Frontend
- `@angular/core@17` - Framework Angular
- `@angular/router@17` - Enrutamiento
- `@angular/forms@17` - Formularios
- `bootstrap@5.3.0` - Framework CSS
- `axios@1.6.0` - HTTP client

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia ISC.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

## 📞 Soporte

Para soporte o preguntas, contacta al equipo de desarrollo.

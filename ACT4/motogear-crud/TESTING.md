# Pruebas Unitarias - MotoGear CRUD

Este documento describe cómo ejecutar las pruebas unitarias e integración del proyecto MotoGear.

## Configuración

### Dependencias

Las siguientes dependencias ya están configuradas en `package.json`:
- **jest**: Framework de testing
- **supertest**: Testing de rutas HTTP

### Instalación

```bash
npm install
```

## Ejecutar Pruebas

### Todos los tests
```bash
npm test
```

### Tests en modo watch (se ejecutan al guardar cambios)
```bash
npm test -- --watch
```

### Tests con cobertura
```bash
npm test -- --coverage
```

### Tests de un archivo específico
```bash
npm test authController.test.js
```

### Tests de un describe específico
```bash
npm test -- --testNamePattern="Auth Controller"
```

## Estructura de Pruebas

### 1. **Controladores** (`src/controllers/__tests__/`)

#### `authController.test.js`
Prueba las funciones de autenticación:
- ✅ Registro de usuarios
- ✅ Validación de campos requeridos
- ✅ Detección de usuarios duplicados
- ✅ Login con credenciales válidas/inválidas
- ✅ Obtención del perfil del usuario

**Casos cubiertos:**
- Registro exitoso con token generado
- Error 400 sin email o contraseña
- Error 400 con usuario duplicado
- Error 500 en excepciones de BD
- Login exitoso
- Error 401 con credenciales inválidas
- Error 401 sin usuario encontrado

#### `productController.test.js`
Prueba las operaciones CRUD de productos:
- ✅ Listar todos los productos
- ✅ Obtener producto por ID
- ✅ Crear producto
- ✅ Actualizar producto
- ✅ Eliminar producto

**Casos cubiertos:**
- GET: Listar productos con populate
- GET: Manejar errores de BD
- GET by ID: Devolver producto o error 404
- POST: Crear con stock por defecto (0)
- POST: Error 400 por campos faltantes
- PUT: Actualizar con validadores
- PUT: Error 404 si no existe
- DELETE: Eliminar solo si es propietario
- DELETE: Error 403 si no es autorizado

### 2. **Middlewares** (`src/middlewares/__tests__/`)

#### `authMiddleware.test.js`
Prueba los middlewares de protección:
- ✅ Validación de tokens JWT
- ✅ Verificación de propiedad de productos
- ✅ Control de permisos de administrador

**Casos cubiertos:**
- `protect`: Acceso con token válido
- `protect`: Rechazo sin token
- `protect`: Rechazo de token inválido
- `protect`: Error 401 si usuario no existe
- `checkProductOwner`: Acceso al propietario
- `checkProductOwner`: Acceso a administradores
- `checkProductOwner`: Rechazo si no es propietario
- `checkProductOwner`: Error 404 si producto no existe

### 3. **Rutas** (`src/routes/__tests__/`)

#### `authRoutes.test.js`
Pruebas de integración para endpoints de autenticación:
- `POST /api/auth/register`: Crear usuario
- `POST /api/auth/login`: Iniciar sesión
- `GET /api/auth/profile`: Obtener perfil

#### `productRoutes.test.js`
Pruebas de integración para endpoints de productos:
- `GET /api/products`: Listar todos
- `GET /api/products/:id`: Obtener por ID
- `POST /api/products`: Crear (requiere autenticación)
- `PUT /api/products/:id`: Actualizar (requiere autenticación)
- `DELETE /api/products/:id`: Eliminar (requiere autenticación)

## Mocks Utilizados

### User Model
```javascript
jest.mock('../../src/models/User');
```
- `User.findOne()`: Búsqueda de usuarios
- `User.findById()`: Obtener usuario por ID
- `User.create()`: Crear nuevo usuario

### Product Model
```javascript
jest.mock('../../src/models/Product');
```
- `Product.find()`: Listar productos
- `Product.findById()`: Obtener por ID
- `Product.create()`: Crear producto
- `Product.findByIdAndUpdate()`: Actualizar
- `Product.findByIdAndDelete()`: Eliminar

### JWT
```javascript
jest.mock('jsonwebtoken');
```
- `jwt.sign()`: Generar tokens
- `jwt.verify()`: Verificar tokens

## Variables de Entorno para Tests

El archivo `.env.test` contiene:
```
MONGODB_URI=mongodb://test:test@localhost:27017/motogear-test
JWT_SECRET=test-secret-key-for-testing
JWT_EXPIRE=7d
PORT=3001
```

## Cobertura de Pruebas

### Objetivo Mínimo
- Controladores: >80%
- Middlewares: >90%
- Rutas: >75%

### Verificar Cobertura
```bash
npm test -- --coverage --coverageReporters=text
```

## Casos de Prueba Clave

### Autenticación
- ✅ Registro con datos válidos
- ✅ Rechazo de email duplicado
- ✅ Validación de campos requeridos
- ✅ Login con credenciales correctas
- ✅ Rechazo de credenciales incorrectas

### Productos
- ✅ Crear solo con campos requeridos
- ✅ Validar categorías enum
- ✅ Verificar propiedad en actualizaciones/eliminaciones
- ✅ Populate de usuario en respuestas
- ✅ Stock por defecto = 0

### Seguridad
- ✅ Protección de rutas con JWT
- ✅ Verificación de propiedad del producto
- ✅ Error 403 si no es autorizado
- ✅ Error 401 sin token válido

## Ejemplo de Ejecución

```bash
$ npm test

 PASS  src/controllers/__tests__/authController.test.js
  Auth Controller
    register
      ✓ debe registrar un usuario exitosamente (15ms)
      ✓ debe devolver error 400 si email o contraseña no están presentes (3ms)
      ✓ debe devolver error 400 si el usuario ya existe (2ms)
    login
      ✓ debe iniciar sesión correctamente (4ms)
      ✓ debe devolver error 401 si el usuario no existe (2ms)

Test Suites: 5 passed, 5 total
Tests:       45 passed, 45 total
Time:        3.456 s
```

## Notas Importantes

1. **Mocks de BD**: Usamos mocks para no depender de MongoDB real
2. **Tokens de Test**: Los tokens JWT son generados/verificados por funciones mock
3. **Aislamiento**: Cada test es independiente (beforeEach limpia mocks)
4. **Validaciones**: Se prueban tanto casos exitosos como casos de error

## Próximos Pasos

1. Ejecutar: `npm test`
2. Revisar cobertura: `npm test -- --coverage`
3. Ajustar pruebas según necesidades específicas
4. Integrar con CI/CD (GitHub Actions, etc.)

## Troubleshooting

**Error: "Cannot find module"**
- Verificar rutas relativas en imports
- Ejecutar: `npm install`

**Tests cuelgan**
- Aumentar timeout: `jest.setTimeout(15000);`
- Verificar que los mocks estén configurados

**Mocks no funcionan**
- Verificar que `jest.mock()` esté al inicio del archivo
- Asegurar que `jest.clearAllMocks()` esté en `beforeEach()`

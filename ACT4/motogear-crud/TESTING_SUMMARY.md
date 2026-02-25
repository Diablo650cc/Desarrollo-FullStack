# Resumen de Configuración de Pruebas

## Estructura del Proyecto de Tests

```
motogear-crud/
├── jest.config.js              # Configuración de Jest
├── jest.setup.js               # Setup global para tests
├── .env.test                   # Variables de entorno para tests
├── .env.example                # Template de variables de entorno
├── TESTING.md                  # Documentación completa de tests
│
└── src/
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   └── __tests__/
    │       ├── authController.test.js          (13 tests)
    │       └── productController.test.js       (15 tests)
    │
    ├── middlewares/
    │   ├── authMiddleware.js
    │   └── __tests__/
    │       └── authMiddleware.test.js          (10 tests)
    │
    └── routes/
        ├── authRoutes.js
        ├── productRoutes.js
        └── __tests__/
            ├── authRoutes.test.js              (7 tests)
            └── productRoutes.test.js           (15 tests)
```

## Resumen de Pruebas

### Total: 60 Tests

| Módulo | Archivo | Tests | Casos Cubiertos |
|--------|---------|-------|-----------------|
| **Auth Controller** | authController.test.js | 13 | register (4), login (4), getProfile (1) + validaciones |
| **Product Controller** | productController.test.js | 15 | getProducts (2), getProductById (3), createProduct (3), updateProduct (3), deleteProduct (4) |
| **Auth Middleware** | authMiddleware.test.js | 10 | protect (5), checkProductOwner (5) |
| **Auth Routes** | authRoutes.test.js | 7 | POST /register (3), POST /login (2), GET /profile (2) |
| **Product Routes** | productRoutes.test.js | 15 | GET / (2), GET /:id (2), POST / (3), PUT /:id (2), DELETE /:id (4) |

## Tipos de Pruebas

### 1. Pruebas Unitarias (Controladores)
- Prueban funciones individuales
- Mockeados: User, Product, JWT
- **40 tests** de lógica de negocio

### 2. Pruebas de Middlewares
- Prueban protección y autorización
- Validación de tokens JWT
- Verificación de permisos
- **10 tests** de seguridad

### 3. Pruebas de Integración (Rutas)
- Prueban endpoints HTTP
- Simular requests con supertest
- Validar status codes y respuestas
- **22 tests** de comportamiento de API

## Configuración de Jest

### jest.config.js
```javascript
{
    testEnvironment: 'node',                    // Ambiente Node.js
    testMatch: ['**/__tests__/**/*.js'],        // Ubicación de tests
    collectCoverageFrom: ['src/**/*.js'],       // Cobertura de código
    setupFilesAfterEnv: ['jest.setup.js']       // Setup global
}
```

### jest.setup.js
```javascript
jest.setTimeout(10000);  // Timeout para tests asincronos
```

## Dependencias de Testing

```json
{
    "devDependencies": {
        "jest": "^29.7.0",
        "supertest": "^6.3.3"
    }
}
```

## Mocks Configurados

### Jest Mocks
```javascript
jest.mock('../../src/models/User');        // Mock del modelo User
jest.mock('../../src/models/Product');     // Mock del modelo Product
jest.mock('jsonwebtoken');                 // Mock de JWT
```

### Funciones Mockeadas
- `User.findOne()` → Búsqueda de usuarios
- `User.findById()` → Obtener usuario por ID
- `User.create()` → Crear usuario
- `Product.find()` → Listar productos
- `Product.create()` → Crear producto
- `Product.findByIdAndUpdate()` → Actualizar
- `Product.findByIdAndDelete()` → Eliminar
- `jwt.sign()` → Generar tokens
- `jwt.verify()` → Verificar tokens

## Casos de Prueba por Categoría

### ✅ Autenticación (13 + 7 = 20 tests)
- Registro exitoso
- Validación de campos
- Detección de duplicados
- Login con credenciales
- Rechazo de credenciales inválidas
- Obtención de perfil
- Protección de rutas

### ✅ Productos (15 + 15 = 30 tests)
- CRUD completo
- Validación de categorías
- Verificación de propiedad
- Manejo de errores
- Populates de usuario
- Stock por defecto
- Errores HTTP apropiados

### ✅ Seguridad (10 tests)
- JWT válido/inválido
- Tokens expirados
- Verificación de propiedad
- Roles de administrador
- Errores 401/403

### ✅ Errores (10+ tests)
- Error 400: Campos faltantes
- Error 401: No autenticado
- Error 403: No autorizado
- Error 404: No encontrado
- Error 500: Error de servidor

## Cómo Ejecutar

### Tests básicos
```bash
npm test
```

### Con cobertura
```bash
npm test -- --coverage
```

### En modo watch
```bash
npm test -- --watch
```

### Test específico
```bash
npm test authController.test.js
```

## Cobertura Esperada

```
Lines       : 85%+ (Controladores y middlewares cubiertos)
Statements  : 80%+ (Lógica de negocio cubierta)
Functions   : 90%+ (Todas las funciones probadas)
Branches    : 75%+ (Rutas de código probadas)
```

## Validaciones Incluidas

### ✅ Validación de Entrada
- Email válido
- Contraseña presente
- Campos requeridos de producto
- Categorías enum

### ✅ Validación de Autenticación
- Token presente
- Token válido
- Usuario existe
- Credenciales correctas

### ✅ Validación de Autorización
- Usuario es propietario
- Permiso de administrador
- Acceso a recursos

### ✅ Validación de BD
- Crear registro
- Actualizar registro
- Eliminar registro
- Manejar errores

## Ejemplos de Tests

### Test de Controlador
```javascript
it('debe registrar un usuario exitosamente', async () => {
    const mockUser = { _id: '123', email: 'test@example.com' };
    User.create.mockResolvedValue(mockUser);
    
    await register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(mockUser));
});
```

### Test de Integración
```javascript
it('debe obtener todos los productos', async () => {
    Product.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProducts)
    });
    
    const response = await request(app).get('/api/products');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});
```

## Próximas Optimizaciones

1. **Pruebas E2E**: Agregar tests end-to-end
2. **CI/CD**: Integrar con GitHub Actions
3. **Cobertura**: Aumentar al 90%+
4. **Performance**: Benchmarks de API
5. **Snapshot Testing**: Para respuestas complejas

## Notas Importantes

- ✅ Todos los tests usan mocks (sin BD real)
- ✅ Cada test es independiente
- ✅ Timeout de 10s para operaciones async
- ✅ beforeEach limpia los mocks
- ✅ Cobertura enfocada en controladores y rutas

## Recursos

- [Jest Documentation](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://jestjs.io/docs/getting-started)

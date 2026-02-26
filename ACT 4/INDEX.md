📖 DOCUMENTACIÓN - MotoGear Application
=======================================

## 📌 Empieza Por Aquí

Si es tu **primera vez** con este proyecto, sigue este orden:

1. **📝 [QUICKSTART.md](QUICKSTART.md)** → Instalación en 5 pasos ⭐ START HERE
2. **🔧 [INSTALLATION.md](INSTALLATION.md)** → Instalación detallada
3. **📋 [README.md](README.md)** → Documentación completa
4. **🧪 [API-TESTING.md](API-TESTING.md)** → Cómo probar la API
5. **📁 [ESTRUCTURA.md](ESTRUCTURA.md)** → Arquitectura del proyecto

---

## 📚 Todos los Documentos

### 🚀 Inicio Rápido
- **[QUICKSTART.md](QUICKSTART.md)**
  - ⏱️ 5 minutos para tener todo funcionando
  - Instalación básica
  - Configuración simple
  - Primeros pasos
  - ✅ Mejor para: Empezar rápido

### 🔧 Instalación Detallada
- **[INSTALLATION.md](INSTALLATION.md)**
  - Requisitos del sistema
  - Instalación paso a paso
  - Para cada SO (Windows, macOS, Linux)
  - Solución de problemas
  - Checklist de verificación
  - ✅ Mejor para: Instalación primera vez

### 📖 Documentación Principal
- **[README.md](README.md)**
  - Características principales
  - Estructura del proyecto
  - Rutas de API completas
  - Modelos de datos
  - Sistema de autenticación
  - Despliegue
  - ✅ Mejor para: Referencia general

### 🧪 Pruebas de API
- **[API-TESTING.md](API-TESTING.md)**
  - Ejemplos de cURL
  - Guía de Postman
  - Estructura de respuestas
  - Errores comunes
  - Pruebas step-by-step
  - ✅ Mejor para: Probar la API

### 📁 Estructura del Proyecto
- **[ESTRUCTURA.md](ESTRUCTURA.md)**
  - Árbol de archivos completo
  - Descripción de cada archivo
  - Flujos de datos
  - Endpoints detallados
  - Esquema de MongoDB
  - ✅ Mejor para: Entender la arquitectura

### 📋 Resumen del Proyecto
- **[PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)**
  - Lo que se ha creado
  - Arquitectura general
  - Tecnologías usadas
  - Funcionalidades implementadas
  - Métricas del proyecto
  - ✅ Mejor para: Visión general

---

## 🎯 Busca Por Tu Caso

### "Necesito instalar todo"
1. Lee: [QUICKSTART.md](QUICKSTART.md)
2. Si hay problemas: [INSTALLATION.md](INSTALLATION.md)

### "¿Cómo uso la aplicación?"
1. Lee: [QUICKSTART.md](QUICKSTART.md) - Paso 4 y 5
2. Más detalles: [README.md](README.md) - Sección "Interfaz de Usuario"

### "¿Cómo uso la API?"
1. Lee: [API-TESTING.md](API-TESTING.md)
2. Referencia: [README.md](README.md) - Sección "Rutas de la API"

### "¿Cómo se estructura el código?"
1. Lee: [ESTRUCTURA.md](ESTRUCTURA.md)
2. Detalles: [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)

### "¿Cómo ejecuto pruebas?"
1. Lee: [QUICKSTART.md](QUICKSTART.md) - "Ejecutar Pruebas"
2. Detalles: [README.md](README.md) - Sección "Pruebas"

### "Tengo un error"
1. Busca en: [INSTALLATION.md](INSTALLATION.md) - "Solucionar Problemas"
2. O en: [QUICKSTART.md](QUICKSTART.md) - "Problemas Comunes"

### "Quiero desplegar la app"
1. Lee: [README.md](README.md) - Sección "Despliegue"

---

## 🗂️ Archivos del Proyecto

### Frontend
- `login.html` - Página de login
- `register.html` - Página de registro
- `products.html` ⭐ - Página de gestión de productos (NUEVA)

### Backend
- `server.js` - Servidor Express
- `package.json` - Dependencias

### Código
- `models/User.js` - Modelo de usuario
- `models/Product.js` - Modelo de producto
- `routes/auth.js` - Rutas de autenticación
- `routes/products.js` - Rutas de productos
- `middleware/auth.js` - Middleware JWT

### Pruebas
- `tests/api.test.js` - Pruebas de API
- `tests/models.test.js` - Pruebas de modelos

### Configuración
- `.env` - Variables de entorno
- `.gitignore` - Archivos ignorados
- `jest.config.js` - Configuración de Jest

---

## 📊 Guía Rápida de Comandos

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start

# Ejecutar pruebas
npm test

# Pruebas en modo watch
npm run test:watch

# Ver token (en navegador)
localStorage.getItem('token')

# Limpiar token
localStorage.clear()
```

---

## 🔗 Rutas de la Aplicación

### Frontend
- `http://localhost:5000/login.html` - Login
- `http://localhost:5000/register.html` - Registro
- `http://localhost:5000/products.html` - Productos

### API
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

---

## 🎓 Conceptos Clave

### Autenticación JWT
El token se genera en login y se envía en cada request:
```
Header: Authorization: Bearer <token>
```
El servidor valida el token antes de permitir acceso.

### CRUD
- **Create** (POST) - Crear productos
- **Read** (GET) - Obtener productos
- **Update** (PUT) - Actualizar productos
- **Delete** (DELETE) - Eliminar productos

### Base de Datos
- **MongoDB**: Almacena usuarios y productos
- **Mongoose**: ODM para validar y mapear datos
- **Colecciones**: users y products

---

## ✅ Checklist de Nuevos Usuarios

- [ ] Leí QUICKSTART.md
- [ ] Ejecuté `npm install`
- [ ] Configuré MongoDB
- [ ] Ejecuté `npm run dev`
- [ ] Accedí a http://localhost:5000/login.html
- [ ] Creé un usuario
- [ ] Agregué un producto
- [ ] Ejecuté pruebas con `npm test`
- [ ] Leí el resto de documentación

---

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "Cannot find module" | `npm install` |
| MongoDB connection failed | Verifica que MongoDB está corriendo |
| Puerto 5000 en uso | Cambia `PORT` en `.env` |
| Token no válido | `localStorage.clear()` y reloguéate |
| Página en blanco | Verifica consola del navegador (F12) |

---

## 📞 Ayuda Rápida

**¿Cómo reinicio todo?**
```bash
# Limpiar y reinstalar
rm -rf node_modules
npm install
npm run dev
```

**¿Cómo limpio todas mis sesiones?**
```javascript
// En consola del navegador (F12)
localStorage.clear()
```

**¿Cómo veo los datos en MongoDB?**
```bash
mongosh
use motogear
db.users.find()
db.products.find()
```

---

## 📈 Progreso

```
0% ████░░░░░░░░░░░░░░░░ Lectura
▼
25% ██████░░░░░░░░░░░░░░ npm install  
▼
50% ████████░░░░░░░░░░░░ npm run dev
▼
75% ██████████░░░░░░░░░░ Crear usuario
▼
100% ████████████░░░░░░░ ¡Listo!
```

---

## 🎉 ¡Bienvenido!

Estás a unos pasos de tener una aplicación web profesional funcionando.

**Próximo paso:** 👉 [QUICKSTART.md](QUICKSTART.md)

---

**Última actualización:** 25 de Febrero de 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Completo

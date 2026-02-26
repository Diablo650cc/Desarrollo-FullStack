# 📦 Guía de Instalación Completa

## Requisitos del Sistema

- **Node.js**: v14 o superior ([Descargar](https://nodejs.org/))
- **MongoDB**: v4.4 o superior (local o Cloud)
- **npm**: Incluido con Node.js (o usa yarn)

## Paso 1: Descargar e Instalar Node.js

### Windows
1. Ve a https://nodejs.org/
2. Descarga la versión LTS
3. Ejecuta el instalador
4. Sigue los pasos de instalación
5. Abre PowerShell/CMD y verifica:
```bash
node --version
npm --version
```

### macOS
```bash
# Con Homebrew
brew install node

# Verifica
node --version
npm --version
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm

# Verifica
node --version
npm --version
```

## Paso 2: Instalar MongoDB

### Opción A: MongoDB Local (Recomendado para desarrollo)

**Windows:**
1. Descarga desde: https://www.mongodb.com/try/download/community
2. Ejecuta el instalador
3. Sigue las instrucciones
4. MongoDB se iniciará automáticamente como servicio

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Verificar que MongoDB está corriendo:**
```bash
# En terminal/PowerShell
mongosh  # Si está instalado
# O simplemente verifica que se conecta en localhost:27017
```

### Opción B: MongoDB Atlas (Cloud - Sin instalación local)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un nuevo cluster
4. Obtén la URL de conexión
5. Actualiza el archivo `.env` con tu URL:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/motogear
```

## Paso 3: Clonar/Descargar el Proyecto

```bash
# Navega a la carpeta del proyecto
cd "C:\Users\PatoCV\Desktop\Desarrollo-FullStack\ACT 4"

# O si lo descargas como ZIP, extrae en esa ubicación
```

## Paso 4: Instalar Dependencias

```bash
# Desde la carpeta del proyecto
npm install

# Esto instalará:
# - express
# - mongoose
# - jsonwebtoken
# - bcryptjs
# - cors
# - nodemon (desarrollo)
# - jest (pruebas)
# - supertest (pruebas)
```

**Tiempo estimado**: 2-5 minutos (depende de tu conexión)

## Paso 5: Configurar Variables de Entorno

El archivo `.env` ya está creado con valores por defecto:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/motogear
JWT_SECRET=your_jwt_secret_key_change_in_production_environment
NODE_ENV=development
```

**Si usas MongoDB Atlas**, actualiza MONGODB_URI a tu URL.

## Paso 6: Iniciar la Aplicación

### Modo Desarrollo (Recomendado - con auto-reload)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

**Deberías ver:**
```
✅ Conectado a MongoDB
🚀 Servidor ejecutándose en http://localhost:5000
```

## Paso 7: Acceder a la Aplicación

Abre tu navegador y ve a:
```
http://localhost:5000/login.html
```

## 🎯 Primeros Pasos en la App

### 1. Registrarse
- Haz clic en "Registrarse"
- Ingresa un email válido
- Ingresa una contraseña (mínimo 6 caracteres)
- Haz clic en "Registrarse"

### 2. Iniciar Sesión
- Ingresa el email
- Ingresa la contraseña
- Haz clic en "Entrar"

### 3. Gestionar Productos
- Rellena el formulario con detalles del producto
- Haz clic en "Guardar Producto"
- Ver productos en la tabla
- Editar: Haz clic en ✏️
- Eliminar: Haz clic en 🗑️

### 4. Nueva Interfaz de Productos
- Accede a: `http://localhost:5000/products.html`
- Interfaz mejorada con filtros y estadísticas

## 🧪 Ejecutar Pruebas

```bash
# Pruebas unitarias
npm test

# Pruebas con cobertura
npm test -- --coverage

# Modo watch (se ejecutan al guardar)
npm run test:watch
```

## 📝 Mensajes Importantes

### ✅ Todo está correcto si ves:
```
✅ Conectado a MongoDB
🚀 Servidor ejecutándose en http://localhost:5000
```

### ❌ Errores Comunes

#### Error: "Cannot find module"
```bash
npm install
```

#### MongoDB Connection Failed
- **Verificar MongoDB está corriendo:**
  - Windows: Busca "Servicios" y verifica MongoDB
  - macOS: `brew services list`
  - Linux: `sudo systemctl status mongod`

#### Error: "Connection refused" en puerto 5000
```bash
# El puerto ya está en uso. Cambiar en .env:
PORT=3000 npm run dev
```

#### Token inválido/expirado
```javascript
// En la consola del navegador
localStorage.clear()
// Vuelve a iniciar sesión
```

## 🔄 Estructura de Conexión

```
Navegador (login.html, products.html)
    ↓
API REST (server.js en http://localhost:5000)
    ↓
MongoDB (localhost:27017 o MongoDB Atlas)
```

## 📊 Verificar Datos en MongoDB

### Con MongoDB local:
```bash
mongosh
use motogear
db.users.find()
db.products.find()
```

### Con MongoDB Atlas:
1. Ve a MongoDB Atlas Dashboard
2. Haz clic en "Collections"
3. Explora las bases de datos y colecciones

## 🚀 Próximos Pasos

1. Crea un usuario de prueba
2. Agrega algunos productos
3. Prueba crear, editar y eliminar
4. Ejecuta las pruebas unitarias
5. Revisa el código en `routes/` y `models/`

## 📚 Archivos Importantes

```
ACT 4/
├── server.js              ← Inicia aquí
├── package.json           ← Dependencias
├── .env                   ← Configuración
├── login.html             ← Página inicial
├── register.html          ← Registro
├── products.html          ← Nueva interfaz (mejorada)
├── models/                ← Schemas de MongoDB
├── routes/                ← Endpoints de API
├── middleware/            ← Autenticación JWT
└── tests/                 ← Pruebas unitarias
```

## ✅ Checklist de Instalación

- [ ] Node.js instalado
- [ ] MongoDB instalado/configurado
- [ ] Proyecto clonado/descargado
- [ ] `npm install` ejecutado
- [ ] `.env` configurado (si es necesario)
- [ ] `npm run dev` ejecutando
- [ ] Servidor en http://localhost:5000
- [ ] Navegador accediendo a login.html
- [ ] Usuario creado exitosamente
- [ ] Productos funcionando

## 🎉 ¡Listo!

Si todo funciona, tu aplicación está lista para:
- ✅ Crear usuarios
- ✅ Autenticación JWT
- ✅ CRUD de productos
- ✅ MongoDB almacenando datos
- ✅ API REST funcional
- ✅ Pruebas unitarias

¿Problemas? Revisa los logs en consola o contacta al soporte.

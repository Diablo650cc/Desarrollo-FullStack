# 🗄️ Configurar MongoDB Local

## Windows

### Opción 1: MongoDB Installer (Recomendado)
1. Descargar: https://www.mongodb.com/try/download/community
2. Ejecutar el installer
3. Siguiente → Siguiente → Instalar
4. MongoDB se inicia automáticamente como servicio Windows

**Verificar que está corriendo:**
```
Win + R → services.msc → Buscar "MongoDB" → Debe estar "Running"
```

### Opción 2: MongoDB Portable
1. Descargar zip version
2. Extraer en `C:\mongodb`
3. Crear carpeta `C:\data\db`
4. Ejecutar:
```bash
C:\mongodb\bin\mongod.exe
```

**Verificar:** Ver "waiting for connections on port 27017"

---

## macOS

### Usando Homebrew (Más fácil)
```bash
# Instalar
brew tap mongodb/brew
brew install mongodb-community

# Iniciar servicio
brew services start mongodb-community

# Ver estado
brew services list

# Detener
brew services stop mongodb-community
```

**Verificar:**
```bash
mongosh
> show databases
```

---

## Linux (Ubuntu/Debian)

```bash
# Instalar
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar
sudo systemctl start mongod

# Estado
sudo systemctl status mongod

# Detener
sudo systemctl stop mongod
```

---

## Verificar que funciona

```bash
# Conectar a MongoDB
mongosh

# Dentro de mongosh:
> show databases
> use motogear
> db.collection.find()
```

O usar **MongoDB Compass** (GUI gratuita):
1. Descargar: https://www.mongodb.com/products/compass
2. Instalar
3. Local: `mongodb://localhost:27017`
4. Ver bases de datos y colecciones visualmente

---

## Configurar en .env

```
MONGODB_URI=mongodb://localhost:27017/motogear
```

Asegúrate que:
1. ✅ `mongod` está corriendo
2. ✅ `MONGODB_URI` en `.env` es correcto
3. ✅ Puerto 27017 no está bloqueado

---

## Troubleshooting

**Error: connect ECONNREFUSED 127.0.0.1:27017**
- MongoDB no está corriendo
- Ejecutar `mongod` en otra terminal

**Error: "Cannot find module 'mongodb'"**
- Ejecutar `npm install`

**MongoDB porta ocupada**
- Cambiar puerto: `mongod --port 27018`
- Actualizar `.env`: `MONGODB_URI=mongodb://localhost:27018/motogear`

**Base datos vacía después de reiniciar**
- Es normal, los datos se guardan en disco
- Verificar ruta de datos: `/var/lib/mongodb` (Linux) o `C:\data\db` (Windows)

---

## Alternativa: MongoDB Atlas (Cloud)

Si prefieres no instalar localmente:

1. Ir a: https://www.mongodb.com/cloud/atlas
2. Crear cuenta (gratis)
3. Crear un cluster (seleccionar region más cercana)
4. Esperar a que se cree (~3 minutos)
5. Click en "Connect"
6. Seleccionar "Connect your application"
7. Copiar connection string

```
mongodb+srv://usuario:password@cluster.mongodb.net/motogear?retryWrites=true&w=majority
```

8. Actualizar `.env`:
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/motogear?retryWrites=true&w=majority
```

**Ventajas:** No necesitas instalar nada, funciona en cualquier máquina
**Desventaja:** Requiere internet

---

## Comandos útiles MongoDB

```bash
# Conectar
mongosh

# Ver bases de datos
show databases

# Cambiar a BD
use motogear

# Ver colecciones
show collections

# Ver documentos
db.users.find()
db.products.find()

# Contar documentos
db.users.count()

# Salir
exit
```

# 🚀 GUÍA RÁPIDA - Comenzar en 5 minutos

## Paso 1: Dependencias (1 minuto)
```bash
npm install
```

## Paso 2: Configuración (1 minuto)

### Opción A: MongoDB Local (Más fácil para pruebas)
1. Descargar MongoDB Community: https://www.mongodb.com/try/download/community
2. Instalar
3. Ejecutar en otra terminal:
   - **Windows:** `mongod.exe`
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

### Opción B: MongoDB Atlas (Cloud)
1. Ir a: https://www.mongodb.com/cloud/atlas
2. Crear cuenta gratis
3. Crear cluster
4. Copiar connection string

### Configurar .env
Crear archivo `.env` en la raíz:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/motogear
JWT_SECRET=test-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Paso 3: Ejecutar (1 minuto)

```bash
npm run dev
```

Deberías ver:
```
✅ Servidor corriendo en puerto 3000
📍 http://localhost:3000
🏥 Health check: http://localhost:3000/health
✅ MongoDB conectado: localhost:27017
```

## Paso 4: Verificar (2 minutos)

### Terminal:
```bash
# Health check
curl http://localhost:3000/health

# Listar productos (vacío al inicio)
curl http://localhost:3000/api/products
```

O visita en navegador:
- http://localhost:3000 → API OK
- http://localhost:3000/health → Status del servidor

## ✅ Listo!

Ahora puedes:
- ✅ Usar Postman/Insomnia para probar endpoints
- ✅ Ejecutar tests: `npm test`
- ✅ Ver logs en tiempo real

---

## 🆘 Si algo falla

**Error: Cannot connect to MongoDB**
- Verifica que `mongod` está corriendo
- Si usas Atlas, copia la connection string correcta

**Error: MONGODB_URI is not defined**
- Crea el archivo `.env` (puedes copiar `.env.example`)

**Puerto 3000 en uso**
- Cambia `PORT=3000` a `PORT=3001` en `.env`

---

## 📚 Comandos útiles

```bash
npm run dev           # Desarrollo (auto-reload)
npm start             # Modo producción
npm test              # Ejecutar pruebas
npm run test:watch   # Tests con auto-reload
npm run test:coverage # Ver cobertura de tests
```

---

**Ver:** [README.md](README.md) para documentación completa

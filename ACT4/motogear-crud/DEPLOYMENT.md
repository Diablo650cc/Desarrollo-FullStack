# 🚀 Guía de Despliegue - MotoGear

## 📋 Requisitos

- Cuenta en GitHub
- Cuenta en Vercel (https://vercel.com)
- Acceso a MongoDB (Local o Atlas)

---

## 🔧 Paso 1: Preparar Repositorio GitHub

### 1.1 Inicializar Git (si no lo has hecho)
```bash
git init
git add .
git commit -m "Initial commit: MotoGear CRUD"
```

### 1.2 Crear repositorio en GitHub
1. Ir a https://github.com/new
2. Crear repositorio: `motogear-crud`
3. Copiar URL del repositorio

### 1.3 Conectar repositorio local
```bash
git remote add origin https://github.com/TU_USUARIO/motogear-crud.git
git branch -M main
git push -u origin main
```

**Verificar:**
- Ir a tu repositorio en GitHub
- Deberías ver todos los archivos

---

## 🌐 Paso 2: Desplegar en Vercel

### 2.1 Conectar Vercel con GitHub
1. Ir a https://vercel.com
2. Click en "Sign Up" → "Continue with GitHub"
3. Autorizar Vercel a acceder a tus repositorios

### 2.2 Crear nuevo proyecto
1. En Vercel dashboard: "New Project"
2. Buscar repositorio: `motogear-crud`
3. Click en "Import"

### 2.3 Configurar variables de entorno
En la pantalla de configuración:
- **Name:** motogear-crud
- **Framework Preset:** Other (Node.js)
- **Build Command:** `npm run build` (dejar vacío si no existe)
- **Start Command:** `node server.js`

Click en "Environment Variables" e informar:
```
MONGODB_URI = mongodb+srv://usuario:password@cluster.mongodb.net/motogear
JWT_SECRET = your-secret-key-production
JWT_EXPIRE = 7d
NODE_ENV = production
```

### 2.4 Desplegar
Click en "Deploy"

**Esperar:** ~2-3 minutos

**Resultado:**
```
✅ Deployment successful
🎉 https://motogear-crud.vercel.app
```

---

## 🔄 Paso 3: Configurar CI/CD con GitHub Actions

### 3.1 Añadir secrets en GitHub
Ir a tu repositorio → Settings → Secrets and variables → Actions

**Añadir estos secretos:**

```
VERCEL_TOKEN = <tu-token-vercel>
VERCEL_ORG_ID = <tu-org-id>
VERCEL_PROJECT_ID = <tu-project-id>
```

### 3.2 Obtener tokens de Vercel

**VERCEL_TOKEN:**
1. Ir a https://vercel.com/account/tokens
2. Create New Token
3. Copiar token

**VERCEL_ORG_ID y VERCEL_PROJECT_ID:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Linkear proyecto
vercel link

# Copiar del archivo .vercel/project.json:
# - "orgId" → VERCEL_ORG_ID
# - "projectId" → VERCEL_PROJECT_ID
```

### 3.3 Workflow automático
El archivo `.github/workflows/deploy.yml` ya está configurado

**Cada push a `main` ejecutará:**
1. ✅ Tests (Node 16 y 18)
2. ✅ Cobertura de código
3. ✅ Despliegue a Vercel
4. ✅ Notificación de resultado

---

## 📊 Ver Estado de Despliegues

### En GitHub
Ir a repositorio → Actions

Verás el historial de:
- ✅ Tests que pasaron
- ✅ Despliegues completados
- ❌ Fallos (si existen)

### En Vercel
Dashboard → Deployments

Verás:
- Estado de cada despliegue
- Logs de build
- URL en vivo

---

## 📝 Flujo de Desarrollo

### Para código nuevo:

```bash
# 1. Crear rama de feature
git checkout -b feature/nueva-caracteristica

# 2. Realizar cambios
# ... (modificar archivos, tests, etc)

# 3. Commit
git add .
git commit -m "Agregar nueva caracteristica"

# 4. Push
git push origin feature/nueva-caracteristica

# 5. Pull Request en GitHub
# - Click en "New Pull Request"
# - Seleccionar `main` como base
# - Incluir descripción

# 6. GitHub Actions automáticamente:
#    - Ejecuta tests
#    - Muestra resultado en PR

# 7. Si tests pasan:
#    - Merge a main
#    - Vercel automáticamente despliega
#    - Sitio actualizado en ~2 min
```

---

## 🔍 Testing en cada Push

### Automático (GitHub Actions)
```
├── Test Node 16
│   ├── npm install ✅
│   ├── npm test ✅
│   └── Cobertura ✅
│
├── Test Node 18
│   ├── npm install ✅
│   ├── npm test ✅
│   └── Cobertura ✅
│
└── Deploy a Vercel (si main) ✅
```

### Manual (Local)
```bash
npm test              # Todos los tests
npm run test:watch  # Modo watch
npm run test:coverage  # Con cobertura
```

---

## 📱 Monitoreo

### Health Check en Producción
```bash
curl https://motogear-crud.vercel.app/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "timestamp": "2026-02-25T10:30:45.123Z",
  "uptime": 3600,
  "environment": "production",
  "mongodb": "configurado"
}
```

### Logs en Vercel
1. Ir a Vercel dashboard
2. Click en proyecto
3. "Logs" → Ver errores en tiempo real

---

## ❌ Troubleshooting

### Error: "Cannot find module 'dotenv'"
**Solución:** Ejecutar `npm install` en Vercel
- Vercel automáticamente ejecuta npm install
- Si falla, ir a Settings → Rebuild → Deploy

### Error: "MongoDB connection failed"
**Solución:** Verificar `MONGODB_URI` en Vercel
1. Ir a Settings → Environment Variables
2. Verificar que `MONGODB_URI` es correcto
3. Para MongoDB Atlas: agregar IP de Vercel a whitelist
   - Ir a MongoDB Atlas → Network Access
   - Add IP Address: 0.0.0.0/0 (permite todas)
   - O esperar a que Vercel haga ping

### Error: Tests failing en CI
**Solución:**
1. Ejecutar localmente: `npm test`
2. Revisar errores
3. Hacer commit local
4. Push solo si tests pasan

### Despliegue muy lento
**Solución:**
- Esperar, Vercel optimiza en segundo push
- Verificar que no hay errores de compilación
- Ir a Vercel → Deployments → Ver logs

---

## 🎯 URLs Importantes

| Recurso | URL |
|---------|-----|
| GitHub Repositorio | https://github.com/TU_USUARIO/motogear-crud |
| Vercel Dashboard | https://vercel.com |
| Sitio en Vivo | https://motogear-crud.vercel.app |
| API Health | https://motogear-crud.vercel.app/health |
| MongoDB Atlas | https://cloud.mongodb.com |
| GitHub Actions | https://github.com/TU_USUARIO/motogear-crud/actions |

---

## 📚 Documentación

- [Vercel Node.js](https://vercel.com/docs/concepts/functions/serverless-functions/node)
- [GitHub Actions](https://docs.github.com/en/actions)
- [MongoDB](https://docs.mongodb.com/)

---

## ✅ Checklist de Despliegue

- [ ] Repositorio Git creado y conectado
- [ ] Código enviado a GitHub (main)
- [ ] Cuenta Vercel creada
- [ ] Proyecto Vercel importado de GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] MONGODB_URI verificada en Vercel
- [ ] Secrets de GitHub Actions agregados
- [ ] Primer despliegue exitoso
- [ ] Health check funcionando
- [ ] Tests pasando en cada push
- [ ] CI/CD funcionando automáticamente

---

## 🎉 Próximas Mejoras

- [ ] Agregar tests E2E (Cypress, Playwright)
- [ ] Configurar custom domain
- [ ] Agregar SSL/TLS
- [ ] Monitoring en producción (Sentry)
- [ ] Analytics de API
- [ ] Backup automático de MongoDB

---

**Versión:** 1.0.0  
**Última actualización:** 25 Feb 2026  
**Estado:** ✅ Listo para despliegue

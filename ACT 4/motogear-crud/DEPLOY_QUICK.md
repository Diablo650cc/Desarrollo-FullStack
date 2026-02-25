# 🚀 DESPLIEGUE EN 10 PASOS

## Paso 1: Push a GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit: MotoGear"
git remote add origin https://github.com/TU_USUARIO/motogear-crud.git
git branch -M main
git push -u origin main
```

## Paso 2: Crear cuenta Vercel (1 min)
- Ir a https://vercel.com
- "Sign Up" → "Continue with GitHub"
- Autorizar

## Paso 3: Importar Proyecto (2 min)
1. Vercel Dashboard → "New Project"
2. Seleccionar repositorio `motogear-crud`
3. Click "Import"

## Paso 4: Configurar Variables (2 min)
En pantalla de configuración, agregar Environment Variables:
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/motogear
JWT_SECRET=tu-secret-key
JWT_EXPIRE=7d
NODE_ENV=production
```

## Paso 5: Desplegar (3 min)
Click botón "Deploy"

Esperar mensaje:
```
✅ Deployment successful
🎉 https://motogear-crud.vercel.app
```

## Paso 6: Verificar Funcionamiento
```bash
curl https://motogear-crud.vercel.app/health
```

Debería retornar status OK ✅

## Paso 7: Configurar CI/CD (5 min)

### 7.1 Obtener tokens Vercel
```bash
npm i -g vercel
vercel link
# Copiar VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
```

### 7.2 Agregar secrets en GitHub
GitHub → Tu repo → Settings → Secrets → New repository secret

Agregar:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Paso 8: Verificar Workflow
GitHub → Tu repo → Actions

Verás:
- ✅ Tests ejecutándose
- ✅ Despliegue automático

## Paso 9: Desarrollo Futuro
```bash
# Nueva rama
git checkout -b feature/nueva

# Cambios
# ... editar archivos ...

# Commit
git add .
git commit -m "Agregar feature"

# Push
git push origin feature/nueva

# GitHub Actions: Automáticamente ejecuta tests
# Si pasan → Deploy automático a Vercel
```

## Paso 10: Monitoreo
- GitHub: https://github.com/TU_USUARIO/motogear-crud/actions
- Vercel: https://vercel.com/dashboard
- API: https://motogear-crud.vercel.app/health

---

## 🔗 URLs Requeridas

**MongoDB Atlas (si no tienes BD):**
1. https://cloud.mongodb.com
2. Crear cuenta
3. Crear cluster
4. Copiar connection string
5. Agregar a MONGODB_URI en Vercel

**GitHub:**
- https://github.com/new (crear repo)
- https://github.com/settings/tokens (generar tokens)

**Vercel:**
- https://vercel.com/account/tokens (generar token)

---

## ⚡ Resultado Final

### Local:
```bash
npm run dev  # http://localhost:3000
npm test     # Tests locales
```

### En Vercel:
```
https://motogear-crud.vercel.app  # En vivo
https://motogear-crud.vercel.app/health  # Health check
```

### Automático en cada push:
- ✅ Tests Node 16 + 18
- ✅ Linter (si existe)
- ✅ Deploy a producción
- ✅ Notificación en GitHub

---

**¡Todo listo en 10 pasos! 🎉**

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para guía completa.

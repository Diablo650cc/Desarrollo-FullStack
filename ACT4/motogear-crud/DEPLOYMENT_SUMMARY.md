# 🌐 DESPLIEGUE Y CI/CD - RESUMEN

## ✅ Lo Configurado

### Archivos Creados

| Archivo | Descripción |
|---------|-------------|
| **vercel.json** | Configuración de Vercel para Node.js |
| **.github/workflows/deploy.yml** | Pipeline CI/CD automático |
| **DEPLOYMENT.md** | Guía completa de despliegue |
| **DEPLOY_QUICK.md** | Guía rápida (10 pasos) |
| **.gitignore** | Archivos excluidos de Git |

---

## 🚀 Despliegue Vercel (2 opciones)

### ✅ Opción 1: Usando Vercel UI (Más fácil)
1. Ir a https://vercel.com
2. Conectar con GitHub
3. Importar repositorio `motogear-crud`
4. Agregar variables de entorno
5. Hacer click en "Deploy"

**Tiempo:** 10 minutos

### ✅ Opción 2: Usando Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

**Tiempo:** 5 minutos

---

## 🔄 CI/CD con GitHub Actions

### Automatización

Cada push a `main`:
1. ✅ Ejecuta tests (Node 16 + 18)
2. ✅ Verifica cobertura
3. ✅ Si pasan tests → Deploy automático
4. ✅ Notifica resultado en GitHub

### Flujo

```
Código local
    ↓ (git push)
GitHub repo
    ↓
GitHub Actions
    ├─ npm install
    ├─ npm test
    └─ (si pasan)
        ↓
    Vercel Deploy
        ↓
    https://motogear-crud.vercel.app
```

---

## 📋 Variables de Entorno (Vercel)

```
MONGODB_URI = mongodb+srv://usuario:password@cluster.mongodb.net/motogear
JWT_SECRET = tu-secret-key-production
JWT_EXPIRE = 7d
NODE_ENV = production
```

**Obtener MONGODB_URI:**
- MongoDB Local: `mongodb://localhost:27017/motogear`
- MongoDB Atlas: Connection String de cluster

---

## 🏗️ Estructura para Despliegue

```
vercel.json                    ← Config Vercel
.github/
  └─ workflows/
      └─ deploy.yml           ← GitHub Actions
.gitignore                     ← Git ignore
src/
  └─ ... (código)
server.js                      ← Entry point
package.json                   ← Dependencies
```

---

## ✅ Checklist Rápido

- [ ] Código en GitHub (repositorio debe ser público o privado con acceso)
- [ ] Vercel conectado con GitHub
- [ ] Proyecto Vercel creado
- [ ] Variables de entorno en Vercel
- [ ] MONGODB_URI verificada
- [ ] Secrets en GitHub (VERCEL_TOKEN, etc)
- [ ] Workflow de GitHub Actions activo
- [ ] Primer despliegue exitoso
- [ ] Health check: `curl https://motogear-crud.vercel.app/health`

---

## 🔐 Secrets Necesarios (GitHub)

Para que GitHub Actions pueda hacer deploy a Vercel:

```
VERCEL_TOKEN      = Token de Vercel
VERCEL_ORG_ID     = ID de tu organización
VERCEL_PROJECT_ID = ID del proyecto
```

**Cómo obtenerlos:**
1. Ir a https://vercel.com/account/tokens → Crear nuevo
2. `vercel link` → Copiar del archivo `.vercel/project.json`

---

## 📊 Monitoreo

### URLs

| Recurso | URL |
|---------|-----|
| Sitio en vivo | `https://motogear-crud.vercel.app` |
| Health check | `https://motogear-crud.vercel.app/health` |
| GitHub Actions | GitHub → Actions |
| Vercel Dashboard | https://vercel.com/dashboard |

### Logs

**GitHub Actions:**
- GitHub → Actions → Ver último workflow

**Vercel:**
- Vercel → Deployments → Ver logs de build

---

## 🔧 Comandos Útiles

```bash
# Local
npm run dev              # Desarrollo local
npm test                 # Tests local
npm start                # Producción local

# Git
git push origin main     # Trigger CI/CD
git branch -a            # Ver ramas

# Vercel CLI
vercel --prod            # Desplegar inmediatamente
vercel logs              # Ver logs
vercel env ls            # Ver variables
```

---

## ❌ Troubleshooting

### "Deploy Failed"
- Revisar logs en GitHub Actions
- Revisar logs en Vercel
- Verificar que tests pasan localmente: `npm test`

### "MongoDB connection failed" en Vercel
- Verificar `MONGODB_URI` es correcto
- Si MongoDB Atlas: agregar IP 0.0.0.0 a Network Access
- Esperar a que Vercel reconecte

### "Port already in use"
- Vercel maneja puertos automáticamente
- Si es local: cambiar `PORT=3001` en `.env`

### Tests fallan en CI pero pasan localmente
- Ejecutar: `npm install` localmente
- Revisar diferencias de versiones de Node
- Verificar variables de entorno

---

## 📸 CAPTURAS PARA REPORTE

| Elemento | Ubicación |
|----------|-----------|
| Configuración Vercel | [vercel.json](vercel.json) |
| GitHub Actions workflow | [.github/workflows/deploy.yml](.github/workflows/deploy.yml) |
| Guía de despliegue | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Guía rápida | [DEPLOY_QUICK.md](DEPLOY_QUICK.md) |
| GitHub Actions ejecutándose | GitHub repo → Actions tab |
| Vercel deployments | Vercel dashboard |
| Health check exitoso | Terminal: `curl https://URL/health` |

---

## 🎯 Resultado Final

✅ **Despliegue automático:** Cada push a `main` despliega automáticamente
✅ **Tests automáticos:** Se ejecutan en Node 16 y 18
✅ **Production ready:** HTTPS, dominio personalizado, escalable
✅ **Monitoreo:** Health check disponible en `/health`

---

## 📚 Documentación Completa

- [DEPLOY_QUICK.md](DEPLOY_QUICK.md) - 10 pasos rápidos
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía detallada
- [README.md](README.md) - Ejecutar localmente
- [TESTING.md](TESTING.md) - Testing completo

---

**Estado:** ✅ Listo para desplegar
**Tiempo estimado:** 10-15 minutos

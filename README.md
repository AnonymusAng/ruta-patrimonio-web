# Ruta Patrimonio Web

Interfaz React + Vite para administrar categorías, lugares y eventos de la API Ruta Patrimonio. Incluye listados, formularios de creación, eliminación, estados de carga y error, y edición de lugares.

## Requisitos

- Node.js 20.19 o superior, o 22.12 o superior.
- npm y Git instalados.
- La API Django ejecutándose en `http://127.0.0.1:8000`.

## Ejecutar en Windows PowerShell

```powershell
npm install
npm run dev
```

Abre la dirección que indique Vite, normalmente `http://localhost:5173`. Si la API está en otra dirección, copia `.env.example` como `.env` y ajusta `VITE_API_URL`.

## Publicar en GitHub

Crea un repositorio vacío llamado `ruta-patrimonio-web`. Desde esta carpeta, configura tu identidad de Git y publica el código:

```powershell
git init -b main
git config user.name "Tu nombre completo"
git config user.email "correo vinculado a GitHub"
git add .
git status
git commit -m "chore(frontend): inicia la interfaz patrimonial"
git remote add origin https://github.com/USUARIO/ruta-patrimonio-web.git
git push -u origin main
```

Reemplaza `USUARIO` por el dueño del repositorio e inicia sesión con tu propia cuenta. El `.gitignore` excluye `node_modules`, `dist` y archivos `.env`.

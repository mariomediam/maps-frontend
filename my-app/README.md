# Maps Production Frontend

Sistema para el registro de incidencias - Frontend desarrollado con React + Vite.

## 🚀 Desarrollo Local

### Opción 1: Usando Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up --build

# O desde la carpeta my-app
cd my-app
docker build -t maps-frontend .
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules maps-frontend
```

### Opción 2: Desarrollo Nativo

```bash
cd my-app
npm install
npm run dev
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Preview de la build de producción
- `npm run check` - Ejecuta Biome linting
- `npm run format` - Formatea el código con Biome

## 🏗️ Estructura del Proyecto

```
my-app/
├── src/
│   ├── features/           # Funcionalidades por módulos
│   │   ├── auth/           # Autenticación
│   │   ├── mapExplorer/    # Explorador de mapas
│   │   └── incident*/      # Gestión de incidentes
│   ├── shared/             # Componentes y utilidades compartidas
│   │   ├── components/     # Componentes reutilizables
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilidades (APIs, etc.)
│   │   └── constants/      # Constantes globales
│   └── routes/             # Configuración de rutas
├── public/                 # Assets estáticos
├── Dockerfile             # Configuración Docker
└── .dockerignore          # Archivos ignorados por Docker
```

## 🌐 Variables de Entorno

Crea un archivo `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📦 Tecnologías Principales

- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Tailwind CSS** - Framework CSS
- **Leaflet** - Mapas interactivos
- **Axios** - Cliente HTTP
- **Biome** - Linter y formateador

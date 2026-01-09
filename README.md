# RestaurantFrontend

Frontend web construido con Angular que consume una API REST (Swagger disponible en el backend). Este repositorio contiene únicamente el cliente (SPA).

## Tecnologías (y versiones)

Las versiones exactas pueden variar según el `package-lock.json`, pero el proyecto está basado en:

- Angular: 20.3.x
- Angular CLI: 20.3.5
- TypeScript: ~5.9.2
- RxJS: ~7.8.0
- UI: ng-zorro-antd 20.4.x
- Estilos: TailwindCSS 4.1.x + SCSS
- Tests: Karma + Jasmine

## Requisitos previos

- Node.js LTS (recomendado 20.x o 22.x)
- npm (incluido con Node)
- Angular CLI (opcional global; se puede usar vía `npx`)

### Verificar versiones instaladas

```bash
node -v
npm -v
npx ng version
```

## Estructura del proyecto

Estructura relevante (resumen):

```text
src/
	app/
		common/
			models/                 # Interfaces/Modelos (Cliente, Factura, Mesa, etc.)
			services/               # Servicios HTTP para consumir la API REST
		pages/                    # Páginas/vistas
			invoices/               # Flujo de facturación
			queries/                # Consultas
			reports/                # Reportes
	environments/               # Configuración por entornos
public/                       # Assets públicos
```

## Instalación

1) Instalar dependencias:

```bash
npm install
```

## Configuración por entornos (environments)

Angular carga variables de entorno desde `src/environments/`.

Este proyecto usa la propiedad `environment.apiUrl` como **BASE_URL de la API**.

### Archivos

- `src/environments/environment.development.ts`: entorno local/desarrollo
- `src/environments/environment.ts`: entorno por defecto (en este repo está configurado como producción)
- `src/environments/environment.prod.ts`: entorno producción (ver plantilla abajo)

En `angular.json` se usan file replacements para que al ejecutar en desarrollo se reemplace `environment.ts` por `environment.development.ts`.

### Variable requerida (BASE_URL de la API)

- `apiUrl`: URL base de la API (por ejemplo: `https://localhost:7277/api` o `https://api.midominio.com/api/v1`)

### Plantilla solicitada (con `apiBaseUrl`)

Si tu estándar interno es usar `apiBaseUrl` (en lugar de `apiUrl`), puedes usar esta plantilla. Ten en cuenta que el código actual del proyecto referencia `environment.apiUrl`, por lo que deberías actualizar los servicios para leer `apiBaseUrl`.

`environment.ts` (desarrollo) ejemplo:

```ts
export const environment = {
	production: false,
	apiBaseUrl: 'https://localhost:7277/api',
};
```

`environment.prod.ts` (producción) ejemplo:

```ts
export const environment = {
	production: true,
	apiBaseUrl: 'https://api.midominio.com/api/v1',
};
```

## Ejecución en local

Levantar servidor de desarrollo (por defecto en `http://localhost:4200/`):

```bash
npm start
```

Notas:

- Puerto por defecto: `4200`
- Si el backend corre en otro host/puerto, actualiza `environment.development.ts` (BASE_URL) o configura un proxy (opcional).

## Tests

Ejecutar unit tests:

```bash
npm test
```

## Build (compilación)

Build de producción:

```bash
npm run build
```

El output se genera en `dist/RestaurantFrontend/` (por convención Angular: `dist/<nombre-proyecto>/`).

## Generación de artefacto para entrega (dist + zip)

1) Generar build:

```bash
npm run build
```

2) Empaquetar el contenido de `dist/RestaurantFrontend/`.

En Windows (PowerShell):

```powershell
Compress-Archive -Path .\dist\RestaurantFrontend\* -DestinationPath .\RestaurantFrontend-dist.zip -Force
```

En macOS/Linux (opcional):

```bash
cd dist/RestaurantFrontend
tar -czf ../../RestaurantFrontend-dist.tar.gz .
```

## Despliegue

Este frontend es una SPA; el servidor debe redirigir rutas desconocidas a `index.html`.

### Opción A: Servir con Nginx en VPS

1) Copiar el contenido de `dist/RestaurantFrontend/` al servidor (por ejemplo a `/var/www/restaurant-frontend`).
2) Configurar Nginx con fallback a `index.html`.

Ejemplo de configuración (SPA fallback):

```nginx
server {
	listen 80;
	server_name midominio.com;

	root /var/www/restaurant-frontend;
	index index.html;

	# Archivos estáticos
	location / {
		try_files $uri $uri/ /index.html;
	}

	# (Opcional) Proxy a la API para evitar CORS
	# Si tu frontend llama a /api/... y quieres que Nginx lo redirija al backend:
	# location /api/ {
	#   proxy_pass https://api.midominio.com/api/v1/;
	#   proxy_http_version 1.1;
	#   proxy_set_header Host $host;
	#   proxy_set_header X-Real-IP $remote_addr;
	#   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	#   proxy_set_header X-Forwarded-Proto $scheme;
	# }
}
```

### Opción B: Hosting estático (S3/CloudFront, Azure Static Web Apps, Netlify, Vercel, etc.)

Publicar el contenido de `dist/RestaurantFrontend/`.

Requisito clave: configurar “SPA rewrite/fallback” para que cualquier ruta (ej. `/reports`, `/invoices/123`) responda con `index.html`.

## Entregables incluidos

Para una entrega típica se recomienda incluir:

- Código fuente del frontend (este repositorio)
- Artefacto compilado: `dist/RestaurantFrontend/` comprimido (`RestaurantFrontend-dist.zip`)
- Este `README.md`



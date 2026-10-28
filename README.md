# Marnez + Arennea Landing V6.3.7

## Qué corrige esta versión
Cloudflare estaba ejecutando `npx wrangler deploy` y validando `assets.directory = ./public`, pero la carpeta `public` no siempre existía en el repositorio después de las cargas por navegador.

Esta versión usa un **custom build de Wrangler**. Antes de cada `wrangler deploy`, Cloudflare ejecuta automáticamente:

```bash
node prepare-public.mjs
```

Ese script crea `public/` desde los archivos de la raíz. Por lo tanto, aunque GitHub no conserve una carpeta `public`, el deploy la genera antes de validar los assets.

## Cómo subir a GitHub
Sube todos los archivos de esta carpeta a la raíz del repositorio, incluyendo:
- `index.html`
- `gestion-contenido-marnez-73f2.html`
- `worker.js`
- `prepare-public.mjs`
- `wrangler.jsonc`
- `package.json`
- `content.json`
- `styles.css`
- `script.js`
- imágenes

La carpeta `public/` puede existir o no en GitHub; se reconstruye en cada deploy.

## Después del deploy
Vincula el KV:
- Binding: `LANDING_KV`
- Namespace: `marnez-landing-content`

Editor oculto:
`/gestion-contenido-marnez-73f2.html`


## Actualización de landing
Se conservó la estructura y redacción base, agrupando visualmente Comunidad y Respaldo Marnez justo después del hero. Se añadieron CTA de “Agendar cita”, un bloque de contacto, botón flotante al desplazarse y animaciones discretas. Los CTA llevan al bloque de contacto / sección corporativa porque el proyecto no incluye un enlace o teléfono de agenda confirmado.

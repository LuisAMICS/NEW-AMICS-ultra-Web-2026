# amicsconsultinggroup.com — Pages

Contenido **prebuilt** de la web de Amics Consulting Group. Este repo solo publica;
el código fuente vive en `~/Sites/amics-web` (local de Luis).

- `site/` = salida de `npm run build:seo` del repo fuente (Vite + prerender a HTML estático
  de las 18 rutas EN/ES) + `404.html` (fallback SPA) + `.nojekyll`.
- Deploy: `scripts/deploy-pages.sh` en el repo fuente — build, sync, commit, push.
  El workflow de Actions sube `site/` tal cual a GitHub Pages.
- Dominio: configurado en Settings → Pages (`amicsconsultinggroup.com`). **No añadir
  ficheros CNAME a la raíz** — con build por workflow dispararía el builder legacy.
- La web anterior (Vite app buildada en CI) queda en el historial de git, pre-2026-08-03.

# VALE DE ENTREGA — PWA AGA
### Repositorio: `vgarcesb-cpu/VALE_ENTREGA`
### GitHub Pages: `https://vgarcesb-cpu.github.io/VALE_ENTREGA/`
### Desarrollado por: Toti's® | Academia de Guerra Aérea, FACH

---

## Descripción

Sistema PWA de registro y control de vales de entrega de equipos (BMI) para la Academia de Guerra Aérea. Permite emitir, registrar, firmar digitalmente y devolver equipos, generando un PDF imprimible en cada operación. Funciona completamente offline una vez instalado.

---

## Estructura del Repositorio

| Archivo | Descripción |
|---------|-------------|
| `index.html` | App principal — lógica, UI y estilos embebidos |
| `manifest.json` | Configuración PWA (nombre, íconos, modo standalone) |
| `sw.js` | Service Worker — caché offline cache-first |
| `icono.png` | Ícono PWA 512×512 (Academia de Guerra Aérea) |
| `README.md` | Este documento |
| `backup_local/` | Respaldo local de versiones anteriores |

---

## Flujo Operacional

### Estados del Vale

| Estado | Color | Significado |
|--------|-------|-------------|
| EN EMISIÓN | 🟡 Amarillo | Formulario nuevo, listo para llenar |
| EN CUSTODIA (REGISTRADO) | 🔴 Rojo | Equipo entregado y registrado en IDB |
| DEVOLUCIÓN COMPLETADA | 🟢 Verde | Equipo devuelto, ciclo cerrado |

### Secuencia Principal

```
FASE 1 — REGISTRO

   Llenar: equipo (BMI), responsable, observaciones
   ↓
   Firmar en canvas táctil
   ↓
   FINALIZAR Y REGISTRAR
   ↓
   Valida campos obligatorios
   ↓
   Guarda en IndexedDB → estado: REGISTRADO
   ↓
   Genera PDF automáticamente (800ms delay S25)
   ↓
   Modal confirmación: "Equipo en Custodia"
   ↓
   NUEVO PROCEDIMIENTO → limpia formulario


FASE 2 — DEVOLUCIÓN

   Ingresar folio en campo BUSCAR
   ↓
   BUSCAR → carga datos desde IndexedDB
   ↓
   Muestra estado EN CUSTODIA (rojo) + firma original
   ↓
   REGISTRAR DEVOLUCIÓN
   ↓
   Actualiza estado en IDB → DEVUELTO
   ↓
   Genera PDF automáticamente
   ↓
   Modal confirmación: "Devolución Completada"
   ↓
   NUEVO PROCEDIMIENTO → limpia formulario
```

### Botones por Estado

| Estado | FINALIZAR | DEVOLVER | NUEVO |
|--------|-----------|----------|-------|
| En emisión | ✅ Visible | ❌ Oculto | ✅ Visible |
| En custodia (vía BUSCAR) | ❌ Oculto | ✅ Visible | ✅ Visible |
| Devuelto | ❌ Oculto | ❌ Oculto | ✅ Visible |

---

## Arquitectura PWA

### Stack

- **HTML5 + CSS + Vanilla JS** — archivo único sin frameworks pesados
- **Tailwind CDN** — estilos utilitarios (requiere internet en primera carga)
- **IndexedDB** — persistencia local de vales
- **Canvas API** — firma digital táctil y mouse
- **Service Worker** — modo offline cache-first
- **Web App Manifest** — instalable en Android/iOS

### Flujo de Deploy

```
1. Desarrollar en Mac (Chrome/Safari + Git)
2. Subir a GitHub (editor web o git push)
3. Esperar deploy GitHub Pages (~2 min, check verde ✅)
4. Limpiar caché S25: Chrome → ⋮ → Configuración → Borrar datos de navegación → Caché
5. Probar en Samsung S25 el ciclo completo (juez definitivo)
```

### Service Worker — Versiones de Caché

Cada vez que se modifique un archivo, subir `CACHE_NAME` en `sw.js`:

```
v1 → v2 → v3 → v4 → v5 → v6 → v7 (actual)
```

> ⚠️ NUNCA agregar URLs externas (CDN) a `FILES_TO_CACHE`. El `cache.addAll()` es atómico: si una URL falla, todo el SW falla y la app queda sin IndexedDB.

---

## Correcciones Aplicadas

### Correcciones originales

| # | Tipo | Descripción |
|---|------|-------------|
| FALLO-001 | 🔴 Crítico | Sin `onerror` en IndexedDB — falla sin aviso |
| FALLO-002 | 🔴 Crítico | Sin guard `!db` en `buscarIDB()` |
| FALLO-003 | 🔴 Crítico | Sin guard `!db` en `finalizarProceso()` |
| FALLO-004 | 🔴 Crítico | Sin null-check en `devolverIDB()` |
| FALLO-005 | 🟠 Importante | `finalizarProceso` no mostraba `btnDevolver` |
| FALLO-006 | 🟡 Menor | `importarJSON` sin try/catch en JSON.parse |
| FALLO-007 | 🟡 Menor | `manifest.json` faltante — PWA no instalable |
| FALLO-008 | 🟡 Menor | Service Worker faltante — no funciona offline |

### Correcciones sesión 10-04-2026

| # | Tipo | Descripción | Fix aplicado |
|---|------|-------------|--------------|
| FALLO-A | 🔴 Crítico | `importarJSON()` sin guard `!db` | Guard agregado al inicio |
| FALLO-B | 🔴 Crítico | Tailwind CDN en `FILES_TO_CACHE` → SW falla atómicamente | Revertido — nunca cachear CDN externos |
| FALLO-C | 🔴 Crítico | `window.print()` con 500ms → firma en blanco en S25 | Cambiado a 800ms |
| FALLO-D | 🟠 Importante | `signatureImage.src` no se limpiaba en `nuevo()` → firma fantasma | `src = ''` agregado |
| FALLO-E | 🟠 Importante | `buscarIDB()` no actualizaba `signatureImage.src` + canvas 0px | `ajustarCanvas()` + `src = r.firma` |
| FALLO-F | 🟠 Importante | WhatsApp sin `encodeURIComponent()` → URL rota con tildes y grados | `encodeURIComponent` aplicado |
| FALLO-G | 🟠 Importante | `skipWaiting()` fuera de Promise → race condition en instalación SW | Encadenado dentro de `.then()` |
| FALLO-H | 🟡 Menor | Sin `tx.onerror` en 5 transacciones IDB → fallos silenciosos | `tx.onerror` agregado en todas |
| FALLO-I | 🟡 Menor | SW fallback devolvía HTML para cualquier recurso → error MIME | Restringido a `mode === 'navigate'` |
| FALLO-J | 🟡 Menor | `purpose: "any maskable"` en una entrada → ícono mal recortado Android | Separado en dos entradas |
| FALLO-K | 🟡 Menor | `short_name` de 14 chars → truncado en launchers Android | Reducido a 12 chars |
| FALLO-L | 🟡 Menor | Sin listener `orientationchange` → canvas mal dimensionado al rotar S25 | `screen.orientation` listener agregado |

**Total acumulado: 20 correcciones aplicadas**

---

## Fallos Típicos — Referencia PWA con Firma y PDF

Esta sección documenta los fallos más frecuentes en PWAs de este tipo para referencia futura.

### 🔴 IndexedDB

| Fallo | Causa | Fix |
|-------|-------|-----|
| App se congela sin aviso | Sin `request.onerror` global | Siempre agregar `onerror` al abrir IDB |
| Crash al operar rápido en S25 | `db` undefined (IDB no terminó de abrir) | Guard `if (!db) return alert(...)` en toda función que use IDB |
| Operación falla en silencio | Sin `tx.onerror` en la transacción | `tx.onerror = (e) => alert(e.target.error)` en cada `db.transaction()` |
| Datos perdidos sin aviso | Sin null-check al recuperar registro | `if (!r) return alert("No encontrado")` en todo `.onsuccess` |
| `JSON.parse` congela la app | Archivo de backup corrupto o editado | Siempre `try/catch` alrededor de `JSON.parse` |
| IDB llena sin aviso en S25 | Android limpia storage automáticamente | Detectar error de cuota en `onerror` y avisar al usuario |

### 🔴 Canvas y Firma Digital

| Fallo | Causa | Fix |
|-------|-------|-----|
| Canvas con dimensiones 0 | Medido antes de que el DOM renderice | `setTimeout(ajustarCanvas, 150)` antes de usar el canvas |
| Firma desproporcionada al rotar S25 | `resize` no siempre dispara en Android | Agregar `screen.orientation?.addEventListener('change', ...)` |
| `drawImage` no dibuja nada | Canvas sin dimensiones al cargar registro | Llamar `ajustarCanvas()` antes de `ctx.drawImage()` |
| Firma fantasma en nuevo vale | `signatureImage.src` no se limpia | `document.getElementById('signatureImage').src = ''` en `nuevo()` |
| PDF con firma incorrecta | `buscarIDB()` no actualiza `signatureImage.src` | Asignar `signatureImage.src = r.firma` dentro del `img.onload` |
| Eventos táctiles no funcionan en S25 | Listeners sin `{ passive: false }` | Agregar `{ passive: false }` en `touchstart` y `touchmove` |

### 🔴 PDF e Impresión

| Fallo | Causa | Fix |
|-------|-------|-----|
| PDF con firma en blanco | `window.print()` antes de que `signatureImage.src` repinte | `setTimeout(print, 800)` mínimo en S25 |
| Colores desaparecen en PDF | Falta `-webkit-print-color-adjust` | `print-color-adjust: exact !important` en elementos con color |
| Bordes de color no se imprimen | Sin `border` explícito en `@media print` | `border: 4px solid #000 !important` en `.status-box` |
| Pantalla blanca post-impresión en S25 | Diálogo de impresión interrumpe el render | Modal de confirmación con `setTimeout 1500ms` post-print |
| Canvas visible en PDF | `canvas` no se oculta en print | `#canvas { display: none !important }` en `@media print` |
| `signatureImage` no aparece en PDF | `display: none` no se revierte en print | `#signatureImage { display: block !important }` en `@media print` |

### 🔴 Service Worker

| Fallo | Causa | Fix |
|-------|-------|-----|
| App sin estilos offline | CDN externo no cacheado | Nunca poner URLs de CDN en `FILES_TO_CACHE` |
| CDN en cache rompe toda la instalación | `cache.addAll()` es atómico — una URL que falla cancela todo | Solo cachear archivos propios del repo |
| SW desactualizado en S25 | `CACHE_NAME` sin subir versión | Subir `v1 → v2 → ...` en cada deploy |
| Race condition en primera instalación | `skipWaiting()` fuera de la Promise | Encadenar `.then(() => self.skipWaiting())` |
| Error MIME en consola | SW devuelve HTML para peticiones de scripts/imágenes | Restringir fallback a `evt.request.mode === 'navigate'` |
| SW no se registra en iOS | Ruta absoluta en `register()` | Usar ruta relativa: `'./sw.js'` |

### 🔴 Manifest y Instalación PWA

| Fallo | Causa | Fix |
|-------|-------|-----|
| PWA no instalable en Android | Sin ícono 192×192 declarado | Agregar entrada `"sizes": "192x192"` en `icons[]` |
| Ícono mal recortado en launcher | `purpose: "any maskable"` en una sola entrada | Separar en dos entradas: `"purpose": "any"` y `"purpose": "maskable"` |
| Nombre truncado en launcher Android | `short_name` mayor a 12 caracteres | Máximo 12 caracteres en `short_name` |
| Android reinstala la PWA tras actualizar SW | Sin campo `id` en manifest | Agregar `"id": "/NOMBRE_REPO/"` |
| PWA no reconoce idioma | Sin `lang` en manifest | Agregar `"lang": "es", "dir": "ltr"` |

### 🔴 WhatsApp y Compartir

| Fallo | Causa | Fix |
|-------|-------|-----|
| Mensaje truncado o vacío | Texto sin `encodeURIComponent()` | `wa.me/?text=${encodeURIComponent(texto)}` |
| `&` corta la query string | Nombres con `&` o caracteres especiales | `encodeURIComponent` maneja todos los casos |
| Saltos de línea no funcionan | Usar `%0A` manual mezclado con texto | Usar `\n` en template literal + `encodeURIComponent` |
| URL malformada con tildes y ñ | Caracteres no ASCII sin encodear | `encodeURIComponent` obligatorio siempre |

### 🟠 Android S25 — Específicos

| Fallo | Causa | Fix |
|-------|-------|-----|
| IDB tarda más en abrirse | Hardware más lento en carga inicial | Guards `!db` en todas las funciones |
| Canvas pierde dimensiones al rotar | `resize` no dispara en todos los casos | `screen.orientation?.addEventListener('change', ...)` |
| Storage limpiado por Android | Sistema operativo libera espacio automáticamente | Detectar error de cuota, avisar, ofrecer exportar backup |
| Caché no se actualiza | SW viejo sigue activo | Subir `CACHE_NAME` + limpiar caché manualmente tras deploy |
| `window.print()` muy rápido | Repintado más lento que en Mac/Chrome desktop | `setTimeout(print, 800)` mínimo |

---

## Reglas de Desarrollo — Obligatorias

```
1. Single file: index.html + manifest.json + sw.js + icono.png
2. IndexedDB: SIEMPRE guard !db, tx.onerror, null-check en onsuccess
3. Canvas: NUNCA medir en carga inmediata → setTimeout(ajustarCanvas, 150)
4. Print: NUNCA window.print() inmediato → setTimeout(print, 800)
5. Service Worker: NUNCA URLs externas en FILES_TO_CACHE
6. Service Worker: SIEMPRE subir CACHE_NAME al hacer cambios
7. WhatsApp: SIEMPRE encodeURIComponent() en el texto
8. Flujo: Mac → GitHub Pages → Samsung S25 (juez definitivo)
9. Backup: EXPORTAR DB antes de cualquier modificación importante
10. Firma: ajustarCanvas() ANTES de ctx.drawImage() al cargar registros
```

---

## Entorno de Desarrollo

| Dispositivo | Rol |
|-------------|-----|
| Mac | Desarrollo principal (Chrome/Safari + Git) |
| GitHub Pages | Validación pública |
| Samsung S25 | Prueba final en terreno — juez definitivo |
| PC Windows | Consulta e impresión en oficina |
| WD MyCloud | Sync automático red local WiFi (pendiente) |

---

*Documentación generada — Proyecto Toti's® para Academia de Guerra Aérea, FACH*
*Última actualización: 10-04-2026*

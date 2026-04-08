# Vale de Entrega — AGA
### Repositorio: `vgarcesb-cpu/vale-de-entrega`
### GitHub Pages: `https://vgarcesb-cpu.github.io/vale-de-entrega/`

---

## Estructura del Repositorio

| Archivo | Descripción |
|---------|-------------|
| `index.html` | AGA Protocolo — app principal con Tailwind + PWA |
| `original.html` | Vale de Entrega — app con PWA y logo embebido |
| `manifest.json` | Configuración PWA (nombre, íconos, modo pantalla completa) |
| `sw.js` | Service Worker — caché offline (versión actual: v4) |
| `icon-192.png` | Ícono PWA 192×192 para pantalla de inicio |
| `icon-512.png` | Ícono PWA 512×512 alta resolución |
| `README.md` | Este documento |

---

## URLs de Acceso

- **AGA Protocolo (sin PWA):** `https://vgarcesb-cpu.github.io/vale-de-entrega/`
- **Vale de Entrega (con PWA):** `https://vgarcesb-cpu.github.io/vale-de-entrega/original.html`

---

## Flujo Operacional — index.html (AGA Protocolo)

### Estados

| Estado | Color | Significado |
|--------|-------|-------------|
| EN EMISIÓN | Amarillo | Formulario nuevo, listo para llenar |
| EN CUSTODIA (REGISTRADO) | Rojo | Equipo entregado y registrado en IDB |
| DEVOLUCIÓN COMPLETADA | Verde | Equipo devuelto, ciclo cerrado |

### Secuencia Principal

```
1. EMISIÓN
   └── Usuario llena: equipo, responsable, observaciones, firma
   └── Toca: FINALIZAR Y REGISTRAR
       └── Valida campos obligatorios
       └── Guarda en IndexedDB (estado: REGISTRADO)
       └── Imprime PDF automáticamente
       └── Modal: "Equipo en Custodia"
       └── Botón: NUEVO PROCEDIMIENTO → limpia formulario

2. CUSTODIA → DEVOLUCIÓN
   └── Usuario ingresa folio en campo BUSCAR
   └── Toca: BUSCAR
       └── Carga datos desde IndexedDB
       └── Muestra estado EN CUSTODIA (rojo)
       └── Aparece botón: REGISTRAR DEVOLUCIÓN
   └── Toca: REGISTRAR DEVOLUCIÓN
       └── Actualiza estado en IDB a DEVUELTO
       └── Imprime PDF automáticamente
       └── Modal: "Devolución Completada"
       └── Botón: NUEVO PROCEDIMIENTO → limpia formulario
```

### Botones por Estado

| Estado | FINALIZAR | DEVOLVER | NUEVO |
|--------|-----------|----------|-------|
| En emisión | ✅ Visible | ❌ Oculto | ✅ Visible |
| En custodia (vía BUSCAR) | ❌ Oculto | ✅ Visible | ✅ Visible |
| Devuelto | ❌ Oculto | ❌ Oculto | ✅ Visible |

### Acciones Independientes (cualquier momento)

| Acción | Función | Descripción |
|--------|---------|-------------|
| BUSCAR | `buscarIDB()` | Busca un folio en IndexedDB y carga los datos |
| WhatsApp | `enviarWhatsApp()` | Envía resumen por WhatsApp vía `wa.me` |
| NUEVO PROCEDIMIENTO | `nuevo()` | Limpia todo y genera nuevo folio |
| EXPORTAR DB | `exportarJSON()` | Descarga backup completo de IDB como .json |
| IMPORTAR DB | `importarJSON()` | Restaura backup desde archivo .json |

---

## Flujo Operacional — original.html (Vale de Entrega)

### Estados

| Estado | Color | Significado |
|--------|-------|-------------|
| EN EMISIÓN | Amarillo | Vale nuevo, listo para llenar |
| EN CUSTODIA | Rojo | Material entregado y registrado |
| DEVOLUCIÓN COMPLETADA | Verde | Material devuelto |

### Secuencia Principal

```
1. EMISIÓN
   └── Usuario llena: quien entrega, quien recibe, materiales, firmas
   └── Paso 1: Datos → Paso 2: Materiales → Paso 3: Firmas → Paso 4: PDF
   └── Toca: IMPRIMIR / GUARDAR PDF
       └── Genera PDF con window.print()

2. NUEVO VALE
   └── Toca: + Nuevo vale
       └── Limpia todos los campos
       └── Genera nuevo folio
       └── Vuelve al paso 1
```

---

## Arquitectura PWA

### Qué va dentro del HTML

| Elemento | Ubicación |
|----------|-----------|
| Logo AGA (base64 JPEG, ~60K chars) | Variable `LOGO` en JavaScript |
| CSS completo | Bloque `<style>` |
| JavaScript completo | Bloque `<script>` |
| Formularios y estructura | HTML |
| Meta tags PWA | `<head>` |

### Qué va como archivo externo

| Archivo | Referenciado desde | Función |
|---------|--------------------|---------|
| `manifest.json` | `<link rel="manifest">` | Configuración de instalación PWA |
| `sw.js` | `navigator.serviceWorker.register()` | Caché para modo offline |
| `icon-192.png` | `<link rel="icon">` y manifest | Ícono pantalla inicio |
| `icon-512.png` | `<link rel="icon">` y manifest | Ícono alta resolución |

### Service Worker — Gestión de Caché

Cada vez que se modifica un archivo del proyecto, se debe subir la versión del caché en `sw.js`:

```
v1 → v2 → v3 → v4 (versión actual)
```

Esto fuerza al navegador a descartar la versión vieja y descargar los archivos nuevos.

---

## Correcciones Aplicadas — index.html

| # | Tipo | Descripción |
|---|------|-------------|
| FALLO-001 | 🔴 Crítico | Sin `onerror` en IndexedDB — falla sin aviso |
| FALLO-002 | 🔴 Crítico | Sin guard `!db` en `buscarIDB()` |
| FALLO-003 | 🔴 Crítico | Sin guard `!db` en `finalizarProceso()` |
| FALLO-004 | 🔴 Crítico | Sin null-check en `devolverIDB()` |
| FALLO-005 | 🟠 Medio | `finalizarProceso` no mostraba `btnDevolver` |
| FALLO-006 | 🟡 Menor | `importarJSON` sin try/catch |
| FALLO-007 | 🟡 Menor | `manifest.json` faltante — PWA no instalable |
| FALLO-008 | 🟡 Menor | Service Worker faltante — no funciona offline |
| FIX-SW | 🟡 Menor | Ruta SW corregida: `/sw.js` → `./sw.js` |
| FIX-HIDDEN | 🟠 Medio | Clase Tailwind `hidden` conflicto con inline style |
| FIX-FLUJO | 🟠 Medio | Después de FINALIZAR → limpia con `nuevo()`, DEVOLVER solo vía BUSCAR |

---

## Correcciones Aplicadas — original.html

| # | Tipo | Descripción |
|---|------|-------------|
| FIX-LOGO | 🔴 Crítico | Base64 del logo truncado (457 → 59,945 chars) |
| FIX-MIME | 🟠 Medio | MIME type corregido: `image/png` → `image/jpeg` |
| FIX-ICON | 🟡 Menor | Referencia `icon-180.png` → `icon-192.png` |

---

## Entorno de Desarrollo

| Dispositivo | Uso |
|-------------|-----|
| Mac | Desarrollo principal (Chrome/Safari + Git) |
| GitHub Pages | Validación pública |
| Samsung S25 | Prueba final en terreno (juez definitivo) |
| PC Windows | Consulta e impresión en oficina |

### Flujo de Deploy

```
1. Desarrollar en Mac → probar localmente
2. Subir a GitHub Pages (Add file → Upload)
3. Esperar deploy (1-2 min, check verde)
4. Limpiar caché del S25 si hay PWA activa
5. Probar en S25
```

---

## Notas Importantes

- **Caché del S25:** Después de cada cambio con PWA activa, limpiar caché del navegador en el celular (Configuración → Privacidad → Borrar datos de navegación).
- **Service Worker:** Siempre subir la versión del `CACHE_NAME` en `sw.js` al hacer cambios.
- **Logo embebido:** El logo va como base64 dentro del HTML para funcionar sin archivos externos. El contenido es JPEG aunque la variable se llame LOGO.
- **Sin PWA:** Para evitar problemas de caché, usar la URL base sin `original.html`. Funciona igual sin modo offline.

---

*Documentación generada — Proyecto Toti's® para Academia de Guerra Aérea, FACH*

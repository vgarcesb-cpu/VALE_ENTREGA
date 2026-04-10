# AGA Protocolo — Protocolos de Custodia
### Repositorio: `vgarcesb-cpu/Protocolo_Vales`
### GitHub Pages: `https://vgarcesb-cpu.github.io/Protocolo_Vales/`

---

## Estructura del Repositorio

| Archivo | Descripción |
|---------|-------------|
| `index.html` | App principal — AGA Protocolo con Tailwind + PWA |
| `manifest.json` | Configuración PWA (nombre, íconos, modo pantalla completa) |
| `sw.js` | Service Worker — caché offline (versión actual: v4) |
| `icon-192.png` | Ícono PWA 192×192 para pantalla de inicio |
| `icon-512.png` | Ícono PWA 512×512 alta resolución |
| `README.md` | Este documento |

---

## Flujo Operacional

### Estados

| Estado | Color | Significado |
|--------|-------|-------------|
| EN EMISIÓN | 🟡 Amarillo | Formulario nuevo, listo para llenar |
| EN CUSTODIA (REGISTRADO) | 🔴 Rojo | Equipo entregado y registrado en IDB |
| DEVOLUCIÓN COMPLETADA | 🟢 Verde | Equipo devuelto, ciclo cerrado |

### Secuencia Principal

```
FASE 1 — REGISTRO

   Usuario llena: equipo, responsable, observaciones, firma
   ↓
   Toca: FINALIZAR Y REGISTRAR
   ↓
   Valida campos obligatorios (equipo + responsable)
   ↓
   Guarda en IndexedDB → estado: REGISTRADO
   ↓
   Imprime PDF automáticamente
   ↓
   Modal: "Equipo en Custodia"
   ↓
   Botón: NUEVO PROCEDIMIENTO → limpia formulario


FASE 2 — DEVOLUCIÓN

   Usuario ingresa folio en campo BUSCAR
   ↓
   Toca: BUSCAR
   ↓
   Carga datos desde IndexedDB
   ↓
   Muestra estado EN CUSTODIA (rojo)
   ↓
   Aparece botón: REGISTRAR DEVOLUCIÓN
   ↓
   Toca: REGISTRAR DEVOLUCIÓN
   ↓
   Actualiza estado en IDB → DEVUELTO
   ↓
   Imprime PDF automáticamente
   ↓
   Modal: "Devolución Completada"
   ↓
   Botón: NUEVO PROCEDIMIENTO → limpia formulario
```

### Botones por Estado

| Estado | FINALIZAR | DEVOLVER | NUEVO |
|--------|-----------|----------|-------|
| En emisión | ✅ Visible | ❌ Oculto | ✅ Visible |
| En custodia (vía BUSCAR) | ❌ Oculto | ✅ Visible | ✅ Visible |
| Devuelto | ❌ Oculto | ❌ Oculto | ✅ Visible |

### Acciones Independientes

| Acción | Función | Descripción |
|--------|---------|-------------|
| BUSCAR | `buscarIDB()` | Busca folio en IndexedDB y carga datos |
| WhatsApp | `enviarWhatsApp()` | Envía resumen por WhatsApp vía `wa.me` |
| NUEVO PROCEDIMIENTO | `nuevo()` | Limpia todo y genera nuevo folio |
| EXPORTAR DB | `exportarJSON()` | Descarga backup completo como .json |
| IMPORTAR DB | `importarJSON()` | Restaura backup desde archivo .json |

---

## Arquitectura PWA

### Dentro del HTML (embebido)

| Elemento | Descripción |
|----------|-------------|
| CSS | Tailwind CDN + estilos custom |
| JavaScript | Toda la lógica de la app |
| Formularios | Estructura HTML completa |
| Meta tags PWA | theme-color, apple-mobile-web-app |
| Modal confirmación | Aparece post-impresión (evita pantalla blanca S25) |

### Archivos Externos (en el repositorio)

| Archivo | Referenciado desde | Función |
|---------|--------------------|---------|
| `manifest.json` | `<link rel="manifest">` | Configuración instalación PWA |
| `sw.js` | `navigator.serviceWorker.register('./sw.js')` | Caché modo offline |
| `icon-192.png` | manifest.json | Ícono pantalla inicio |
| `icon-512.png` | manifest.json | Ícono alta resolución |

### Service Worker — Gestión de Caché

Cada vez que se modifica un archivo, subir versión en `sw.js`:

```
v1 → v2 → v3 → v4 (actual)
```

---

## Correcciones Aplicadas

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

**Total: 11 correcciones aplicadas**

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
2. Subir a GitHub (Add file → Upload files)
3. Esperar deploy GitHub Pages (1-2 min, check verde ✅)
4. Limpiar caché del S25 (Chrome → ⋮ → Configuración → Borrar datos)
5. Probar en S25 el ciclo completo
```

---

## Notas Importantes

- **Caché S25:** Después de cada cambio, limpiar caché del navegador en el celular.
- **Service Worker:** Siempre subir `CACHE_NAME` en `sw.js` al hacer cambios.
- **Tailwind CDN:** La primera carga requiere internet para descargar los estilos.
- **IndexedDB:** Los datos se guardan localmente en el dispositivo, no en el servidor.
- **Backup:** Usar EXPORTAR DB regularmente para respaldar los registros.

---

*Documentación generada — Proyecto Toti's® para Academia de Guerra Aérea, FACH*

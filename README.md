# VALE DE ENTREGA — PWA AGA
Sistema de Registro y Control de Vales de Entrega  
Academia de Guerra Aérea — Fuerza Aérea de Chile  
Desarrollado por Toti's® | vgarcesb-cpu.github.io/VALE_ENTREGA/

---

## CAMBIO DE NOMBRE PWA
Registro del proceso de cambio de nombre de la aplicación, desde **Protocolo_Vales** hacia **Vale de Entrega**, realizado el 09-04-2026.

### Pasos realizados en orden

**1. Edición de `index.html` en GitHub**

| Línea | Texto anterior | Texto nuevo |
|-------|----------------|-------------|
| 6 | `AGA PROTOCOLO \| TOTIS.CL MASTER` | `VALE DE ENTREGA \| TOTIS.CL` |
| 86 | `PROTOCOLOS AGA` | `VALE DE ENTREGA` |
| 387 | `*AGA PROTOCOLO*` | `*VALE DE ENTREGA*` |

**2. Edición de `manifest.json` en GitHub**

| Campo | Valor anterior | Valor nuevo |
|-------|----------------|-------------|
| `name` | `Protocolo AGA Totis` | `Vale de Entrega AGA` |
| `short_name` | `AGA Vales` | `Vale de Entrega` |

**3. Commit de todos los cambios**

Se realizó commit con `index.html` y `manifest.json` antes de renombrar el repositorio.

**4. Renombrado del repositorio en GitHub**

Ruta: `Settings → General → Repository name`

| Nombre anterior | Nombre nuevo |
|-----------------|--------------|
| `Protocolo_Vales` | `VALE_ENTREGA` |

Nueva URL de GitHub Pages:
```
https://vgarcesb-cpu.github.io/VALE_ENTREGA/
```

**5. Reinstalación de la PWA en Samsung S25**

- Se desinstalió la PWA anterior
- Se esperó ~2 minutos para propagación de GitHub Pages
- Se abrió la nueva URL en Chrome
- Se instaló nuevamente → Agregar a pantalla de inicio
- El ícono apareció con el nuevo nombre **Vale de Entrega** ✅

---

## CONFIGURACIÓN ENTORNO MAC
Registro de la configuración del entorno de desarrollo local realizada el 09-04-2026.

### Pasos realizados en orden

**1. Renombrar carpeta local**

```bash
mv ~/Desktop/Protocolo_Vales ~/Desktop/Vale_Entrega
cd ~/Desktop/Vale_Entrega
```

**2. Inicializar Git y conectar al repositorio**

La carpeta local no tenía Git inicializado — se configuró desde cero:

```bash
git init
git remote add origin https://github.com/vgarcesb-cpu/VALE_ENTREGA.git
```

**3. Sincronizar archivos desde GitHub**

```bash
mkdir backup_local && mv README.md index.html manifest.json sw.js backup_local/
git pull origin main
```

**4. Instalación de VS Code**

- Descargado desde https://code.visualstudio.com
- Idioma configurado en español: ⌘ + Shift + P → Configure Display Language → Español
- Carpeta Vale_Entrega abierta con ⌘ + O

**5. Corrección de `sw.js`**

| Línea | Cambio |
|-------|--------|
| 1 | `vale-entrega-v4` → `vale-entrega-v5` |
| Eliminadas | `./original.html`, `./icon-192.png`, `./icon-512.png` |
| Agregada | `./icono.png` |

**6. Generación de Token GitHub**

Ruta: `GitHub → Foto perfil → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)`

Configuración del token:
- Note: `Vale_Entrega Mac`
- Expiration: `90 days`
- Scope: `repo` ✅

⚠️ El token solo se muestra una vez — guardar captura en lugar privado y seguro.

**7. Primer push desde Mac**

```bash
git add .
git commit -m "sw.js actualizado a v5 con archivos correctos"
git push origin main
```

Username: `vgarcesb-cpu`  
Password: pegar el token generado

**8. Actualizar URL remota**

```bash
git remote set-url origin https://github.com/vgarcesb-cpu/VALE_ENTREGA.git
```

---

## FLUJO DE TRABAJO DESDE AHORA

```
1. Editar archivo en VS Code
2. Guardar con ⌘ + S
3. Abrir Terminal
4. cd ~/Desktop/Vale_Entrega
5. git add .
6. git commit -m "descripción del cambio"
7. git push origin main
8. Verificar en S25
```

---

## ⚠️ NOTAS IMPORTANTES

- El token GitHub expira en 90 días — generar uno nuevo en Developer settings cuando expire
- Siempre verificar cambios en Samsung S25 — es el juez definitivo
- Nunca compartir el token por WhatsApp ni correo
- Antes de editar, ejecutar `git pull origin main` para partir de la versión más reciente

---

*Documentado por Toti's® — Sistema PWA AGA | FACH | 09-04-2026*

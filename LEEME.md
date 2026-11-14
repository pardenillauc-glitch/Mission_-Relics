# Mission Relics: sitio web

Sitio estático para **https://missionrelics.earth/** (NASA Space Apps Challenge 2026).
No necesita servidor, base de datos ni compilación: se sube tal cual.

## Estructura

```
index.html              Página única (todas las secciones)
css/estilos.css         Estilos
js/datos.js             CONTENIDO editable: misiones, fechas, textos, video, juego
js/app.js               Lógica: navegación, mapa 3D, páginas de misión
vendor/three/           three.js r128 (local, sin depender de CDN). Licencia MIT
assets/texturas/        Mapas de NASA de la Luna, Marte, Tierra, Júpiter y Saturno
assets/modelos/         Modelos 3D oficiales (.glb)
assets/img/             Ícono y vista previa para redes sociales
juegos/ingenuity/       Aquí va el build WebGL de Unity (GennyMarsFlight)
videos/                 Videos ligeros (el corto se recomienda en YouTube)
```

## Secciones (rutas)

| Ruta | Contenido |
|---|---|
| `/` | Presentación con botón Iniciar |
| `/#explorar` | Mapa 3D: Luna, Marte, Júpiter, Saturno y sistema solar |
| `/#misiones` | Cronología de las siete misiones |
| `/#ingenuity` | Página inmersiva de Ingenuity (plantilla de referencia) |
| `/#lrv`, `/#voyager`, `/#sojourner`, `/#cassini`, `/#opportunity`, `/#dart` | Páginas de las demás misiones |
| `/#creditos` | Créditos y fuentes |

## Cómo publicar en Porkbun (Static Hosting)

**Opción A, archivo zip (la más rápida).** En Porkbun abre el dominio, entra a la
administración del Static Hosting y usa "Upload Zip File" con el zip de esta
carpeta. Los archivos deben quedar en la raíz (que `index.html` no quede dentro
de otra carpeta). Límite por subida: 40 MB.

**Opción B, GitHub Connect (recomendada para trabajar en equipo).** Sube esta
carpeta a un repositorio con `index.html` en la raíz del repositorio y conéctalo
desde el panel de Static Hosting. Cada cambio en la rama elegida se publica solo.

**Opción C, FTP.** Usa las credenciales que muestra Porkbun al activar el hosting.

## Probar en tu computadora

Por seguridad, el navegador no carga texturas ni modelos si abres `index.html`
con doble clic. Usa un servidor local desde esta carpeta:

```
python -m http.server 8000
```

y abre http://localhost:8000

## Agregar el cortometraje

1. Sube el video a YouTube (puede ser "No listado").
2. En `js/datos.js`, dentro de la misión `ingenuity`, en `media`, pon:
   `youtube:"https://www.youtube-nocookie.com/embed/ID_DEL_VIDEO"`

## Agregar el juego de Unity

1. En Unity: File > Build Settings > WebGL.
2. En Player Settings > Publishing Settings, activa **Decompression Fallback**
   (el hosting estático no envía los encabezados de compresión y sin esto el
   juego se queda en pantalla negra). Otra opción es Compression Format: Disabled.
3. Copia el contenido de la carpeta del build en `juegos/ingenuity/`
   (debe quedar `juegos/ingenuity/index.html`).
4. En `js/datos.js`, en `media` de `ingenuity`, pon: `game:"juegos/ingenuity/index.html"`
5. Si el build pesa más de 40 MB, súbelo por FTP o GitHub en lugar del zip.

## Mejorar la textura de la Luna

Descarga `lroc_color_poles_4k.jpg` del CGI Moon Kit (https://svs.gsfc.nasa.gov/4720),
renómbralo `luna.jpg` y reemplaza el de `assets/texturas/`.

## Créditos

Ver la sección `/#creditos` del sitio. Proyecto independiente; no es un sitio
oficial de NASA. No uses el logotipo de NASA en el sitio.

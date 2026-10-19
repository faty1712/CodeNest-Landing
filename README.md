# CodeNest Landing

Landing page institucional de CodeNest, una academia de programación orientada a personas que comienzan o buscan reinventarse en tecnología.

## Tecnologías

- HTML5 semántico y accesible
- CSS3 con variables, responsive design y `prefers-reduced-motion`
- Bootstrap 5.3.3 y Bootstrap Icons por CDN
- JavaScript vanilla para navegación, carrusel y validación progresiva del formulario

## Estructura

```text
.
├── index.html    # Contenido, SEO y componentes Bootstrap
├── styles.css    # Identidad visual y responsive
├── script.js     # Interacciones y validación del formulario
├── README.md
├── .gitignore
└── .github/
    └── ISSUE_TEMPLATE/ # Plantillas para reportes y mejoras
```

La página está organizada por secciones semánticas (`header`/navegación, `main`, `section` y `footer`) y usa componentes Bootstrap para la navegación responsive, acordeón, carrusel, grid y formularios. La identidad visual vive en `styles.css`, con variables reutilizables, estados de foco, contraste consistente y breakpoints móviles.

## Ejecución local

No requiere compilación ni dependencias locales. Para evitar restricciones del navegador con archivos remotos, sirve la carpeta con cualquier servidor estático:

```bash
python -m http.server 8000
```

Después abre <http://localhost:8000>.

## Formulario y despliegue

El formulario valida nombre, correo, ruta de interés y mensaje en el navegador; recorta espacios al enviar, limita la longitud de los campos y usa un campo trampa para reducir envíos automáticos. Los mensajes se envían a Formspree, que los entrega al correo verificado en la cuenta que creó el formulario. El endpoint está configurado en `script.js`.

Para recibir mensajes, verifica el correo receptor en la cuenta de Formspree. Si sustituyes el formulario, actualiza el endpoint en `script.js`. Envía una prueba desde la web publicada para comprobar la recepción.

La página puede desplegarse en GitHub Pages, Netlify, Vercel o cualquier hosting de archivos estáticos. Sustituye el dominio canónico y las URLs Open Graph de `index.html`, y cambia las URLs sociales de ejemplo por los perfiles oficiales.

### Publicación recomendada

1. Reemplaza `https://codenest.dev/` por el dominio real en `canonical`, `og:url` y la configuración de despliegue.
2. Cambia los perfiles sociales de ejemplo por los perfiles oficiales.
3. Configura y prueba el formulario de Formspree antes de publicar.
4. Sirve el sitio por HTTPS y comprueba las rutas internas, los enlaces externos y el formulario en un viewport móvil antes de publicar.

## Accesibilidad y calidad

- HTML semántico, enlace para saltar al contenido, labels asociados y mensajes de validación accesibles.
- Foco visible, controles del carrusel etiquetados, `alt` descriptivo y soporte para movimiento reducido.
- Imágenes no críticas con `loading="lazy"` y dimensiones declaradas para reducir cambios de layout.
- Navegación con estado activo, cierre del menú móvil y aviso alternativo cuando JavaScript está desactivado.
- Verificación recomendada: Lighthouse (Performance, Accessibility, Best Practices y SEO), W3C Nu HTML Checker y DevTools en viewport móvil.

## Nota sobre datos institucionales

Se conservaron los datos y textos existentes del proyecto. Las redes sociales usan destinos válidos de ejemplo y están marcadas en el HTML para ser reemplazadas por las cuentas oficiales antes de publicar.

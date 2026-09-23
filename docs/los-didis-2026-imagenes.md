# Imágenes del caso Los DiDis 2026

El diseño visual fue proporcionado por el cliente. El trabajo de KETING en este proyecto fue el desarrollo de todo el backend. La anonimización del pase es una edición de presentación para el portafolio, no la autoría del diseño original.

- Formulario: `public/portafolio/screenshots/los-didis-2026-formulario.webp`. Captura proporcionada por el usuario, con campos vacíos y textos de ejemplo; optimizada a WebP sin cambios de contenido.
- Pase: `public/portafolio/screenshots/los-didis-2026-pase-muestra.webp`. Versión anonimizada con la herramienta integrada `image_gen`, revisada visualmente y optimizada a WebP. El original con datos personales no se copió a `public`.
- Caso: `/casos/los-didis-2026` y `/en/case-studies/los-didis-2026`.

## Edición del pase

Se eliminaron nombre, apellidos, folio y la matriz QR completa. Fecha, sede y horario se sustituyeron por etiquetas neutras. La imagen y su pie identifican el resultado como una muestra sin validez para acceso.

Prompt final utilizado con la herramienta integrada (sin CLI):

> Use case: precise-object-edit. Edit target: the attached portrait Los DiDis 2026 event pass. Produce one sanitized portfolio version of this exact pass, preserving its orange gradient header, Los DiDis logo, typography, white background, proportions and layout. Remove ALL real attendee information from the pixels: erase the attendee's first and last name, the entire folio/UUID, and the entire original QR matrix. Also remove the specific date, venue and time and replace those lines with the neutral labels 'Fecha del evento', 'Sede del evento', and 'Horario del evento'. Replace the name lines with 'ASISTENTE DE MUESTRA' and 'Datos anonimizados'. Replace the folio line with 'Folio: MUESTRA'. In the space occupied by the original QR, put a simple pale gray square with the centered text 'QR OMITIDO' and a smaller line 'Vista de muestra'; do not draw any QR code or barcode and do not preserve any original QR pixels. Preserve 'GAFETE DE PRUEBA' below the logo. Preserve the bottom notice 'Pase de prueba, sin validez para acceso a un evento.' Preserve the instruction 'Conserva este gafete para el día del evento.' No added borders or new decorations. The result must contain no real person's name, no real ID, no scannable code, no original event date. Keep the whole pass visible without cropping.

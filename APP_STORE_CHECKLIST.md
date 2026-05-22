# Checklist de lanzamiento en la App Store — Atlas Luthor Workout

Análisis del estado actual de la app y todo lo necesario para publicarla en la
App Store de Apple. Marca cada casilla a medida que la completes.

## Diagnóstico de la app actual

- **Tipo:** PWA (Progressive Web App) en React 19 + Vite 7.
- **Despliegue actual:** Cloudflare Pages.
- **Datos:** todo se guarda en `localStorage` del dispositivo. No hay cuentas
  de usuario ni backend propio.
- **Funciones:** protocolo de entrenamiento, fotos de progreso, composición
  corporal, nutrición/agua, cardio, recordatorios y sincronización en la nube.
- **Estado de compilación:** `npm run build` pasa sin errores.

## Bloqueante principal: una PWA no se sube directamente a la App Store

Apple no acepta sitios web ni PWAs tal cual. Hay que envolver la app en un
contenedor nativo de iOS.

| Opción            | Esfuerzo | Notas                                                                 |
|-------------------|----------|-----------------------------------------------------------------------|
| **Capacitor**     | Medio    | Recomendado — ideal para Vite/React, da plugins nativos.              |
| PWABuilder        | Bajo     | Rápido, pero más riesgo de rechazo por "parecer web".                |
| WKWebView manual  | Alto     | Innecesario, reinventa la rueda.                                      |

> **Riesgo de rechazo más importante: Guideline 4.2 (Funcionalidad Mínima).**
> Apple rechaza apps que son "solo un sitio web reempaquetado". Hay que usar
> capacidades nativas reales (notificaciones locales nativas, selector de fotos
> nativo, haptics, splash screen). Capacitor cubre esto.

- [ ] Decidir el método de empaquetado (recomendado: **Capacitor**).
- [ ] Envolver la app en un proyecto nativo de iOS.

## 1. Cuenta y herramientas (obligatorio)

- [ ] Inscribirse en el **Apple Developer Program** (99 USD/año).
- [ ] Disponer de un **Mac con Xcode** (imprescindible para compilar y subir;
      no se puede hacer desde Linux ni desde la web).
- [ ] Configurar la app en **App Store Connect**.

## 2. Privacidad (crítico para la aprobación)

- [ ] Publicar una **política de privacidad** en una URL accesible
      (Guideline 5.1.1 — obligatoria).
- [ ] Rellenar la **etiqueta de privacidad** ("App Privacy") en App Store
      Connect declarando qué datos se recogen y para qué.
- [ ] Añadir el **Privacy Manifest** (`PrivacyInfo.xcprivacy`) — obligatorio.
- [ ] Añadir textos de uso en `Info.plist`:
      - `NSPhotoLibraryUsageDescription` (la app usa fotos de progreso).
      - `NSCameraUsageDescription` (si se permite tomar fotos con la cámara).
- [ ] **Revisar la sincronización en la nube.** Actualmente envía *todos* los
      datos del usuario (incluidas fotos) a un endpoint arbitrario y sin
      autenticación. Esto puede generar dudas en la revisión de Apple.
      Recomendado: documentarlo claramente en la política de privacidad y/o
      reforzar la seguridad (autenticación, cifrado, endpoint controlado).

## 3. Contenido legal y de salud (falta en la app)

- [ ] Añadir un **descargo de responsabilidad de salud** dentro de la app
      ("consulta a un médico antes de empezar un programa de ejercicio").
      Muy recomendado para apps de fitness.
- [ ] Añadir **términos de uso**.
- [ ] Crear una pantalla **"Acerca de"** con número de versión y enlaces a la
      política de privacidad y los términos (actualmente no existe).

## 4. Notificaciones

- [ ] Migrar los recordatorios de entrenamiento de la `Notification` API web
      (poco fiable dentro de un wrapper nativo) a **notificaciones locales
      nativas** mediante el plugin correspondiente de Capacitor.
- [ ] Solicitar el permiso de notificaciones de forma nativa.

## 5. Assets de la App Store

- [ ] **Icono de 1024×1024 px** para la tienda (sin transparencia, sin esquinas
      redondeadas). Actualmente solo existen los iconos de 192 y 512 px.
- [ ] **Capturas de pantalla** para iPhone 6.9" y 6.5"/6.7" (obligatorias).
- [ ] Definir nombre, subtítulo, descripción y keywords.
- [ ] Elegir categoría (**Health & Fitness**).
- [ ] Completar el cuestionario de **clasificación por edad**.
- [ ] Indicar una **URL de soporte** (y opcionalmente de marketing).

## 6. Detalles técnicos del contenedor nativo

- [ ] Configurar una **launch screen / splash screen**.
- [ ] Declarar el **export compliance** (`ITSAppUsesNonExemptEncryption`).
- [ ] **Auto-alojar las fuentes de Google** (ahora se cargan desde un CDN
      externo; en nativo conviene que funcionen offline).
- [x] Safe areas: la app ya usa `viewport-fit=cover` y `env()`.
- [ ] Probar la app en un **dispositivo iOS real** antes de enviarla.

## 7. Completitud de la app (Guideline 2.1)

- [ ] Verificar que no haya fallos ni cierres inesperados.
- [ ] Verificar que no quede contenido de relleno ("placeholder").
- [ ] Comprobar que todas las funciones operan correctamente en el wrapper.

## Lo que NO se necesita (no aplica a esta app)

- **Sign in with Apple:** la app no tiene inicio de sesión de terceros.
- **Borrado de cuenta dentro de la app:** la app no tiene cuentas de usuario.
- **App Tracking Transparency:** la app no rastrea al usuario entre apps.

## Estimación

- Trabajo de código + assets + privacidad: aproximadamente **1–2 semanas** con
  un Mac disponible.
- Revisión de Apple: normalmente **1–3 días**.

## Orden recomendado

1. Inscripción en el Apple Developer Program y preparación del Mac/Xcode.
2. Empaquetado con Capacitor.
3. Pantalla legal + descargo de salud + "Acerca de" dentro de la app.
4. Migración a notificaciones locales nativas.
5. Privacy Manifest, textos de `Info.plist` y política de privacidad.
6. Assets de la tienda (icono 1024, capturas, metadatos).
7. Pruebas en dispositivo real y envío a revisión.

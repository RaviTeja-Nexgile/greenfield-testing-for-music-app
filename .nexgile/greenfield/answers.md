# Requirements brief — Music Streaming Platform
## Profile
A full-stack music streaming application like Spotify where users can listen to music, create playlists, and upload their own songs. · web app · music streaming · size: large · depth: thorough · money, personalData, publicUsers, existingData, mockups
- **Has a user interface?** Yes (It is a music streaming app with screens for listening, searching, and managing playlists.)
- **Runs locally?** Yes (La aplicación sirve páginas web y una API que se pueden iniciar en la máquina del usuario para probarla)
## The app
Una aplicación web de streaming de música donde los usuarios escuchan canciones, crean playlists y reciben recomendaciones personalizadas, y donde los artistas suben sus propias canciones con audio, portada y metadatos. La app tiene suscripción de pago de 20 euros al mes, panel de administración para revisar las canciones subidas, y se despliega en AWS con React, Node.js, PostgreSQL y S3.
## Goals and success
- G1 Let users stream music, create playlists, and discover new songs (description)
- G2 Let users upload their own songs with audio files, cover images, and metadata (description)
- G3 Give users personalized recommendations based on what they listen to (description)
- M1 Reach 10,000 registered users within the first year of launch (10,000 registered users) (Q7)
- M2 Have at least 2,000 active daily listeners within the first year of launch (2,000 active daily listeners) (Q7)
- M3 Build a music library of 5,000 songs within the first year of launch (5,000 songs) (Q7)
## Roles
- R1 listener (10000) (description, Q2, Q8)
- R2 uploader (2000) (description, Q3, Q9)
- R3 admin (2) (description, assumption)
## Permissions
- R1 listener may escuchar canciones, crear playlists, marcar canciones como me gusta (assumption)
- R2 uploader may subir canciones, editar sus canciones subidas, eliminar sus canciones subidas (assumption)
- R3 admin may aprobar canciones subidas, rechazar canciones subidas, eliminar cualquier canción, gestionar usuarios (assumption)
## Modules
- MD1 Módulo de escucha y descubrimiento: escuchar música, crear playlists, recomendaciones [assumed] (assumption)
- MD2 Módulo de administración: panel de administración, gestión de canciones y usuarios [assumed] (assumption)
## Business events
- EV1 Un usuario sube una canción nueva [assumed] (assumption)
- EV2 Un usuario crea una playlist [assumed] (assumption)
- EV3 Un usuario escucha una canción completa [assumed] (assumption)
- EV4 Cada día a medianoche se recalculan las recomendaciones personalizadas [assumed] (assumption)
- EV5 Cada mes se factura la suscripción a los usuarios de pago [assumed] (assumption)
## Workflows
### W1 listen to music (release 1) — actors: R1 listener; trigger: user opens the app; outcome: user hears the song; how often: 10.000 veces al día; module: MD1 (description, assumption)
1. sign in
2. browse home page
3. search or pick a song
4. play the song
5. control playback
- X1 La canción no carga o se corta durante la reproducción [assumed] (assumption)
### W2 upload a song (release 1) — actors: R2 uploader; trigger: user wants to add a song; outcome: song is available to stream; how often: 50 veces al día; module: MD1 (description, assumption)
1. sign in
2. open upload page
3. pick audio file
4. pick cover image
5. enter title, artist, album, genre
6. submit
- X2 El archivo de audio no cumple el formato o el tamaño permitido [assumed] (assumption)
### W3 create a playlist (release 1) — actors: R1 listener; trigger: user wants to group songs; outcome: playlist is saved; how often: 200 veces al día; module: MD1 (description, assumption)
1. sign in
2. open playlists
3. create new playlist
4. name it
5. add songs
- X3 El usuario intenta añadir una canción que ya está en la playlist [assumed] (assumption)
### W4 descubrir música recomendada (release 1) — actors: R1 listener; trigger: el usuario abre la página de inicio; outcome: el usuario descubre y escucha una canción nueva; how often: 5.000 veces al día; module: MD1 [assumed] (assumption)
1. El usuario abre la app
2. La app muestra recomendaciones personalizadas basadas en su historial
3. El usuario toca una recomendación
4. La app reproduce la canción
5. El usuario puede guardarla en una playlist o marcarla como me gusta
- X4
- X4 El usuario no tiene suficiente historial para recibir recomendaciones [assumed] (assumption)
### W5 gestionar canciones subidas (release 1) — actors: R3 admin; trigger: el administrador abre el panel de administración; outcome: las canciones subidas quedan aprobadas o rechazadas; how often: 50 veces al día; module: MD2 [assumed] (assumption)
1. El administrador inicia sesión
2. Abre el panel de administración
3. Revisa las canciones subidas pendientes
4. Aprueba o rechaza cada canción
5. Si la rechaza, escribe el motivo
6. El usuario recibe una notificación con el resultado
- X5
- X5 Una canción subida infringe los derechos de autor [assumed] (assumption)
## Records
- E1 song. fields: audio file, cover image, title, artist, album, genre; states: pendiente de revisión → aprobada → rechazada; owner: R2; how many: 5.000 canciones en el primer año (description, assumption)
- E2 playlist. fields: name, songs; owner: R1; how many: 20.000 playlists en el primer año (description, assumption)
- E3 album. fields: title, artist, songs, cover image; owner: R2; how many: 500 álbumes en el primer año (description, assumption)
- E4 artist. fields: name, albums, songs; owner: R2; how many: 1.000 artistas en el primer año (description, assumption)
- E5 user profile. fields: name, liked songs, playlists; owner: R1; how many: 10.000 perfiles en el primer año (description, assumption)
## Rules
- BR1 Users can only upload songs they own the rights to. Applies: A user uploads a song they wrote and recorded themselves. Does not apply: A user tries to upload a song by a major artist they do not represent (Q3)
- BR2 Una canción subida queda pendiente de revisión hasta que un administrador la aprueba. Applies: Un usuario sube una canción propia y queda pendiente hasta que el administrador la revisa. Does not apply: Un administrador sube una canción directamente y queda aprobada al instante [assumed] (assumption)
- BR3 Solo los usuarios con suscripción de pago pueden escuchar el catálogo completo. Applies: Un usuario sin suscripción intenta escuchar una canción y la app le pide suscribirse. Does not apply: Un usuario con suscripción activa escucha cualquier canción sin restricciones [assumed] (assumption)
- BR4 Las recomendaciones se recalculan cada día a medianoche. Applies: Un usuario abre la app por la mañana y ve recomendaciones basadas en lo que escuchó ayer. Does not apply: Un usuario abre la app por la noche y ve las mismas recomendaciones que por la mañana [assumed] (assumption)
## Quality targets
- N1 [performance] Una canción empieza a sonar en menos de 2 segundos tras tocarla: 2 segundos [assumed] (assumption)
- N2 [performance] La búsqueda devuelve resultados en menos de 1 segundo: 1 segundo [assumed] (assumption)
- N3 [performance] La subida de una canción se completa en menos de 30 segundos: 30 segundos [assumed] (assumption)
## Reports
- RP1 Informe de canciones más escuchadas por semana, para decidir qué artistas destacar en la portada [assumed] (assumption)
- RP2 Informe de ingresos por suscripciones, para decidir si ajustar el precio o lanzar promociones [assumed] (assumption)
- RP3 Informe de canciones pendientes de revisión, para decidir cuántos administradores hacen falta [assumed] (assumption)
## Decisions
- **Stack:** React + Node.js + PostgreSQL + AWS S3 (decided by Greenfield; suggested: Escala bien a 50.000 usuarios, permite streaming de audio eficiente y es una combinación muy probada para aplicaciones de música) (Q12)
- **Deploy target:** AWS (decided by Greenfield; suggested: AWS ofrece S3 para el almacenamiento de audio, escalado automático y alta disponibilidad para una app de música con 10.000 usuarios) (Q13)
- **Mock-ups of the key screens first:** Yes, show the key screens first (the user's choice) (Q1)
## Assumptions
- A1 La suscripción de pago incluye todo el catálogo y subidas ilimitadas. — El precio de 20 euros al mes es alto para solo escuchar sin anuncios, y el modelo de negocio depende de que los usuarios suban canciones para llegar a 5.000 canciones.; high impact [assumed] (assumption, Q11)
## Risks
- K1 Un año después del lanzamiento, la app fracasó porque no llegó a las 5.000 canciones: los usuarios no subieron suficiente música propia y el catálogo se quedó corto frente a Spotify [assumed] (assumption)
- K2 Un año después del lanzamiento, la app fracasó porque los usuarios no pagaron la suscripción de 20 euros al mes al no ver suficiente valor frente a alternativas gratuitas [assumed] (assumption)
- K3 Un año después del lanzamiento, la app fracasó porque las recomendaciones no fueron buenas y los usuarios no descubrieron música nueva [assumed] (assumption)
## Other facts
- F1 The app must work on mobile and desktop with a responsive UI [devices] (description)
- F2 The app must support background playback [devices] (description)
- F3 The app needs secure cloud storage for audio files and cover images [files] (description)
- F4 The app needs deployment configuration [hosting] (description)
- F5 Anyone can sign up to listen [stakeholders] (Q2)
- F6 The app has a paid subscription only, no ads [money] (Q4)
- F7 No offline listening; streaming only [devices] (Q5)
- F8 The app does not show lyrics [scope] (Q6)
- F9 La suscripción cuesta 20 euros al mes [money] (Q10)
- F11 Hoy la música se escucha en Spotify, YouTube y archivos MP3 descargados; los artistas locales comparten sus canciones por WhatsApp y redes sociales [current] [assumed] (assumption)
- F12 Los mayores dolores de hoy son no encontrar música local en un solo lugar, no poder subir canciones propias con facilidad, y no tener recomendaciones personalizadas [current] [assumed] (assumption)
- F13 Hoy se usan Spotify, YouTube, WhatsApp y archivos MP3 en el teléfono [current] [assumed] (assumption)
- F14 El lanzamiento está previsto para dentro de 6 meses [scope] [assumed] (assumption)
- F15 El presupuesto de desarrollo es de 50.000 euros [scope] [assumed] (assumption)
- F16 No hay una tecnología fija obligatoria; se elige la que mejor encaje [scope] [assumed] (assumption)
- F17 Los productos más parecidos son Spotify, SoundCloud y Bandcamp [similar] [assumed] (assumption)
- F18 De Spotify se copia la experiencia de escucha fluida y las recomendaciones; de SoundCloud, la facilidad de subir canciones; de Bandcamp, el apoyo a artistas independientes [similar] [assumed] (assumption)
- F19 De Spotify se evita la complejidad excesiva y los anuncios; de SoundCloud, la falta de calidad en las recomendaciones; de Bandcamp, la interfaz anticuada [similar] [assumed] (assumption)
- F20 El administrador puede cambiar el precio de la suscripción, los géneros disponibles y los textos de la portada sin tocar el código [admin] [assumed] (assumption)
- F21 No hay ajustes por sitio o cliente; es una sola aplicación para todos los usuarios [admin] [assumed] (assumption)
- F22 El precio de la suscripción es de 20 euros al mes, impuestos incluidos [money] [assumed, high impact] (assumption)
- F23 No hay reembolsos; si un usuario se da de baja, mantiene el acceso hasta el final del mes pagado [money] [assumed, high impact] (assumption)
- F24 Se aplica el IVA español del 21% a las suscripciones [money] [assumed, high impact] (assumption)
- F25 La app emite facturas mensuales automáticas a los suscriptores [money] [assumed, high impact] (assumption)
- F26 Solo se aceptan euros; no hay soporte para otras monedas [money] [assumed, high impact] (assumption)
- F27 Los datos de tarjeta nunca tocan la app; los gestiona un proveedor de pagos externo [money] [assumed, high impact] (assumption)
- F28 En el momento más ocupado, 2.000 usuarios escuchan música a la vez [scale] [assumed] (assumption)
- F29 Las horas pico son de 18:00 a 22:00 entre semana y de 10:00 a 14:00 los fines de semana [scale] [assumed] (assumption)
- F30 En el primer año habrá 10.000 usuarios, 5.000 canciones y 20.000 playlists; en el tercer año, 50.000 usuarios, 25.000 canciones y 100.000 playlists [scale] [assumed] (assumption)
- F31 Una hora de caída cuesta 200 euros en suscripciones perdidas y usuarios que se van [availability] [assumed] (assumption)
- F32 Las ventanas de mantenimiento son los martes de 3:00 a 5:00 de la madrugada [availability] [assumed] (assumption)
- F33 Se puede perder como máximo 1 minuto de datos (RPO) y la app debe recuperarse en 30 minutos (RTO) [availability] [assumed] (assumption)
- F34 Los usuarios inician sesión con correo electrónico y contraseña, con opción de verificación en dos pasos [security] [assumed, high impact] (assumption)
- F35 El peor uso indebido sería que alguien subiera canciones con derechos de autor ajenos o robara cuentas de usuarios [security] [assumed, high impact] (assumption)
- F36 Los administradores no pueden ver las contraseñas de los usuarios; solo pueden restablecerlas [security] [assumed, high impact] (assumption)
- F37 La app guarda nombre, correo electrónico, historial de escucha, playlists y canciones subidas de cada usuario [privacy] [assumed, high impact] (assumption)
- F38 Los usuarios están en España y la Unión Europea; aplica el RGPD [privacy] [assumed, high impact] (assumption)
- F39 Los datos personales se guardan mientras la cuenta esté activa y se eliminan 30 días después de que el usuario la cierre [privacy] [assumed, high impact] (assumption)
- F40 Los usuarios pueden pedir que se eliminen sus datos y la app lo hace en un plazo de 30 días [privacy] [assumed, high impact] (assumption)
- F41 Los usuarios dan su consentimiento explícito al registrarse para el tratamiento de sus datos personales [privacy] [assumed, high impact] (assumption)
- F42 Se debe poder demostrar quién subió cada canción, cuándo la subió y quién la aprobó o rechazó [audit] [assumed, high impact] (assumption)
- F43 El registro de auditoría se guarda durante 2 años [audit] [assumed, high impact] (assumption)
- F44 La app cumple el nivel WCAG 2.2 AA de accesibilidad [access_i18n] [assumed] (assumption)
- F45 La app está en español e inglés [access_i18n] [assumed] (assumption)
- F46 No hay soporte para idiomas de derecha a izquierda [access_i18n] [assumed] (assumption)
- F47 La app usa la zona horaria de Madrid y el euro como moneda [access_i18n] [assumed] (assumption)
- F48 La app funciona en escritorio y móvil, con reproducción en segundo plano [devices] [assumed] (assumption)
- F49 No hay uso en el campo sin conexión; la app requiere conexión a internet [devices] [assumed] (assumption)
- F50 Cuando algo se rompe, se avisa al administrador por correo electrónico y por un canal de alertas interno [operations] [assumed] (assumption)
- F51 El soporte necesita ver el historial de escucha de un usuario, sus playlists y sus canciones subidas para resolver incidencias [operations] [assumed] (assumption)
- F52 El administrador puede actuar en nombre de un usuario para corregir un problema [operations] [assumed] (assumption)
- F53 No hay datos existentes que migrar; la app empieza de cero [migration] [assumed] (assumption)
- F54 En el primer lanzamiento van escuchar música, subir canciones, crear playlists y descubrir recomendaciones; el panel de administración va en el primer lanzamiento también [release] [assumed, high impact] (assumption)
## The interview
- Q2 [stakeholders · owner] Should the app let anyone sign up and listen, or is it invite-only? → Anyone can sign up
- Q3 [rules · owner] Can users upload any song, or only songs they own the rights to? → Only songs they own
- Q4 [money · owner] Should the app have ads, a paid subscription, or both? → Paid subscription only
- Q5 [devices · owner] Should users be able to download songs for offline listening? → No, streaming only
- Q6 [scope · owner] Should the app show lyrics while a song plays? → No lyrics
- Q7 [success · owner] A year after launch, what number would show the app worked? → My goal is to reach 10,000 registered users, have at least 2,000 active daily listeners, and build a music library of 5,000 songs within the first year of launch. This will show that people enjoy using the app and regularly listen to music on it.
- Q8 [stakeholders · negative] Of the 10,000 registered users you aim for in the first year, how many do you expect to be listeners who mainly stream music? → 10,000 listeners
- Q9 [stakeholders · negative] Of those 10,000 registered users, how many do you expect to upload their own songs? → 2,000 uploaders
- Q10 [money · finance] ¿Cuánto cobrarás al mes por la suscripción? → 20 euros al mes
- Q11 [money · finance] ¿Qué incluirá la suscripción de pago? → Decide for me (settled: Todo el catálogo y subidas ilimitadas)
## Decided by Greenfield (Enough, decide the rest)
- Q1 Should Greenfield show you mock-ups of the key screens before it builds? → Yes, show the key screens first
- Q12 ¿Con qué tecnología se construye la aplicación? → Decide for me (settled: React + Node.js + PostgreSQL + AWS S3)
- Q13 ¿Dónde se despliega la aplicación? → Decide for me (settled: AWS)

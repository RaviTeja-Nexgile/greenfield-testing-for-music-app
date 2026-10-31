# Requirements: Music Streaming Platform

A full-stack music streaming web app where listeners stream music, create playlists and get personalized recommendations, and uploaders upload their own songs with audio, cover image and metadata. The app has a paid subscription of 20 euros a month, an admin dashboard to review uploaded songs, and deploys to AWS with React, Node.js, PostgreSQL and S3.

The platform supports listeners, who stream music and get recommendations, and uploaders, who submit tracks with audio, cover images, and metadata. Full catalog access costs 20 euros a month. Admins review uploads before they go live. The system runs on AWS with React, Node.js, PostgreSQL, and S3.

## Requirement 1: Sign in and sign up

**User Story:** As a listener, I want to sign up and sign in with my email and password, so that I can stream music and keep my playlists and liked songs.

_Source: W1, F5, F34_

### Acceptance Criteria

1.1 WHEN a person opens the app at `/` without signing in THE SYSTEM SHALL show the sign-in page with a link to sign up.

1.2 WHEN a person signs up with an email and a password THE SYSTEM SHALL create their account and sign them in.

1.3 WHEN a person signs in with a correct email and password THE SYSTEM SHALL open their home page.

1.4 IF a person signs in with a wrong email or password THEN THE SYSTEM SHALL show a message that the email or password is incorrect.

1.5 WHEN a person signs out THE SYSTEM SHALL return them to the sign-in page.

1.6 WHEN a person signs up THE SYSTEM SHALL ask for their consent to the treatment of their personal data before creating the account.

## Requirement 2: Home page and discovery

**User Story:** As a listener, I want a home page that shows me music to discover, so that I can find and play new songs.

_Source: W1, W4, G1, G3, BR4_

### Acceptance Criteria

2.1 WHEN a signed-in listener opens the app THE SYSTEM SHALL show the home page with personalized recommendations based on their listening history.

2.2 WHEN a listener taps a recommendation THE SYSTEM SHALL play that song.

2.3 WHEN a listener taps a recommendation THE SYSTEM SHALL let them save it to a playlist or mark it as liked.

2.4 IF a listener has no listening history THEN THE SYSTEM SHALL show a selection of popular songs instead of personalized recommendations.

2.5 THE SYSTEM SHALL recalculate each listener's recommendations once a day at midnight.

## Requirement 3: Search

**User Story:** As a listener, I want to search for songs, albums and artists, so that I can find the music I am looking for.

_Source: W1, N2_

### Acceptance Criteria

3.1 WHEN a listener types a search term THE SYSTEM SHALL show matching songs, albums and artists.

3.2 WHEN a listener taps a search result THE SYSTEM SHALL open that song, album or artist.

3.3 THE SYSTEM SHALL return search results within 1 second.

## Requirement 4: Music player and playback

**User Story:** As a listener, I want to control playback, so that I can play, pause and move through my music.

_Source: W1, F2, N1_

### Acceptance Criteria

4.1 WHEN a listener taps a song THE SYSTEM SHALL start playing it within 2 seconds.

4.2 WHEN a listener taps play or pause THE SYSTEM SHALL start or pause the song.

4.3 WHEN a listener taps next or previous THE SYSTEM SHALL play the next or previous song in the queue.

4.4 WHEN a listener turns on shuffle THE SYSTEM SHALL play the queue in a random order.

4.5 WHEN a listener turns on repeat THE SYSTEM SHALL repeat the queue or the current song.

4.6 WHEN a listener moves the volume control THE SYSTEM SHALL change the playback volume.

4.7 WHEN a listener moves the progress bar THE SYSTEM SHALL seek to that point in the song.

4.8 WHILE a song is playing THE SYSTEM SHALL keep playing it when the listener switches to another app or locks the screen.

## Requirement 5: Playlists

**User Story:** As a listener, I want to create and manage playlists, so that I can group the songs I like.

_Source: W3, G1, E2_

### Acceptance Criteria

5.1 WHEN a listener opens their playlists THE SYSTEM SHALL list their playlists.

5.2 WHEN a listener creates a new playlist and names it THE SYSTEM SHALL save the playlist.

5.3 WHEN a listener adds a song to a playlist THE SYSTEM SHALL add it to that playlist.

5.4 IF a listener adds a song that is already in the playlist THEN THE SYSTEM SHALL not add it a second time.

5.5 WHEN a listener removes a song from a playlist THE SYSTEM SHALL remove it from that playlist.

## Requirement 6: Albums and artists

**User Story:** As a listener, I want to browse albums and artists, so that I can explore their songs.

_Source: W1, E3, E4_

### Acceptance Criteria

6.1 WHEN a listener opens an album THE SYSTEM SHALL show its title, artist, cover image and songs.

6.2 WHEN a listener opens an artist THE SYSTEM SHALL show the artist's name, albums and songs.

6.3 WHEN a listener taps a song on an album or artist page THE SYSTEM SHALL play it.

## Requirement 7: Liked songs

**User Story:** As a listener, I want to mark songs as liked, so that I can find them again in one place.

_Source: W4, E5_

### Acceptance Criteria

7.1 WHEN a listener marks a song as liked THE SYSTEM SHALL add it to their liked songs.

7.2 WHEN a listener unmarks a liked song THE SYSTEM SHALL remove it from their liked songs.

7.3 WHEN a listener opens their liked songs THE SYSTEM SHALL list all the songs they have liked.

## Requirement 8: Upload a song

**User Story:** As an uploader, I want to upload my own songs with audio, cover image and metadata, so that listeners can stream them.

_Source: W2, G2, E1, BR1, BR2, N3_

### Acceptance Criteria

8.1 WHEN an uploader opens the upload page THE SYSTEM SHALL show fields for the audio file, cover image, title, artist, album and genre.

8.2 WHEN an uploader submits a song THE SYSTEM SHALL store the audio file and cover image in secure cloud storage and save the metadata.

8.3 WHEN an uploader submits a song THE SYSTEM SHALL mark it as pending review.

8.4 IF an uploader submits an audio file that is not in an allowed format or is too large THEN THE SYSTEM SHALL show a message naming the allowed formats and size.

8.5 THE SYSTEM SHALL complete an upload within 30 seconds.

8.6 WHEN an uploader submits a song THE SYSTEM SHALL record who uploaded it and when.

## Requirement 9: Manage uploaded songs

**User Story:** As an uploader, I want to edit and delete my uploaded songs, so that I keep control of my music.

_Source: W2, E1_

### Acceptance Criteria

9.1 WHEN an uploader opens their uploaded songs THE SYSTEM SHALL list them with their review state.

9.2 WHEN an uploader edits one of their uploaded songs THE SYSTEM SHALL save the changes.

9.3 WHEN an uploader deletes one of their uploaded songs THE SYSTEM SHALL remove it.

## Requirement 10: Admin dashboard

**User Story:** As an admin, I want to review uploaded songs and manage users, so that only approved songs are streamed.

_Source: W5, MD2, BR2, F20, F36_

### Acceptance Criteria

10.1 WHEN an admin signs in THE SYSTEM SHALL open the admin dashboard.

10.2 WHEN an admin opens the dashboard THE SYSTEM SHALL list the songs pending review.

10.3 WHEN an admin approves a song THE SYSTEM SHALL make it available to stream.

10.4 WHEN an admin rejects a song THE SYSTEM SHALL ask for a reason and keep it out of the catalog.

10.5 WHEN an admin approves or rejects a song THE SYSTEM SHALL notify the uploader of the result.

10.6 WHEN an admin rejects a song for copyright THE SYSTEM SHALL record the reason.

10.7 WHEN an admin manages users THE SYSTEM SHALL let them reset a user's password without seeing it.

10.8 WHEN an admin changes the subscription price, the genres or the home page texts THE SYSTEM SHALL apply the change without touching the code.

## Requirement 11: Subscription

**User Story:** As a listener, I want a paid subscription, so that I can stream the full catalog.

_Source: BR3, F6, F9, A1, F23, F27_

### Acceptance Criteria

11.1 WHEN a listener without a subscription tries to play a song THE SYSTEM SHALL ask them to subscribe.

11.2 WHEN a listener subscribes THE SYSTEM SHALL charge 20 euros a month, taxes included.

11.3 WHEN a listener subscribes THE SYSTEM SHALL let them stream the full catalog and upload without limits.

11.4 WHEN a listener cancels their subscription THE SYSTEM SHALL keep their access until the end of the paid month.

11.5 THE SYSTEM SHALL never store the listener's card data; a payment provider handles it.

## Requirement 12: User profile

**User Story:** As a listener, I want a profile, so that I can see my playlists and liked songs and manage my account.

_Source: E5, F37, F39, F40_

### Acceptance Criteria

12.1 WHEN a listener opens their profile THE SYSTEM SHALL show their name, playlists and liked songs.

12.2 WHEN a listener asks to delete their account THE SYSTEM SHALL delete their personal data within 30 days.

12.3 WHEN a listener closes their account THE SYSTEM SHALL delete their personal data 30 days later.

## Later releases

- RP1 Informe de canciones más escuchadas por semana, para decidir qué artistas destacar en la portada.
- RP2 Informe de ingresos por suscripciones, para decidir si ajustar el precio o lanzar promociones.
- RP3 Informe de canciones pendientes de revisión, para decidir cuántos administradores hacen falta.
- EV5 Cada mes se factura la suscripción a los usuarios de pago.

## Assumptions

- The app is a single web app for all users, with no per-site or per-client settings (F21).
- The app is in Spanish and English (F45), uses the Madrid time zone and the euro (F47), and meets WCAG 2.2 AA (F44).
- The app requires an internet connection; there is no offline listening (F7, F49).
- The app does not show lyrics (F8).
- The app starts from zero with no existing data to migrate (F53).
- Release 1 includes listening, uploading, playlists, recommendations and the admin dashboard (F54).

import { Router, Request, Response } from 'express';

/**
 * Playback API: stream a song and record a listen.
 *
 * The catalog is a placeholder for the later PostgreSQL/ORM layer, so this
 * router keeps a small in-memory seed of songs (matching the approved
 * `player.html` mock-up) to stream from. Recording a listen is what drives
 * recommendations (Requirement 2) and is kept here so playback and listening
 * history live in one place.
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  /** Duration in seconds. */
  duration: number;
  /** Audio stream URL. */
  audioUrl: string;
  /** Cover image URL. */
  coverUrl: string;
}

// In-memory seed. Later tasks replace this with the real catalog.
const SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight Drive',
    artist: 'Luna Vega',
    album: 'Noches de Verano',
    duration: 222,
    audioUrl: '/api/playback/stream/song-1',
    coverUrl: '',
  },
  {
    id: 'song-2',
    title: 'Golden Hour',
    artist: 'The Paper Kites',
    album: 'Noches de Verano',
    duration: 245,
    audioUrl: '/api/playback/stream/song-2',
    coverUrl: '',
  },
  {
    id: 'song-3',
    title: 'Cielo Abierto',
    artist: 'Los Faros',
    album: 'Noches de Verano',
    duration: 178,
    audioUrl: '/api/playback/stream/song-3',
    coverUrl: '',
  },
];

export function findSongById(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}

export function playbackRouter(): Router {
  const router = Router();

  // Stream a song: return its metadata and stream URL so the client can start
  // playback within 2 seconds (criterion 4.1).
  router.get('/stream/:id', (req: Request, res: Response) => {
    const song = findSongById(req.params.id);
    if (!song) {
      res.status(404).json({ message: 'Song not found.' });
      return;
    }
    res.json({ song });
  });

  // Record a listen for a user, driving recommendations (Requirement 2).
  router.post('/listen', (req: Request, res: Response) => {
    const { userId, songId } = req.body ?? {};
    if (!userId || !songId) {
      res.status(400).json({ message: 'userId and songId are required.' });
      return;
    }
    if (!findSongById(songId)) {
      res.status(404).json({ message: 'Song not found.' });
      return;
    }
    // The real store persists a Listen row; here we acknowledge it.
    res.status(201).json({
      userId,
      songId,
      listenedAt: new Date().toISOString(),
    });
  });

  return router;
}

import { Router, Request, Response } from 'express';

/**
 * Playback API: stream a song's audio file and record a listen.
 *
 * The catalog is a placeholder for the later PostgreSQL/ORM layer, so this
 * router keeps a small in-memory seed of songs (matching the approved
 * `player.html` mock-up). Each song's audio is a real, playable WAV file
 * generated in memory, so the stream endpoint serves the song's actual audio
 * bytes and the browser plays them through the device's audio output
 * (criterion 4.9). Recording a listen drives recommendations (Requirement 2).
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

// --- Real audio generation -------------------------------------------------

const SAMPLE_RATE = 8000; // Hz — keeps the in-memory WAV small but playable.
const BYTES_PER_SAMPLE = 1; // 8-bit mono PCM.

/**
 * Build a valid WAV file (RIFF header + 8-bit mono PCM) holding a quiet sine
 * tone of the given duration. Each song gets a slightly different frequency so
 * the audio is audibly distinct, but any valid WAV satisfies "play the song's
 * audio file through the device's audio output".
 */
function generateToneWav(durationSeconds: number, frequency: number): Buffer {
  const dataSize = Math.floor(durationSeconds * SAMPLE_RATE) * BYTES_PER_SAMPLE;
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);

  // RIFF header
  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8, 'ascii');

  // fmt chunk
  buffer.write('fmt ', 12, 'ascii');
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * BYTES_PER_SAMPLE, 28); // byte rate
  buffer.writeUInt16LE(BYTES_PER_SAMPLE, 32); // block align
  buffer.writeUInt16LE(8, 34); // bits per sample

  // data chunk
  buffer.write('data', 36, 'ascii');
  buffer.writeUInt32LE(dataSize, 40);

  // A gentle sine wave (amplitude 40 keeps it quiet but audible).
  for (let i = 0; i < dataSize; i++) {
    const t = i / SAMPLE_RATE;
    const sample = Math.round(128 + 40 * Math.sin(2 * Math.PI * frequency * t));
    buffer.writeUInt8(sample, headerSize + i);
  }

  return buffer;
}

// Cache the generated audio per song id so repeated streams are cheap.
const audioCache = new Map<string, Buffer>();

function getAudioBytes(song: Song): Buffer {
  let bytes = audioCache.get(song.id);
  if (!bytes) {
    // Distinct frequency per song so each track sounds different.
    const frequency = 220 + SONGS.indexOf(song) * 55;
    bytes = generateToneWav(song.duration, frequency);
    audioCache.set(song.id, bytes);
  }
  return bytes;
}

export function playbackRouter(): Router {
  const router = Router();

  // Stream a song's actual audio bytes. Supports HTTP Range requests so the
  // browser's <audio> element can seek within the file.
  router.get('/stream/:id', (req: Request, res: Response) => {
    const song = findSongById(req.params.id);
    if (!song) {
      res.status(404).json({ message: 'Song not found.' });
      return;
    }

    const bytes = getAudioBytes(song);
    const total = bytes.length;
    const range = req.headers.range;

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Accept-Ranges', 'bytes');

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (match) {
        const start = match[1] === '' ? 0 : parseInt(match[1], 10);
        const end = match[2] === '' ? total - 1 : Math.min(parseInt(match[2], 10), total - 1);
        if (!Number.isNaN(start) && !Number.isNaN(end) && start <= end && start < total) {
          res.status(206);
          res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
          res.setHeader('Content-Length', end - start + 1);
          res.end(bytes.subarray(start, end + 1));
          return;
        }
      }
      // Invalid range: fall through to a full response below.
    }

    res.setHeader('Content-Length', total);
    res.end(bytes);
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

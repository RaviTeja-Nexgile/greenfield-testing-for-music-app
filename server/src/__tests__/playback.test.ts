import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { findSongById } from '../routes/playback.js';

describe('playback endpoints', () => {
  describe('GET /api/playback/stream/:id', () => {
    it('returns the song metadata for a known song', async () => {
      const app = createApp();
      const res = await request(app).get('/api/playback/stream/song-1');
      expect(res.status).toBe(200);
      expect(res.body.song.id).toBe('song-1');
      expect(res.body.song.title).toBe('Midnight Drive');
      expect(res.body.song.artist).toBe('Luna Vega');
      expect(res.body.song.duration).toBe(222);
    });

    it('returns 404 for an unknown song', async () => {
      const app = createApp();
      const res = await request(app).get('/api/playback/stream/nope');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Song not found.');
    });
  });

  describe('POST /api/playback/listen', () => {
    it('records a listen for a known song', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/api/playback/listen')
        .send({ userId: 'u_test', songId: 'song-1' });
      expect(res.status).toBe(201);
      expect(res.body.userId).toBe('u_test');
      expect(res.body.songId).toBe('song-1');
      expect(res.body.listenedAt).toBeTruthy();
    });

    it('returns 400 when userId or songId is missing', async () => {
      const app = createApp();
      const res = await request(app).post('/api/playback/listen').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('userId and songId are required.');
    });

    it('returns 404 for an unknown song', async () => {
      const app = createApp();
      const res = await request(app)
        .post('/api/playback/listen')
        .send({ userId: 'u_test', songId: 'nope' });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Song not found.');
    });
  });

  describe('findSongById', () => {
    it('finds a seeded song', () => {
      expect(findSongById('song-2')?.title).toBe('Golden Hour');
    });

    it('returns undefined for an unknown id', () => {
      expect(findSongById('missing')).toBeUndefined();
    });
  });
});

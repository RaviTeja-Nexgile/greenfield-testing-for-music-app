import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { findSongById } from '../routes/playback.js';

describe('playback endpoints', () => {
  describe('GET /api/playback/stream/:id', () => {
    it('streams the song audio bytes as a WAV file', async () => {
      const app = createApp();
      const res = await request(app).get('/api/playback/stream/song-1');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('audio/wav');
      expect(res.headers['accept-ranges']).toBe('bytes');
      // A valid WAV starts with the RIFF/WAVE magic bytes.
      const body = res.body as Buffer;
      expect(body.subarray(0, 4).toString('ascii')).toBe('RIFF');
      expect(body.subarray(8, 12).toString('ascii')).toBe('WAVE');
      // The audio length matches the song's duration (8-bit mono @ 8 kHz).
      const expectedSize = 44 + 222 * 8000;
      expect(body.length).toBe(expectedSize);
    });

    it('supports HTTP Range requests for seeking', async () => {
      const app = createApp();
      const res = await request(app)
        .get('/api/playback/stream/song-1')
        .set('Range', 'bytes=0-99');
      expect(res.status).toBe(206);
      expect(res.headers['content-range']).toBe('bytes 0-99/1776044');
      expect(res.headers['content-length']).toBe('100');
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

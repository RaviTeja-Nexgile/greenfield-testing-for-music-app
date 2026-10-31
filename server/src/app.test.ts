import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

describe('health endpoint', () => {
  it('returns ok on /api/health', async () => {
    const app = createApp();
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('music-streaming-platform');
  });
});

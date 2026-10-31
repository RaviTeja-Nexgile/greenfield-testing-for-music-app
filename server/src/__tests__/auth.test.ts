import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { createApp } from '../app.js';

// Point the file-backed store at a throwaway directory so these tests never
// touch the seeded test logins or collide with other tasks' tests running in
// parallel against the same database.
const DATA_DIR = mkdtempSync(join(tmpdir(), 'resonance-auth-'));
process.env.DATA_DIR = DATA_DIR;

const app = createApp();

function uniqueEmail(prefix = 'user'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

describe('auth endpoints', () => {
  describe('POST /api/auth/signup', () => {
    it('creates an account and returns a token when consent is given', async () => {
      const email = uniqueEmail('signup');
      const res = await request(app).post('/api/auth/signup').send({
        name: 'Test Listener',
        email,
        password: 'password123',
        consent: true,
      });
      expect(res.status).toBe(201);
      expect(res.body.token).toBeTruthy();
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.role).toBe('listener');
    });

    it('rejects signup without consent', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        name: 'No Consent',
        email: uniqueEmail('noconsent'),
        password: 'password123',
        consent: false,
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/consent/i);
    });

    it('rejects a short password', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: uniqueEmail('short'),
        password: 'short',
        consent: true,
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/password/i);
    });

    it('rejects a duplicate email', async () => {
      const email = uniqueEmail('dup');
      const first = await request(app).post('/api/auth/signup').send({
        email,
        password: 'password123',
        consent: true,
      });
      expect(first.status).toBe(201);

      const second = await request(app).post('/api/auth/signup').send({
        email,
        password: 'password123',
        consent: true,
      });
      expect(second.status).toBe(409);
    });
  });

  describe('POST /api/auth/signin', () => {
    const email = uniqueEmail('signin');
    const password = 'password123';

    beforeAll(async () => {
      await request(app).post('/api/auth/signup').send({
        email,
        password,
        consent: true,
      });
    });

    it('signs in with a correct email and password', async () => {
      const res = await request(app).post('/api/auth/signin').send({ email, password });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
      expect(res.body.user.email).toBe(email);
    });

    it('rejects a wrong password with the same message', async () => {
      const res = await request(app).post('/api/auth/signin').send({
        email,
        password: 'wrong-password',
      });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Email or password is incorrect.');
    });

    it('rejects an unknown email with the same message', async () => {
      const res = await request(app).post('/api/auth/signin').send({
        email: uniqueEmail('unknown'),
        password: 'password123',
      });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Email or password is incorrect.');
    });
  });

  describe('POST /api/auth/signout', () => {
    it('returns a confirmation', async () => {
      const res = await request(app).post('/api/auth/signout').send({});
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Signed out.');
    });
  });
});

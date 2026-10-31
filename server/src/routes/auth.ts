import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserByEmail, createUser } from '../auth/store.js';
import { verifyPassword } from '../auth/users.js';

const MIN_PASSWORD_LENGTH = 8;

function signToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' },
  );
}

export function authRouter(): Router {
  const router = Router();

  router.post('/signup', async (req: Request, res: Response) => {
    const { name, email, password, consent } = req.body ?? {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ message: 'A valid email is required.' });
      return;
    }
    if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
      return;
    }
    if (consent !== true) {
      res.status(400).json({ message: 'Consent to the treatment of your personal data is required.' });
      return;
    }
    if (findUserByEmail(email)) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const user = await createUser({
      name: typeof name === 'string' && name.trim() ? name.trim() : email.split('@')[0],
      email,
      password,
      role: 'listener',
      consent: true,
    });

    res.status(201).json({
      token: signToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });

  router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      res.status(400).json({ message: 'Email or password is incorrect.' });
      return;
    }

    const user = findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ message: 'Email or password is incorrect.' });
      return;
    }

    res.json({
      token: signToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });

  router.post('/signout', (_req: Request, res: Response) => {
    // JWT is stateless; the client discards its token. This endpoint exists so
    // the sign-out action has a server round-trip and future server-side
    // revocation can be added here.
    res.json({ message: 'Signed out.' });
  });

  return router;
}

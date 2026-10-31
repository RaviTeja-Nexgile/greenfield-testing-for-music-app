import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { playbackRouter } from './routes/playback.js';
import { authRouter } from './routes/auth.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'music-streaming-platform', time: new Date().toISOString() });
  });

  app.use('/api/playback', playbackRouter());
  app.use('/api/auth', authRouter());

  return app;
}

export function startServer() {
  const app = createApp();
  const server = app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Resonance API listening on http://localhost:${config.port}`);
  });
  return server;
}

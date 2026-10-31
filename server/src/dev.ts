import { seed } from './seed.js';
import { startServer } from './app.js';

// `npm run dev` entry: seed the test logins into an empty database first,
// then start the API. Greenfield runs only `npm run dev` against a fresh
// copy, so the logins it lists must exist before the app starts.
seed()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed, aborting startup:', err);
    process.exit(1);
  });

import { TEST_LOGINS, hashPassword } from './auth/users.js';
import { upsertUser, findUserByEmail } from './auth/store.js';

// Seeds the three test logins from design.md into the (empty) local store.
// `npm run dev` runs this before starting the server so the logins Greenfield
// lists always work against a fresh database.
export async function seed(): Promise<void> {
  for (const login of TEST_LOGINS) {
    if (findUserByEmail(login.email)) {
      continue;
    }
    const passwordHash = await hashPassword(login.password);
    upsertUser({
      name: login.name,
      email: login.email,
      password: passwordHash,
      role: login.role,
      consent: true,
    });
  }
}

// Allow running directly: `npm run seed`
const isDirectRun = process.argv[1] && process.argv[1].endsWith('seed.ts');
if (isDirectRun) {
  seed()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Seeded test logins:', TEST_LOGINS.map((l) => l.email).join(', '));
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Seed failed:', err);
      process.exit(1);
    });
}

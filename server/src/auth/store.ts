import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { User, hashPassword } from './users.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// A tiny file-backed store so the seeded test logins survive `npm run dev`
// restarts without needing a running PostgreSQL instance during local setup.
// Later tasks replace this with the real ORM + PostgreSQL layer.
// Read DATA_DIR lazily so tests can set process.env.DATA_DIR after the module
// has already been imported (ESM imports are hoisted, so a top-level read would
// capture the default before a test's override runs and silently write into the
// real .data directory, clobbering the seeded test logins).
function dataDir(): string {
  return process.env.DATA_DIR ?? join(__dirname, '..', '..', '.data');
}

function usersFile(): string {
  return join(dataDir(), 'users.json');
}

function ensureDir(): void {
  const dir = dataDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function loadUsers(): User[] {
  const file = usersFile();
  if (!existsSync(file)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as User[];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  ensureDir();
  writeFileSync(usersFile(), JSON.stringify(users, null, 2), 'utf8');
}

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return loadUsers().find((u) => u.email.toLowerCase() === normalized);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  consent: boolean;
}): Promise<User> {
  const users = loadUsers();
  const user: User = {
    id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    email: input.email.trim().toLowerCase(),
    passwordHash: await hashPassword(input.password),
    role: input.role,
    consent: input.consent,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function upsertUser(input: {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  consent: boolean;
}): User {
  const existing = findUserByEmail(input.email);
  if (existing) {
    return existing;
  }
  // Synchronous wrapper for the seed script; hashing is done by the caller.
  const users = loadUsers();
  const user: User = {
    id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    email: input.email.trim().toLowerCase(),
    passwordHash: input.password,
    role: input.role,
    consent: input.consent,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

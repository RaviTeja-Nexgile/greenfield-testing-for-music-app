import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'listener' | 'uploader' | 'admin';
  consent: boolean;
  createdAt: string;
}

export const TEST_LOGINS = [
  { name: 'Listener', email: 'listener@example.com', password: 'listener123', role: 'listener' as const },
  { name: 'Uploader', email: 'uploader@example.com', password: 'uploader123', role: 'uploader' as const },
  { name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' as const },
];

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

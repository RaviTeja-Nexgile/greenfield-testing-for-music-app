import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, TEST_LOGINS } from './users.js';

describe('password hashing', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('listener123');
    expect(hash).not.toBe('listener123');
    expect(await verifyPassword('listener123', hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });

  it('defines the three test logins from design.md', () => {
    expect(TEST_LOGINS).toHaveLength(3);
    expect(TEST_LOGINS.map((l) => l.email)).toEqual([
      'listener@example.com',
      'uploader@example.com',
      'admin@example.com',
    ]);
  });
});

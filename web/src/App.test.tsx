import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App routing', () => {
  it('shows the sign-in page at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeTruthy();
    expect(screen.getByText(/sign up/i)).toBeTruthy();
  });
});

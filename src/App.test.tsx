import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('RallyRoom app shell', () => {
  it('renders the service name and room creation CTA', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /RallyRoom/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '응원방 만들기' })).toBeInTheDocument();
  });
});


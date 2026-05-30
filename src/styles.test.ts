import { describe, expect, it } from 'vitest';
import styles from './styles.css?raw';

describe('responsive account controls CSS', () => {
  it('does not hide the authenticated logout button on mobile', () => {
    expect(styles).not.toMatch(/\.account-chip\s*\+\s*\.auth-button\s*\{[^}]*display\s*:\s*none\b/s);
  });
});

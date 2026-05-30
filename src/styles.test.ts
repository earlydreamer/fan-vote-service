import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const styles = readFileSync('src/styles.css', 'utf8');

describe('responsive account controls CSS', () => {
  it('does not hide the authenticated logout button on mobile', () => {
    expect(styles).not.toMatch(/\.account-chip\s*\+\s*\.auth-button\s*\{[^}]*display\s*:\s*none\b/s);
  });

  it('keeps compact section headings horizontal on narrow screens', () => {
    expect(styles).toMatch(/\.collection-heading\.compact\s*\{[^}]*flex-direction\s*:\s*row\b/s);
  });
});

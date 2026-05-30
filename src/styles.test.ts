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

describe('global action buttons style consistency CSS', () => {
  it('ensures vote action button is styled consistently with 14px border-radius and primary gradient', () => {
    expect(styles).toMatch(/\.vote-action-row\s+button:not\(\.button-exchange\)\s*\{[^}]*border-radius\s*:\s*14px/s);
    expect(styles).toMatch(/\.vote-action-row\s+button:not\(\.button-exchange\)\s*\{[^}]*background\s*:\s*linear-gradient/s);
  });

  it('ensures inline option form submit button has 14px border-radius and primary gradient', () => {
    expect(styles).toMatch(/\.inline-option-form\s+button\s*\{[^}]*border-radius\s*:\s*14px/s);
    expect(styles).toMatch(/\.inline-option-form\s+button\s*\{[^}]*background\s*:\s*linear-gradient/s);
  });

  it('ensures mission card action button has 14px border-radius and primary gradient', () => {
    expect(styles).toMatch(/\.mission-card__button\s*\{[^}]*border-radius\s*:\s*14px/s);
    expect(styles).toMatch(/\.mission-card__button\s*\{[^}]*background\s*:\s*linear-gradient/s);
  });

  it('ensures fan message submit button has 14px border-radius and primary gradient', () => {
    expect(styles).toMatch(/\.message-form__actions\s+button\s*\{[^}]*border-radius\s*:\s*14px/s);
    expect(styles).toMatch(/\.message-form__actions\s+button\s*\{[^}]*background\s*:\s*linear-gradient/s);
  });

  it('ensures RP exchange button border-radius is unified to 14px', () => {
    expect(styles).toMatch(/\.button-exchange\s*\{[^}]*border-radius\s*:\s*14px/s);
  });
});


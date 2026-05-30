import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path) => readFileSync(join(process.cwd(), path), 'utf8');

describe('CSS layout policy', () => {
  it('keeps pricing add-on grid tracks responsive on narrow mobile viewports', () => {
    const styles = readProjectFile('src/styles.css');

    expect(styles).toContain('grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));');
    expect(styles).not.toContain('grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));');
  });
});

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

describe('Document title policy', () => {
  it('updates the HTML document title with the new brand PickRally', () => {
    const html = readProjectFile('index.html');

    expect(html).toContain('<title>PickRally</title>');
    expect(html).not.toContain('<title>RallyRoom</title>');
  });
});

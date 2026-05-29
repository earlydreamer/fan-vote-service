import { describe, expect, it } from 'vitest';
import { deriveVoteTitle } from './roomDisplay';

describe('room display helpers', () => {
  it('derives a vote title from room naming suffixes without stripping compound words', () => {
    expect(deriveVoteTitle('픽셀 리그 시즌 투표 결과')).toBe('픽셀 리그 시즌');
    expect(deriveVoteTitle('은하 무대 오프닝 투표방')).toBe('은하 무대 오프닝');
    expect(deriveVoteTitle('네온 시티 주인공 인기투표')).toBe('네온 시티 주인공 인기투표');
  });
});

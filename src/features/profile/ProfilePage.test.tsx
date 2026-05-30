import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProfilePage } from './ProfilePage';

describe('ProfilePage', () => {
  it('separates ongoing joined votes from completed result cards and exposes edit entry points', () => {
    render(<ProfilePage />);

    expect(screen.getByRole('link', { name: '프로필 수정' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '관심 카테고리 수정' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '참여 중인 투표' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '완료된 투표 카드' })).toBeInTheDocument();
  });
});

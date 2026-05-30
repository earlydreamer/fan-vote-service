import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoomCreatePage } from './RoomCreatePage';

describe('RoomCreatePage', () => {
  it('does not charge tickets while adding initial candidates during room creation', () => {
    render(<RoomCreatePage />);

    expect(screen.getByRole('button', { name: '초기 후보 항목 추가' })).toBeInTheDocument();
    expect(screen.queryByText(/후보 항목 추가 - 투표권/)).not.toBeInTheDocument();
  });
});

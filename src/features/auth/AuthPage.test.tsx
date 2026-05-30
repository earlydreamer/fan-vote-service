import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthPage } from './AuthPage';

describe('AuthPage', () => {
  it('shows signup and login entry points for guest users', () => {
    render(<AuthPage onLogin={() => undefined} />);

    expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '데모 계정으로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈 피드 둘러보기' })).toBeInTheDocument();
  });
});

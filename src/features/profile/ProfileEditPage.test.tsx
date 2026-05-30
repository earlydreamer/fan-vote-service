import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ProfileEditPage } from './ProfileEditPage';
import { demoReadRepository } from '../../shared/api/demoReadRepository';

describe('ProfileEditPage', () => {
  beforeEach(() => {
    // 테스트 시작 전에 기본 프로필 상태를 보증
    demoReadRepository.updateProfile({
      nickname: '테스트유저',
      followedCategoryIds: ['cat-stage']
    });
  });

  it('renders nickname input and category checkboxes with user profile values', () => {
    render(<ProfileEditPage />);

    // 닉네임 폼 렌더링 및 기존 값 검증
    const nicknameInput = screen.getByLabelText('닉네임');
    expect(nicknameInput).toHaveValue('테스트유저');

    // 카테고리 체크박스 검증 (기본 카테고리 중 '무대'는 선택되어 있어야 함)
    const stageCheckbox = screen.getByRole('checkbox', { name: '무대' });
    expect(stageCheckbox).toBeChecked();

    const artworkCheckbox = screen.getByRole('checkbox', { name: '작품' });
    expect(artworkCheckbox).not.toBeChecked();
  });

  it('submits updated profile data to demoReadRepository and dispatches event', async () => {
    const updateSpy = vi.spyOn(demoReadRepository, 'updateProfile');
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    render(<ProfileEditPage />);

    // 닉네임 수정
    const nicknameInput = screen.getByLabelText('닉네임');
    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, '새로운힙스터');

    // 카테고리 추가 선택 ('작품' 체크박스 클릭)
    const artworkCheckbox = screen.getByRole('checkbox', { name: '작품' });
    await userEvent.click(artworkCheckbox);

    // 저장 버튼 클릭
    const saveButton = screen.getByRole('button', { name: '저장하기' });
    await userEvent.click(saveButton);

    // demoReadRepository.updateProfile 가 올바른 파라미터로 호출되었는지 검증
    expect(updateSpy).toHaveBeenCalledWith({
      nickname: '새로운힙스터',
      followedCategoryIds: ['cat-stage', 'cat-story']
    });

    // 프로필 페이지로의 라우팅 이동을 시도했는지 검증
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '/profile');

    updateSpy.mockRestore();
    pushStateSpy.mockRestore();
  });
});

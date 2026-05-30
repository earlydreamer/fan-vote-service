import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RoomCreatePage } from './RoomCreatePage';

describe('RoomCreatePage', () => {
  it('does not charge tickets while adding initial candidates during room creation', () => {
    render(<RoomCreatePage />);

    expect(screen.getByRole('button', { name: '초기 후보 항목 추가' })).toBeInTheDocument();
    expect(screen.queryByText(/후보 항목 추가 - 투표권/)).not.toBeInTheDocument();
  });

  it('renders candidates in a vertical setup list with index numbering and delete buttons', () => {
    const { container } = render(<RoomCreatePage />);

    // 칩 그리드 대신 세로형 목록 컨테이너가 존재하는지 검증
    const setupList = container.querySelector('.candidate-setup-list');
    expect(setupList).toBeInTheDocument();

    // 개별 후보 아이템 구조 검증
    const setupItems = container.querySelectorAll('.candidate-setup-item');
    expect(setupItems.length).toBeGreaterThan(0);

    // 첫 번째 후보의 넘버링과 후보명, 삭제 버튼 존재 여부 검증
    const firstItem = setupItems[0];
    expect(firstItem.querySelector('.candidate-setup-item-num')).toHaveTextContent('1');
    expect(firstItem.querySelector('.candidate-setup-item-name')).toHaveTextContent('첫 장면 스포트라이트');
    expect(firstItem.querySelector('button[aria-label="후보 1 삭제"]')).toBeInTheDocument();
  });

  it('integrates the candidate setup section inside the main stacked-form for single-flow UI', () => {
    const { container } = render(<RoomCreatePage />);

    // stacked-form 하위에 '새 후보 항목' 레이블이나 입력 필드가 물리적으로 존재하여, 전체 입력이 하나의 폼 흐름으로 결합되었는지 검증
    const form = container.querySelector('.stacked-form');
    expect(form).toBeInTheDocument();

    const newCandidateInput = form?.querySelector('#new-candidate-title');
    expect(newCandidateInput).toBeInTheDocument();

    const submitButton = form?.querySelector('button[type="submit"]');
    expect(submitButton).toHaveTextContent('생성 intent 만들기');
  });

  it('adds a candidate when Enter is pressed in the candidate input without submitting the form', async () => {
    const user = userEvent.setup();
    render(<RoomCreatePage />);

    const input = screen.getByRole('textbox', { name: '새 후보 항목' });

    // 새 후보 입력하고 Enter 입력
    await user.type(input, 'Enter로 추가된 후보{Enter}');

    // 후보 목록에 'Enter로 추가된 후보'가 존재하는지 확인
    expect(screen.getByText('Enter로 추가된 후보')).toBeInTheDocument();

    // 폼 제출(command preview)이 발생하지 않았음을 확인
    expect(screen.queryByRole('region', { name: '생성 command preview' })).not.toBeInTheDocument();
  });
});


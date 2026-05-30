import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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
    expect(submitButton).toHaveTextContent('방 만들기 내용 확인');
  });

  it('adds a candidate when Enter is pressed in the candidate input without submitting the form', async () => {
    const user = userEvent.setup();
    render(<RoomCreatePage />);

    const input = screen.getByRole('textbox', { name: '새 후보 항목' });

    // 새 후보 입력하고 Enter 입력
    await user.type(input, 'Enter로 추가된 후보{Enter}');

    // 후보 목록에 'Enter로 추가된 후보'가 존재하는지 확인
    expect(screen.getByText('Enter로 추가된 후보')).toBeInTheDocument();

    // 폼 제출 preview가 발생하지 않았음을 확인
    expect(screen.queryByRole('region', { name: '방 만들기 내용 미리보기' })).not.toBeInTheDocument();
  });

  it('does not add a candidate when Enter is pressed during IME composition', () => {
    render(<RoomCreatePage />);

    const input = screen.getByRole('textbox', { name: '새 후보 항목' });

    // 새 후보 입력하고, isComposing: true 상태의 Enter keydown 이벤트를 직접 트리거
    fireEvent.change(input, { target: { value: '조합중인후보' } });
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      isComposing: true,
      nativeEvent: { isComposing: true }
    });

    // 후보 목록에 '조합중인후보'가 없어야 함
    expect(screen.queryByText('조합중인후보')).not.toBeInTheDocument();
  });

  it('does not add a candidate when Enter arrives after compositionend in Safari (isComposing: false)', () => {
    // Safari/WebKit에서 compositionend 이후 Enter keydown이 isComposing: false로 오는 시나리오
    // compositionstart → compositionend → keydown(Enter, isComposing: false) 순서로 발생함
    // setTimeout(0)을 제어하기 위해 fake timer 사용
    vi.useFakeTimers();

    render(<RoomCreatePage />);

    const input = screen.getByRole('textbox', { name: '새 후보 항목' });

    fireEvent.change(input, { target: { value: '사파리후보' } });
    // Safari: IME 조합 시작
    fireEvent.compositionStart(input);
    // Safari: IME 조합 완료 (compositionend 이후 Enter가 별도로 도달함)
    // 이 시점에 setTimeout이 큐에 쌓이지만 아직 실행 안 됨 → isComposingRef.current = true
    fireEvent.compositionEnd(input, { data: '사파리후보' });
    // Safari: compositionend 이후 Enter keydown이 isComposing: false로 도달
    // 아직 setTimeout이 실행 전이므로 isComposingRef.current === true → 가드 동작
    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      isComposing: false,
      nativeEvent: { isComposing: false }
    });

    // Safari에서도 IME 확정 Enter로 후보가 추가되면 안 됨
    expect(screen.queryByText('사파리후보')).not.toBeInTheDocument();

    // 타이머 정리
    vi.runAllTimers();
    vi.useRealTimers();
  });
});


# PickRally TDD Feature Slicing

작성일: 2026-05-29
최종 갱신일: 2026-05-31

> 파일명은 초기 코드네임 `RallyRoom` 이력을 유지한다. 현재 서비스명과 UI 표기는 `PickRally`를 우선한다.

## 원칙

PickRally의 핵심 기능은 작게 쪼개서 테스트 우선으로 구현한다. UI만 예쁘게 만드는 순서가 아니라, 사용자의 행동과 시스템 불변식을 기준으로 feature를 자른다.

## P0 Foundation

목표:

- React/Vite/TypeScript/Vitest 프로젝트 세팅
- AGENTS, README, env, gitignore 구성
- 최소 앱 셸 스모크 테스트

테스트:

- 앱 셸이 서비스명과 주요 CTA를 렌더링한다.

## P1 Room Creation Intent

목표:

- 투표방 만들기 폼의 입력 상태와 검증
- 클라이언트가 신뢰 필드를 만들지 않는 command payload 구성

테스트:

- 제목, 카테고리, 대상, 투표 타입, 마감일을 입력하면 `createRoom` command payload가 생성된다.
- 금지 단어인 공식, 인증, 전달 보장 문구는 검증에서 거절된다.
- `vote_count`, `current_goal_value`, `reward_rp`는 payload에 포함되지 않는다.
- 초기 후보 추가는 무료이며 후보는 최소 2개 이상이어야 한다.

## P2 Vote Command

목표:

- `castVote` command client wrapper
- UI는 서버 응답 DTO로만 카운트와 게이지를 갱신한다.

테스트:

- 후보 선택 시 `roomId`, `candidateIds`, `voteTicketCount`만 보낸다.
- `voteTicketCount` 외의 득표 수, Vote Energy, 참여자 수 같은 신뢰 필드는 보내지 않는다.
- 투표권 N장을 쓰면 후보 표와 Vote Energy가 N만큼 증가한다.
- 사용 가능한 투표권이나 남은 Vote Energy보다 많이 투표할 수 없다.
- Vote Energy가 목표치에 도달하면 현재 투표가 마감된다.
- 프론트에서 voteCount를 직접 계산해 mutation payload에 넣지 않는다.

## P3 Mission Completion

목표:

- 미션 완료 command wrapper
- 서버 응답의 RP, energy, rewards를 UI에 반영한다.

테스트:

- 텍스트 미션 최소 길이를 클라이언트에서 1차 검증한다.
- 보상 값은 요청 payload가 아니라 응답 DTO에서만 읽는다.

## P4 Room Message

목표:

- 팬월 메시지 작성
- 메시지 작성도 command API로 처리한다.

테스트:

- 메시지 본문 길이를 검증한다.
- 직접 `room_messages.insert` 같은 data layer 호출을 사용하지 않는다.

## P5 Result Card

목표:

- 결과 카드 발행 요청과 결과 화면
- 우승자, 참여자 수, 인기 메시지는 서버 응답을 기준으로 표시한다.

테스트:

- 방장만 발행 버튼을 볼 수 있다.
- `publishResultCard`는 `roomId`만 보낸다.

## P6 Crew Dashboard

목표:

- aggregate view 기반 대시보드 표시

테스트:

- 대시보드는 row 목록이 아니라 집계 DTO를 렌더링한다.
- 관리자/방장 권한이 없을 때 접근 제한 상태를 표시한다.

## P7 Room Detail / Auth / Profile UX

목표:

- 방 상세의 `현재 투표`, `팬월`, `미션`, `결과/기록` 탭 구조
- 방장/참여자/게스트 상태별 주요 CTA 분기
- 내 활동의 참여 중인 투표와 완료된 투표 카드 분리

테스트:

- 상세 화면은 2단 동시 노출 대신 탭 전환으로 팬월/미션/기록을 보여준다.
- 방장은 방장 배지와 관리 액션을 본다.
- 게스트는 투표 대신 로그인/회원가입 CTA를 본다.
- 프로필 view model은 진행 중 참여 투표와 완료된 결과 카드를 분리한다.
- AuthPage는 회원가입 heading, 데모 계정 시작, 홈 피드 둘러보기 진입점을 제공한다.

## P8 Pricing / RP / Vote Ticket Loop

목표:

- 요금제, 투표권 패키지, Crew 문의 intent를 분리한다.
- RP가 투표권으로 돌아오는 루프를 보여준다.

테스트:

- Plus 구독, 투표권 팩, Crew 문의는 서로 다른 intent로 변환된다.
- pricing intent payload에는 서버가 계산해야 하는 신뢰 보상 필드가 포함되지 않는다.
- 100 RP를 투표권 1장으로 교환하면 RP와 투표권 표시가 함께 갱신된다.
- RP가 부족하면 교환 CTA는 비활성화되거나 설명 메시지를 표시한다.

## P9 Profile Edit / Auth Gate

목표:

- 프로필 수정 목업을 제공하되, 비로그인 접근은 로그인 화면으로 유도한다.

테스트:

- 로그인 상태에서는 프로필 수정 폼이 보인다.
- 게스트 상태에서는 프로필 수정 대신 로그인/회원가입 CTA가 보인다.
- 프로필 수정은 이번 MVP에서 저장형 백엔드 mutation을 만들지 않는다.

## P10 Create Room Candidate Input / IME Guard

목표:

- 투표방 만들기 후보 입력을 키보드로 빠르게 추가할 수 있게 한다.
- 한글/일본어 IME 조합 중 Enter가 후보 추가나 form submit을 오작동시키지 않게 한다.

테스트:

- 후보 입력에서 Enter를 누르면 form submit보다 후보 추가가 먼저 처리된다.
- 조합 입력 중 Enter는 후보를 추가하지 않는다.
- Safari/WebKit에서 `isComposing`이 불안정한 경우에도 조합 직후 Enter 오작동을 방지한다.

## P11 Shared Button / Style Policy

목표:

- 주요 action 버튼 스타일을 공통 `Button` 컴포넌트로 통일한다.
- 새 action이 기존 스타일 체계를 벗어나지 않게 정책 테스트로 막는다.

테스트:

- 공통 Button은 variant, size, disabled, loading 상태를 렌더링한다.
- 주요 페이지 action은 공통 Button 또는 동일한 스타일 토큰을 사용한다.
- CSS policy test가 모바일 overflow, 문서 title, workflow 규칙을 확인한다.

## P12 Vote State Race Conditions

목표:

- 반복 투표, 실패한 재시도, 프로필 갱신 경합에서 투표권과 득표 수가 잘못 복구되거나 이중 차감되지 않게 한다.

테스트:

- 반복 투표 시 후보 득표 수와 Vote Energy는 누적된다.
- 실패한 오래된 요청이 최신 투표권 상태를 덮어쓰지 않는다.
- 비동기 프로필 갱신이 이미 반영된 투표권 차감을 되돌리지 않는다.
- 후보 추가 중 투표 제출은 잠기며, 두 작업이 서로의 pending 상태를 침범하지 않는다.

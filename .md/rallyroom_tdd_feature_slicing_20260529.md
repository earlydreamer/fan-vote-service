# RallyRoom TDD Feature Slicing

작성일: 2026-05-29

## 원칙

RallyRoom의 핵심 기능은 작게 쪼개서 테스트 우선으로 구현한다. UI만 예쁘게 만드는 순서가 아니라, 사용자의 행동과 시스템 불변식을 기준으로 feature를 자른다.

## P0 Foundation

목표:

- React/Vite/TypeScript/Vitest 프로젝트 세팅
- AGENTS, README, env, gitignore 구성
- 최소 앱 셸 스모크 테스트

테스트:

- 앱 셸이 서비스명과 주요 CTA를 렌더링한다.

## P1 Room Creation Intent

목표:

- 응원방 만들기 폼의 입력 상태와 검증
- 클라이언트가 신뢰 필드를 만들지 않는 command payload 구성

테스트:

- 제목, 카테고리, 대상, 투표 타입, 마감일을 입력하면 `createRoom` command payload가 생성된다.
- 금지 단어인 공식, 인증, 전달 보장 문구는 검증에서 거절된다.
- `vote_count`, `current_goal_value`, `reward_rp`는 payload에 포함되지 않는다.

## P2 Vote Command

목표:

- `castVote` command client wrapper
- UI는 서버 응답 DTO로만 카운트와 게이지를 갱신한다.

테스트:

- 후보 선택 시 `roomId`와 `candidateIds`만 보낸다.
- 중복 투표 에러 코드를 사용자 메시지로 변환한다.
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


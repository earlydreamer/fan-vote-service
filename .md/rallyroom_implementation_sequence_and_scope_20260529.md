# PickRally 구현 순서와 범위

작성일: 2026-05-29
최종 갱신일: 2026-05-31

> 파일명은 초기 코드네임 `RallyRoom` 이력을 유지한다. 현재 서비스명과 UI 표기는 `PickRally`를 우선한다.

## 목적

이 문서는 PickRally 구현을 어떤 순서로, 어디까지, 어떤 기준으로 진행할지 정의한다. 각 단계는 독립 feature로 진행하며, issue, feature branch, draft PR, TDD, 리뷰, merge 절차를 따른다.

## 전제

- 최신 제품 요약: `.md/pickrally_current_product_brief_20260531.md`
- 백엔드/보안 기획 기준: `.md/rallyroom_v2_backend_architecture_20260529.md`
- 디자인 시스템 기준: `DESIGN.md`
- 기술 스택 기준: `.md/rallyroom_tech_stack_and_directory_structure_20260529.md`
- TDD 기준: `.md/rallyroom_tdd_feature_slicing_20260529.md`
- GitHub 운영 기준: `.md/rallyroom_github_review_workflow_20260529.md`

## 2026-05-31 현재 저장소 상태

현재 `main` 기준으로 Phase 0부터 Phase 10까지의 프론트엔드 MVP와 Phase 13 제출 준비 일부가 구현되어 있다.

추가로 완료된 보완 작업:

- 서비스명 `PickRally` 반영과 HTML title 정책 테스트
- 홈/상세의 투표방/투표 위계 정리
- 투표 후보 세로 리스트와 반복 투표 UX
- 활성 투표 중 후보 추가 시 투표권 사용 및 자동 투표
- RP를 투표권으로 교환하는 목업 플로우
- 투표권 차감/복구 경합 버그 보완
- 투표방 만들기 화면 재구성, Enter 후보 추가, IME/Safari 조합 입력 guard
- 공통 `Button` 컴포넌트와 버튼 스타일 통일
- 프로필 수정 페이지와 로그인 guard
- 문서/워크플로우 정책 테스트

남은 큰 작업:

- 실제 Supabase schema/RLS/RPC migration
- Supabase Edge Function command API 구현
- 실제 인증/프로필 저장
- 결제 연동
- VibeX 도메인 게시와 제출 메일 정리

## 전체 구현 원칙

- 프론트엔드는 신뢰 데이터를 직접 계산하거나 DB에 쓰지 않는다.
- 핵심 mutation은 command API 경계로만 표현한다.
- MVP라도 클라이언트 직접 Supabase insert/update 구조를 만들지 않는다.
- UI 구현 전 `DESIGN.md`를 읽고, 첫 화면을 랜딩 페이지가 아니라 투표방 탐색이 바로 보이는 앱 화면으로 만든다.
- UI 구현은 React Best Practice 점검을 거친다.
- 모든 기능은 feature 단위로 쪼개고, GitHub issue와 PR에서 상태와 완료 기준을 관리한다.
- 브랜치 내부 임시 메모가 필요하면 `.md/local/`에 untracked 파일로 둔다.
- 각 단계는 작은 의미 단위 커밋을 누적한다. rebase/squash하지 않는다.

## 2026-05-30 UX 재정렬 기준

- 방은 지속되는 팬 공간, 투표는 방 안의 현재 세션으로 다룬다.
- MVP에서는 한 방에 활성 투표 1개만 노출하지만, 완료 투표 기록과 프리셋 확장을 염두에 둔다.
- 상세 화면은 2단 고정 레이아웃이 아니라 `현재 투표`, `팬월`, `미션`, `결과/기록` 탭으로 구성한다.
- 팬월은 사이드 보조 영역이 아니라 독립 탭의 주요 콘텐츠다.
- 게스트는 투표/항목 추가 대신 회원가입 또는 로그인 CTA를 본다.
- 내 활동은 `참여 중인 투표`와 `완료된 투표 카드`를 분리한다.

## Phase 0. Foundation

상태: 완료

목표:

- React/Vite/TypeScript/Vitest 프로젝트 초기화
- 프로젝트 지침, README, env 분리, gitignore 구성
- 최신 기획과 작업 절차 문서화
- 최소 앱 셸 smoke test

포함 범위:

- `AGENTS.md`
- `README.md`
- `.env.example`
- `.gitignore`
- `package.json`
- `src/App.tsx`
- `src/App.test.tsx`
- `.md/` 운영 문서

제외 범위:

- 실제 제품 기능
- Supabase schema/RLS/Edge Functions
- 라우팅/페이지 구조

완료 기준:

- `npm test` 통과
- `npm run build` 통과
- `origin/main` bootstrap push 완료

## Phase 0.5. Design System

상태: 완료

목표:

- `awesome-design-md`와 Google Stitch DESIGN.md 개념을 참고해 PickRally 전용 디자인 계약을 만든다.
- Phase 1 이후 UI가 랜딩 페이지, 일반 SaaS 히어로, 공식 아이돌 앱 톤으로 흐르지 않도록 시각 기준을 고정한다.

포함 범위:

- `DESIGN.md`
- 시각 방향, 색상, 타입, spacing, 컴포넌트 규칙
- 페이지와 라우팅 구조의 무드와 정보 밀도 원칙
- AGENTS/README/기술 문서의 `DESIGN.md` 우선 참조 지침

제외 범위:

- React 페이지 구현
- 라우팅 코드 구현
- mock data JSON 구현

완료 기준:

- `DESIGN.md`가 루트에 존재한다.
- `Fan Vote Discovery` 방향과 탐색 화면 우선 원칙이 명시된다.
- `npm test` 통과
- `npm run build` 통과

## Phase 1. App Shell과 라우팅 골격

목표:

- PickRally MVP의 화면 이동 골격을 만든다.
- 아직 서버 데이터 없이도 홈, 방 만들기, 방 상세, 마이페이지, Crew 대시보드, 요금제 화면으로 이동할 수 있게 한다.
- `DESIGN.md` 기준으로 첫 화면을 홈/탐색 피드로 구성한다.
- 페이지 단위 렌더링은 하드코딩 배열이 아니라 Supabase read model로 바꾸기 쉬운 최소 demo JSON/repository를 사용한다.

포함 범위:

- 라우팅 전략 선택
- 앱 레이아웃
- 네비게이션
- 빈 상태/로딩 상태의 기본 표현
- 페이지 컴포넌트 파일 구조
- React Best Practice 기준에 맞는 컴포넌트 분리
- `DESIGN.md`의 페이지/라우트 구조 반영
- 결과 카드 route skeleton
- `src/shared/types/rallyroom.ts`
- `src/shared/data/demo/*`
- `src/shared/api/demoReadRepository.ts`

제외 범위:

- 실제 방 생성
- 투표/미션 상태 변경
- Supabase 연결
- 인증
- read model 고도화와 command boundary 상세 정책은 Phase 2 이후 별도 feature에서 확장

주요 파일 후보:

- `src/app/AppShell.tsx`
- `src/app/routes.ts`
- `src/features/home/HomePage.tsx`
- `src/features/rooms/RoomCreatePage.tsx`
- `src/features/rooms/RoomDetailPage.tsx`
- `src/features/result-cards/ResultCardPage.tsx`
- `src/features/profile/ProfilePage.tsx`
- `src/features/crew/CrewDashboardPage.tsx`
- `src/features/pricing/PricingPage.tsx`
- `src/shared/api/demoReadRepository.ts`
- `src/shared/data/demo/*.json`
- `src/shared/types/rallyroom.ts`

테스트 범위:

- 홈에서 주요 CTA가 보인다.
- CTA 클릭 또는 라우팅 동작으로 방 만들기 화면에 접근할 수 있다.
- 존재하지 않는 경로는 안전한 fallback을 보여준다.
- 첫 화면이 full-viewport 랜딩 히어로가 아니라, 투표방 피드/미션/RP 요약을 포함한 앱 화면 구조임을 확인한다.

완료 기준:

- `npm test` 통과
- `npm run build` 통과
- React Best Practice 점검 기록

## Phase 2. Demo Data와 Read Model

목표:

- Supabase 연결 전에 MVP 화면을 구성할 가상 read model을 만든다.
- 공개 read와 command mutation의 책임을 코드 구조에서 분리한다.

포함 범위:

- 카테고리 fixture
- 가상 target fixture
- 샘플 room fixture
- room detail read DTO
- dashboard aggregate read DTO
- read-only query function 또는 repository interface

제외 범위:

- 실제 Supabase query
- command API 호출
- localStorage 영속화

주요 파일 후보:

- `src/shared/types/rallyroom.ts`
- `src/shared/api/readModels.ts`
- `src/shared/api/demoReadRepository.ts`
- `src/features/rooms/roomFixtures.ts`

테스트 범위:

- 공개 room 목록이 active/result 상태만 반환한다.
- room detail은 approved candidate와 visible message만 포함한다.
- crew dashboard는 row 목록이 아니라 aggregate DTO를 반환한다.

완료 기준:

- read model 테스트 통과
- UI가 demo data를 read-only로 렌더링
- mutation처럼 보이는 코드는 없음

## Phase 3. Room Creation Intent

목표:

- 사용자가 투표방 생성 의도를 입력하고, command API payload 형태로 안전하게 변환한다.

포함 범위:

- 방 만들기 폼 상태
- 카테고리 선택
- 대상 선택
- 투표 타입 선택
- 마감일 설정
- reward icon 선택
- 공식성 오인 금지 문구 검증
- `createRoom` command payload builder

제외 범위:

- 실제 Supabase Edge Function 호출
- 실제 DB 생성
- 방 생성 후 서버 상태 반영

주요 파일 후보:

- `src/features/rooms/createRoomSchema.ts`
- `src/features/rooms/createRoomCommand.ts`
- `src/features/rooms/RoomCreateForm.tsx`
- `src/features/rooms/RoomCreatePage.tsx`

테스트 범위:

- 유효한 입력은 `create-room` payload로 변환된다.
- `공식`, `인증`, `소속사`, `전달 보장` 같은 문구는 거절된다.
- payload에 `vote_count`, `current_goal_value`, `reward_rp`, `total_rp`가 포함되지 않는다.
- 후보는 최소 2개 이상이어야 한다.

완료 기준:

- RED/GREEN TDD 기록
- React Best Practice 점검 기록
- command boundary 문서와 일치

## Phase 4. Command Client Boundary

목표:

- 프론트에서 Edge Function command API를 호출하는 공통 client 경계를 만든다.

포함 범위:

- env parsing
- command error code 타입
- command response 타입
- `createRoom`, `castVote`, `completeMission`, `postRoomMessage`, `publishResultCard` client wrapper의 shell
- Authorization header 전달 구조
- 실패 응답을 UI 메시지로 변환하는 mapper

제외 범위:

- 실제 Supabase 프로젝트 세팅
- Edge Function 구현
- RPC 구현

주요 파일 후보:

- `src/shared/config/env.ts`
- `src/shared/api/commandClient.ts`
- `src/shared/api/commandErrors.ts`
- `src/features/rooms/createRoomApi.ts`
- `src/features/voting/castVoteApi.ts`
- `src/features/missions/completeMissionApi.ts`
- `src/features/messages/postRoomMessageApi.ts`
- `src/features/resultCards/publishResultCardApi.ts`

테스트 범위:

- command client는 configured function URL로 POST한다.
- Authorization token이 있으면 Bearer header를 보낸다.
- 표준 error code를 사용자 메시지로 변환한다.
- 신뢰 필드는 client request builder에서 생성하지 않는다.

완료 기준:

- command client unit test 통과
- `.env.example` 업데이트 필요 여부 확인
- 기술 스택/디렉터리 구조 문서 갱신

## Phase 5. Voting UX

목표:

- 투표 UI와 `castVote` command 경계를 연결한다.
- UI는 서버 응답 DTO로만 vote count와 room energy를 갱신한다.

포함 범위:

- 후보 카드
- 투표 버튼
- 이미 투표한 상태
- 중복 투표 에러 표시
- 서버 응답 기반 게이지 업데이트

제외 범위:

- 실제 DB 투표 트랜잭션
- multi-pick 전체 정책
- 실시간 동기화

주요 파일 후보:

- `src/features/voting/VotePanel.tsx`
- `src/features/voting/useCastVote.ts`
- `src/features/voting/voteResultMapper.ts`

테스트 범위:

- 후보 선택 시 `roomId`, `candidateIds`, `voteTicketCount`만 보낸다.
- `voteTicketCount`는 사용자가 소모할 투표권 수를 나타내는 의도값이며, 프론트가 `voteCount`나 `currentGoalValue`를 직접 보내지 않는다.
- 성공 응답으로 후보 득표 수와 게이지가 갱신된다.
- `DUPLICATE_VOTE`는 사용자에게 이해 가능한 메시지로 보인다.
- 프론트가 vote count 증가값을 직접 payload에 넣지 않는다.

완료 기준:

- TDD 기록
- React Best Practice 점검
- `npm test`, `npm run build` 통과

## Phase 6. Mission UX

목표:

- 미션 완료 UI와 `completeMission` command 경계를 연결한다.
- 보상 값은 서버 응답에서만 읽는다.

포함 범위:

- 출석 미션
- 텍스트 응원 미션
- 완료 상태
- RP/Energy/reward icon 표시

제외 범위:

- 실제 daily reset
- 금칙어 서버 검증
- reward inventory 전체 구현

주요 파일 후보:

- `src/features/missions/MissionList.tsx`
- `src/features/missions/MissionCard.tsx`
- `src/features/missions/useCompleteMission.ts`

테스트 범위:

- 텍스트 미션 최소 길이 미달 시 command를 호출하지 않는다.
- command request에 reward 값을 포함하지 않는다.
- 성공 응답의 `awardedRp`, `awardedEnergy`, `earnedRewards`를 표시한다.

완료 기준:

- TDD 기록
- React Best Practice 점검
- `npm test`, `npm run build` 통과

## Phase 7. Fan Message UX

목표:

- 팬월 메시지를 command API로 작성하고, visible message read model에 반영한다.

포함 범위:

- 메시지 작성 폼
- body 길이 검증
- cheer/question 타입 구분
- 성공 후 메시지 표시
- rate limit/error message 표시

제외 범위:

- 실시간 채팅
- 신고/숨김/채택 관리자 기능
- 이미지 업로드

주요 파일 후보:

- `src/features/messages/RoomMessagePanel.tsx`
- `src/features/messages/postRoomMessageSchema.ts`
- `src/features/messages/usePostRoomMessage.ts`

테스트 범위:

- 빈 메시지는 제출되지 않는다.
- 너무 긴 메시지는 거절된다.
- 메시지 작성은 직접 insert가 아니라 `postRoomMessage` command를 호출한다.
- 성공 응답으로 메시지와 보상 표시가 갱신된다.

완료 기준:

- TDD 기록
- React Best Practice 점검
- `npm test`, `npm run build` 통과

## Phase 8. Result Card

목표:

- 방 종료 후 결과 카드 발행 요청과 결과 카드 화면을 만든다.
- 우승자와 top message는 서버 응답 또는 read model 기준으로만 표시한다.

포함 범위:

- 결과 카드 화면
- 방장 전용 발행 버튼
- 공유용 카드 미리보기
- result published 상태

제외 범위:

- 실제 이미지 생성
- SNS 공유 API
- 자동 스케줄러

주요 파일 후보:

- `src/features/resultCards/ResultCardPage.tsx`
- `src/features/resultCards/ResultCardPreview.tsx`
- `src/features/resultCards/usePublishResultCard.ts`

테스트 범위:

- 방장만 발행 버튼을 볼 수 있다.
- `publishResultCard` request는 `roomId`만 보낸다.
- 결과 카드에는 winner, participant count, top message가 표시된다.

완료 기준:

- TDD 기록
- React Best Practice 점검
- `npm test`, `npm run build` 통과

## Phase 9. Profile과 Reward History

목표:

- 팬 개인이 얻은 RP, 아이콘, 참여 방, 만든 방을 볼 수 있게 한다.

포함 범위:

- 마이페이지 요약
- 참여 중인 투표 목록
- 완료된 투표 카드 목록
- 만든 방 목록
- 획득 아이콘
- 프로필 수정과 관심 카테고리 수정 진입점 목업

제외 범위:

- 실제 로그인 프로필 수정
- 공개 프로필 페이지
- notification settings

주요 파일 후보:

- `src/features/auth/AuthPage.tsx`
- `src/features/profile/ProfilePage.tsx`
- `src/features/profile/ProfileSummary.tsx`
- `src/features/profile/rewardHistoryReadModel.ts`

테스트 범위:

- user stats와 reward history를 렌더링한다.
- 비로그인 상태에서는 로그인 안내 또는 demo 상태를 보여준다.
- 참여 중인 투표와 완료된 투표 카드를 분리해서 렌더링한다.
- 회원가입/로그인 진입점은 데모 계정 시작 CTA를 제공한다.

완료 기준:

- TDD 기록
- React Best Practice 점검
- `npm test`, `npm run build` 통과

## Phase 10. Crew Dashboard

목표:

- 방 운영자가 row-level raw data가 아니라 aggregate view 기반 지표를 본다는 구조를 UI로 보여준다.

포함 범위:

- room aggregate cards
- 참여율
- vote/mission/message count
- 추천 다음 미션 카드
- 권한 없음 상태

제외 범위:

- 실제 admin role
- moderation queue 상세 처리
- CSV export

주요 파일 후보:

- `src/features/crew/CrewDashboardPage.tsx`
- `src/features/crew/CrewStatsCards.tsx`
- `src/features/crew/crewStatsReadModel.ts`

테스트 범위:

- aggregate DTO를 렌더링한다.
- raw event list를 직접 노출하지 않는다.
- 권한이 없으면 제한 상태를 보여준다.

완료 기준:

- TDD 기록
- React Best Practice 점검
- `npm test`, `npm run build` 통과

## Phase 11. Supabase Schema/RLS/RPC 설계 산출물

목표:

- 실제 Supabase 적용 전 schema, RLS, RPC migration 초안을 만든다.

포함 범위:

- SQL migration skeleton
- core tables
- constraints
- indexes
- RLS policy skeleton
- RPC function skeleton
- aggregate views

제외 범위:

- 실제 Supabase 배포
- Edge Function runtime 배포
- 운영 데이터 migration

주요 파일 후보:

- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0002_rls_policies.sql`
- `supabase/migrations/0003_rpc_commands.sql`
- `supabase/migrations/0004_aggregate_views.sql`

테스트 범위:

- SQL syntax 검증 가능한 범위에서 확인
- 정책 문서와 migration의 테이블/함수 이름 일치 확인

완료 기준:

- schema 문서와 migration 일치
- service role key 프론트 노출 없음
- 기술 스택/디렉터리 구조 문서 갱신

## Phase 12. Supabase Edge Function Skeleton

목표:

- command API의 Edge Function skeleton을 만든다.

포함 범위:

- `create-room`
- `cast-vote`
- `complete-mission`
- `post-room-message`
- `publish-result-card`
- 공통 auth/payload/error helper

제외 범위:

- 실제 Supabase 배포
- 완전한 RPC 구현
- rate limit persistence

주요 파일 후보:

- `supabase/functions/_shared/auth.ts`
- `supabase/functions/_shared/http.ts`
- `supabase/functions/create-room/index.ts`
- `supabase/functions/cast-vote/index.ts`
- `supabase/functions/complete-mission/index.ts`
- `supabase/functions/post-room-message/index.ts`
- `supabase/functions/publish-result-card/index.ts`

테스트 범위:

- 인증 헤더 없음은 `UNAUTHENTICATED`
- invalid payload는 `VALIDATION_ERROR`
- 각 function은 직접 여러 테이블을 수정하지 않고 RPC 호출 wrapper를 사용한다.

완료 기준:

- Edge Function skeleton test 또는 typecheck 통과
- 기술 스택/디렉터리 구조 문서 갱신

## Phase 13. MVP Polish와 제출 준비

목표:

- VibeX 과제 제출에 필요한 화면 완성도, 설명, 프롬프트 기록, 배포 준비를 정리한다.

포함 범위:

- responsive polish
- 빈 상태/에러 상태 문구
- 데모 데이터 정리
- 제출용 주요 프롬프트 정리
- README 업데이트
- 배포 체크리스트

제외 범위:

- 결제
- 실제 AI 챗봇
- 실제 운영자 인증
- 완전한 실시간 기능

주요 파일 후보:

- `.md/rallyroom_submission_prompts_20260529.md`
- GitHub issue 또는 PR comment
- `README.md`
- UI polish 대상 파일

테스트 범위:

- `npm test`
- `npm run build`
- 주요 페이지 수동 smoke
- React Best Practice 점검

완료 기준:

- VibeX 또는 배포 환경에서 URL 확보
- 제출용 프롬프트 정리
- README와 작업 로그 최신화

## 추천 실행 순서

1. Phase 0.5, Design System
2. Phase 1, App Shell과 라우팅 골격
3. Phase 2, Demo Data와 Read Model
4. Phase 3, Room Creation Intent
5. Phase 4, Command Client Boundary
6. Phase 5, Voting UX
7. Phase 6, Mission UX
8. Phase 7, Fan Message UX
9. Phase 8, Result Card
10. Phase 9, Profile과 Reward History
11. Phase 10, Crew Dashboard
12. Phase 11, Supabase Schema/RLS/RPC 설계 산출물
13. Phase 12, Supabase Edge Function Skeleton
14. Phase 13, MVP Polish와 제출 준비

## MVP 컷라인

시간이 부족하면 Phase 1부터 Phase 8까지를 최우선으로 한다.

최소 제출 가능 범위:

- 홈/방 만들기/방 상세/결과 카드 화면
- demo data 기반 read model
- create-room intent payload
- cast-vote command boundary
- complete-mission command boundary
- 팬월 메시지 command boundary
- 결과 카드 화면
- command API가 필요하다는 아키텍처 설명

보류 가능:

- 실제 Supabase migration 전체
- Edge Function 실제 배포
- Crew Dashboard 고급 지표
- Profile 상세 이력
- Official 계정/관리자 기능

## 다음 작업 후보

프론트엔드 MVP 화면 구조는 제출 가능한 수준까지 연결되어 있으므로, 다음 작업은 목적에 따라 선택한다.

### 제출 마감 우선

- VibeX 도메인 게시
- 게시 URL smoke test
- 제출 메일 문안과 주요 프롬프트 요약 정리
- README와 제출 문서의 URL 반영

### 제품 완성도 우선

- 실제 Supabase schema/RLS/RPC migration 초안 작성
- Edge Function command API skeleton 구현
- 실제 인증/프로필 저장 경계 연결
- moderation/reporting 최소 흐름 추가

### 프론트 polish 우선

- 모바일 주요 화면 시각 QA
- 결과 카드 공유 화면 polish
- 투표방 카드 데이터 다양성 추가
- 프로필/요금제 연결 문구 정리

# RallyRoom 기술 스택과 디렉터리 구조

작성일: 2026-05-29
최종 갱신일: 2026-05-30

## 목적

이 문서는 RallyRoom 프로젝트의 기술 스택과 디렉터리 구조를 명시한다. 의존성, 빌드 도구, 테스트 도구, 백엔드 플랫폼, 주요 디렉터리가 바뀌면 이 파일을 같은 feature PR 안에서 갱신한다.

## 갱신 규칙

다음 변경이 있으면 반드시 이 문서를 갱신한다.

- `package.json` dependencies/devDependencies 변경
- 빌드 도구, 테스트 도구, 배포 타깃 변경
- Supabase, Edge Functions, DB migration 구조 추가/변경
- `src/` 하위 주요 디렉터리 추가/변경
- repository workflow 또는 최상위 테스트 디렉터리 추가/변경
- feature 소유권이나 책임 경계 변경
- alias, routing, state management, server-state 전략 변경
- `DESIGN.md` 디자인 토큰, 컴포넌트 규칙, 페이지 구조 원칙 변경

## 현재 기술 스택

### Frontend

- React
- TypeScript
- Vite
- CSS, 현재는 전역 `src/styles.css`만 사용
- lucide-react, 아이콘 필요 시 사용
- 디자인 시스템: 루트 `DESIGN.md`
- 라우팅: React Router 미도입, `window.history.pushState`와 `popstate` 기반의 얇은 SPA 라우터

### Test

- Vitest
- Testing Library React
- Testing Library jest-dom
- Testing Library user-event
- jsdom

### Data / Backend 예정

- Supabase Auth
- Supabase PostgREST, 공개 read와 자기 데이터 read 범위에 한정
- Supabase Edge Functions, command API
- Supabase Postgres RPC, 도메인 트랜잭션
- Supabase RLS, constraints, aggregate view
- TanStack Query, server state read/cache 관리
- command client boundary: `src/shared/api/commandClient.ts`, `src/shared/api/commandErrors.ts`, `src/shared/config/env.ts`

### Deployment 예정

- Frontend: Vercel 또는 Cloudflare Pages
- Backend: Supabase Edge Functions
- Database: Supabase Postgres

## 핵심 아키텍처 원칙

```text
React SPA
  -> public read / safe own-data read
Supabase PostgREST + RLS

React SPA
  -> command request
Supabase Edge Functions
  -> validated call
Postgres RPC / transaction functions
  -> Supabase Postgres + RLS + constraints
```

프론트엔드는 `vote_count`, `current_goal_value`, `reward_rp`, `reward_energy`, `total_rp`, `winner_candidate_id` 같은 신뢰 필드를 직접 쓰지 않는다.

## 디자인 시스템 원칙

루트 `DESIGN.md`는 RallyRoom UI의 시각 source of truth다. UI 구현 전 반드시 읽는다.

- 방향: `Fan Vote Board`, 팬이 직접 여는 인기투표/랭킹 보드
- 첫 화면: 랜딩 히어로가 아니라 홈/탐색 대시보드
- 주요 시각 객체: 투표방 카드, Vote Energy 게이지, 랭킹/후보 카드, 미션 카드, RP/아이콘 칩, 결과 카드
- 금지: 실존 스타/작품 이미지, 공식성 오인 문구, 베이지 SaaS 히어로, 보라/파랑 그라디언트 중심 디자인, 하드 보더/블록 포스터풍 UI, `Inter` primary font
- 목데이터: 이후 Supabase read model로 교체 가능한 JSON/typed fixture 구조 우선

## 현재 디렉터리 구조

```text
D:\Projects\vibex
├─ .github/
│  └─ workflows/
│     └─ codex-review-followup.yml
├─ .md/
│  ├─ local/                 # gitignore 대상, 브랜치별 임시 작업 메모
│  ├─ rallyroom_delivery_workflow_20260529.md
│  ├─ rallyroom_github_review_workflow_20260529.md
│  ├─ rallyroom_tdd_feature_slicing_20260529.md
│  ├─ rallyroom_submission_prompts_20260530.md
│  ├─ rallyroom_tech_stack_and_directory_structure_20260529.md
│  ├─ rallyroom_v2_backend_architecture_20260529.md
│  └─ 기타 기획/아이데이션 문서
├─ legacy/
│  └─ 1차 산출물 참조용, 현재 구현 기준 아님
├─ src/
│  ├─ app/
│  │  ├─ AppShell.tsx
│  │  └─ routes.ts
│  ├─ features/
│  │  ├─ crew/
│  │  │  ├─ CrewDashboardPage.tsx
│  │  │  ├─ CrewStatsCards.test.tsx
│  │  │  ├─ CrewStatsCards.tsx
│  │  │  ├─ crewStatsReadModel.test.ts
│  │  │  └─ crewStatsReadModel.ts
│  │  ├─ home/
│  │  │  └─ HomePage.tsx
│  │  ├─ messages/
│  │  │  ├─ postRoomMessageApi.ts
│  │  │  ├─ RoomMessagePanel.test.tsx
│  │  │  ├─ RoomMessagePanel.tsx
│  │  │  └─ usePostRoomMessage.ts
│  │  ├─ missions/
│  │  │  ├─ completeMissionApi.ts
│  │  │  ├─ MissionList.test.tsx
│  │  │  ├─ MissionList.tsx
│  │  │  └─ useCompleteMission.ts
│  │  ├─ not-found/
│  │  │  └─ NotFoundPage.tsx
│  │  ├─ pricing/
│  │  │  ├─ PricingPage.test.tsx
│  │  │  ├─ PricingPage.tsx
│  │  │  ├─ pricingIntent.test.ts
│  │  │  └─ pricingIntent.ts
│  │  ├─ profile/
│  │  │  ├─ ProfilePage.tsx
│  │  │  ├─ ProfileSummary.test.tsx
│  │  │  ├─ ProfileSummary.tsx
│  │  │  ├─ rewardHistoryReadModel.test.ts
│  │  │  └─ rewardHistoryReadModel.ts
│  │  ├─ result-cards/
│  │  │  ├─ publishResultCardApi.ts
│  │  │  ├─ ResultCardPage.tsx
│  │  │  ├─ ResultCardPreview.tsx
│  │  │  ├─ ResultCardPublishPanel.test.tsx
│  │  │  ├─ ResultCardPublishPanel.tsx
│  │  │  └─ usePublishResultCard.ts
│  │  ├─ rooms/
│  │  │  ├─ createRoomApi.ts
│  │  │  ├─ createRoomCommand.test.ts
│  │  │  ├─ createRoomCommand.ts
│  │  │  ├─ RoomCreatePage.tsx
│  │  │  └─ RoomDetailPage.tsx
│  │  └─ voting/
│  │     ├─ castVoteApi.ts
│  │     ├─ useCastVote.ts
│  │     ├─ VotePanel.test.tsx
│  │     ├─ VotePanel.tsx
│  │     ├─ voteResultMapper.test.ts
│  │     └─ voteResultMapper.ts
│  ├─ shared/
│  │  ├─ api/
│  │  │  ├─ commandApiWrappers.test.ts
│  │  │  ├─ commandClient.test.ts
│  │  │  ├─ commandClient.ts
│  │  │  ├─ commandErrors.ts
│  │  │  ├─ demoReadRepository.test.ts
│  │  │  └─ demoReadRepository.ts
│  │  ├─ config/
│  │  │  └─ env.ts
│  │  ├─ data/demo/
│  │  │  ├─ categories.json
│  │  │  ├─ crewStats.json
│  │  │  ├─ profile.json
│  │  │  ├─ rooms.json
│  │  │  └─ targets.json
│  │  ├─ types/
│  │  │  └─ rallyroom.ts
│  │  └─ ui/
│  │     ├─ ProgressMeter.tsx
│  │     └─ RoomCard.tsx
│  ├─ test/
│  │  └─ setup.ts
│  ├─ App.test.tsx
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ styles.css
│  └─ vite-env.d.ts
├─ tests/
│  └─ workflowPolicy.test.js
├─ .env.example
├─ .gitignore
├─ AGENTS.md
├─ DESIGN.md
├─ README.md
├─ index.html
├─ package-lock.json
├─ package.json
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## 다음 예정 디렉터리 구조

Phase 1에서 앱 셸, 페이지, 최소 demo read model 구조가 추가되었다. 이후 command/API, Supabase, feature 세부 구현이 시작되면 다음 구조를 확장한다.

```text
src/
├─ app/                  # 앱 셸, providers, routing
├─ features/             # feature 단위 UI와 도메인 로직
│  ├─ home/
│  ├─ rooms/
│  ├─ voting/
│  ├─ missions/
│  ├─ messages/
│  ├─ result-cards/
│  ├─ profile/
│  ├─ pricing/
│  └─ crew/
├─ shared/
│  ├─ api/               # command client, query client
│  ├─ config/            # env parsing
│  ├─ data/demo/         # 구조화된 mock read model JSON
│  ├─ types/             # 공유 타입
│  └─ ui/                # 재사용 UI 컴포넌트
└─ test/                 # 테스트 setup, fixture, helper

supabase/
├─ functions/            # Edge Functions
└─ migrations/           # SQL schema/RLS/RPC migrations
```

## React 구현 검증 기준

React/TSX 파일을 여러 개 수정하거나 컴포넌트 구조를 바꾸는 feature는 `vercel:react-best-practices` 기준으로 점검한다.

필수 확인 항목:

- 컴포넌트 구조, 한 파일 한 책임
- props 타입과 named export 전략
- hooks 규칙과 dependency array
- 상태 위치, derive vs sync
- semantic HTML과 키보드 접근성
- 리스트 key와 불필요한 memoization 여부
- TypeScript에서 `any` 회피

점검 결과는 PR 코멘트 또는 GitHub issue에 남긴다.

## 2026-05-30 Phase 5 Voting UX 추가 파일

`features/voting` 아래에 방 상세 투표 UX를 위한 UI, hook, 응답 매퍼를 추가했다.

- `src/features/voting/VotePanel.tsx`: 후보 선택, 투표 제출, 성공/에러 피드백 UI
- `src/features/voting/useCastVote.ts`: `castVote` command 호출 상태와 응답 반영 상태 관리
- `src/features/voting/voteResultMapper.ts`: command 응답 DTO 기반 후보 득표 수, Vote Energy, 참여자 수 갱신
- `src/features/voting/VotePanel.test.tsx`: 투표 UI와 command input 계약 테스트
- `src/features/voting/voteResultMapper.test.ts`: 응답 DTO 기반 read state 갱신 테스트

## 2026-05-30 Phase 6 Mission UX 추가 파일

`features/missions` 아래에 방 상세 미션 완료 UX를 위한 UI와 hook을 추가했다.

- `src/features/missions/MissionList.tsx`: 미션 카드, 텍스트 미션 입력, 완료 버튼, 보상 receipt UI
- `src/features/missions/useCompleteMission.ts`: `completeMission` command 호출 상태와 보상 응답 표시 상태 관리
- `src/features/missions/MissionList.test.tsx`: 미션 완료 command input 계약, 텍스트 검증, 완료 상태 테스트

## 2026-05-30 Phase 7 Fan Message UX 추가 파일

`features/messages` 아래에 방 상세 팬월 메시지 작성 UX를 위한 UI와 hook을 추가했다.

- `src/features/messages/postRoomMessageApi.ts`: `post-room-message` command request/response DTO와 command wrapper
- `src/features/messages/RoomMessagePanel.tsx`: 응원/질문 메시지 작성 폼, 팬월 메시지 목록, 보상 receipt UI
- `src/features/messages/usePostRoomMessage.ts`: 메시지 본문 검증, command 호출 상태, 성공/에러 응답 반영 상태 관리
- `src/features/messages/RoomMessagePanel.test.tsx`: 팬월 메시지 command input 계약, 본문 검증, 보상 응답 표시 테스트
- `src/App.test.tsx`: 방 상세에서 팬월 메시지 작성 플로우가 내비게이션과 함께 동작하는지 검증

## 2026-05-30 Phase 8 Result Card UX 추가 파일

`features/result-cards` 아래에 결과 카드 발행 요청 UX와 공유용 preview 컴포넌트를 추가했다.

- `src/features/result-cards/publishResultCardApi.ts`: `publish-result-card` command request/response DTO와 command wrapper
- `src/features/result-cards/ResultCardPreview.tsx`: 공개 결과 카드의 winner, 참여자 수, top message preview UI
- `src/features/result-cards/ResultCardPublishPanel.tsx`: 방장 전용 결과 카드 발행 요청 UI와 성공/에러 피드백
- `src/features/result-cards/usePublishResultCard.ts`: `publishResultCard` command 호출 상태와 redirect receipt 관리
- `src/features/result-cards/ResultCardPublishPanel.test.tsx`: 발행 권한, 진행 중 방 guard, command input 계약 테스트
- `src/shared/data/demo/demoRooms.ts`, `src/shared/data/demo/profile.json`: 종료된 미발행 방과 방장 demo state 추가

## 2026-05-30 Phase 9 Profile Reward History 추가 파일

`features/profile` 아래에 개인 보상 이력과 참여 루프를 표시하는 read model derivation과 UI 컴포넌트를 추가했다.

- `src/features/profile/rewardHistoryReadModel.ts`: profile read model과 room 목록을 joined/created room, 최근 보상 이력, 요약 지표로 파생
- `src/features/profile/rewardHistoryReadModel.test.ts`: id 매핑, 최신순 보상 이력, profile 없음 상태 테스트
- `src/features/profile/ProfileSummary.tsx`: 누적 RP, 투표권, 획득 아이콘, 최근 보상 이력, 로그인 안내 상태 UI
- `src/features/profile/ProfileSummary.test.tsx`: 보상 요약 렌더링과 profile 없음 안내 상태 테스트
- `src/features/profile/ProfilePage.tsx`: `ProfileSummary`와 joined/created room 목록 연결
- `src/shared/types/rallyroom.ts`, `src/shared/data/demo/profile.json`: `RewardHistoryEntry`와 demo reward history 추가

## 2026-05-30 Phase 10 Crew Aggregate Dashboard 추가 파일

`features/crew` 아래에 운영자용 aggregate dashboard view model과 UI 컴포넌트를 추가했다.

- `src/features/crew/crewStatsReadModel.ts`: `CrewStatsReadModel`과 category 목록을 운영자용 summary, room performance cards, 권한 상태로 변환
- `src/features/crew/crewStatsReadModel.test.ts`: aggregate 필드 매핑, strongest category label 매핑, 권한 없음 상태 테스트
- `src/features/crew/CrewStatsCards.tsx`: Crew 요약 지표, 방별 vote/mission/message count, 다음 미션 추천, 권한 제한 UI
- `src/features/crew/CrewStatsCards.test.tsx`: aggregate metric 렌더링과 권한 제한 상태 테스트
- `src/features/crew/CrewDashboardPage.tsx`: demo aggregate read model을 `CrewStatsCards`에 연결

## 2026-05-30 Pricing Purchase Intent 추가 파일

`features/pricing` 아래에 요금제와 투표권/RP 패키지 선택을 command intent preview로 보여주는 mock 비즈니스 플로우를 추가했다.

- `src/features/pricing/pricingIntent.ts`: Plus 구독, 투표권 팩, Crew 문의 선택을 checkout 또는 partnership inquiry command intent로 변환
- `src/features/pricing/pricingIntent.test.ts`: 신뢰/보상 필드를 클라이언트 payload에 넣지 않는지와 Crew 문의 분기 검증
- `src/features/pricing/PricingPage.tsx`: 요금제 카드, 충전 패키지, 투표방/내 활동 CTA, 결제 intent preview UI
- `src/features/pricing/PricingPage.test.tsx`: 요금제 선택, Crew 문의, intent preview 접근성 테스트

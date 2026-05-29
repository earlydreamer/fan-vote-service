# RallyRoom 기술 스택과 디렉터리 구조

작성일: 2026-05-29
최종 갱신일: 2026-05-29

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

- 방향: `Fan Ops Board`, 팬이 직접 여는 응원방 운영 대시보드
- 첫 화면: 랜딩 히어로가 아니라 홈/탐색 대시보드
- 주요 시각 객체: 응원방 카드, Room Energy 게이지, 미션 카드, RP/아이콘 칩, 결과 카드
- 금지: 실존 스타/작품 이미지, 공식성 오인 문구, 베이지 SaaS 히어로, 보라/파랑 그라디언트 중심 디자인, `Inter` primary font
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
│  ├─ rallyroom_tech_stack_and_directory_structure_20260529.md
│  ├─ rallyroom_v2_backend_architecture_20260529.md
│  └─ 기타 기획/아이데이션 문서
├─ legacy/
│  └─ 1차 산출물 참조용, 현재 구현 기준 아님
├─ src/
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

## 예정 디렉터리 구조

기능 구현이 시작되면 다음 구조를 우선 검토한다. 실제 추가 시 이 문서를 갱신한다.

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

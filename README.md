# PickRally

PickRally는 팬이 직접 투표방을 만들고, 인기투표·미션·팬월·결과 카드로 참여 기록을 쌓는 팬 주도 투표 커뮤니티 서비스입니다.

이 저장소는 VibeX 과제용 프론트엔드 MVP 구현 프로젝트입니다. 초기 기획 코드네임은 `RallyRoom`이었지만, 현재 서비스명과 UI 표기는 `PickRally`입니다. 기존 `.md/rallyroom_*` 문서 파일명은 작업 이력과 링크 호환을 위해 유지합니다.

## 현재 상태

현재 `main` 기준으로 VibeX 제출용 프론트엔드 MVP는 데모 데이터 기반으로 주요 화면과 참여 흐름이 연결되어 있습니다.

- React + Vite + TypeScript 기반 SPA
- Vitest + Testing Library 기반 TDD
- 홈 탐색, 카테고리 필터, Featured 투표방, 투표방 만들기, 방 상세 탭, 투표, 후보 추가, RP/투표권 교환, 미션, 팬월, 결과 카드, 프로필/내 활동, Crew aggregate dashboard, 요금제/구매 흐름 미리보기 구현
- Supabase command/read architecture는 문서 기준으로 설계되어 있고, 현재 프론트엔드는 demo read model과 command wrapper shell을 사용
- `DESIGN.md` 기반 PickRally 디자인 시스템 적용
- 방은 지속되는 팬 공간, 투표는 방 안의 현재 세션으로 취급

## 로컬 실행

```bash
npm install
npm run dev
```

## 테스트와 빌드

```bash
npm test
npm run build
```

문서만 수정하는 경우에도 커밋 전 최소한 다음을 확인합니다.

```bash
git diff --check
npm test
npm run build
```

## 주요 화면

- `/`: 홈 탐색, Featured 투표방, 카테고리 필터, 투표방 카드 그리드
- `/rooms/new`: 투표방 만들기, 초기 후보 무료 추가, 서버 요청 미리보기와 접수 예시
- `/rooms/room-stage-opening`: 방 상세, 현재 투표, 후보 세로 리스트, 팬월, 미션, 결과/기록 탭
- `/rooms/room-pixel-season/result`: 공개 결과 카드
- `/rooms/room-closed-finale/result`: 결과 카드 발행 요청
- `/login`: 회원가입/로그인 목업과 데모 계정 진입
- `/profile`: RP, 투표권, 최근 보상, 참여 중인 투표, 완료된 결과 카드
- `/profile/edit`: 닉네임과 관심 카테고리 수정 목업, 로그인 상태 guard
- `/crew`: 운영자용 aggregate dashboard
- `/pricing`: 요금제, 투표권/RP 패키지, Crew 문의/구매 흐름 미리보기

## 핵심 UX

- 투표방은 팬이 만든 지속 공간이고, 현재 투표는 그 방의 활성 세션입니다.
- 사용자는 보유 투표권을 선택해 같은 후보에 반복 투표할 수 있습니다.
- 투표권을 사용하면 후보 득표와 Vote Energy가 함께 증가합니다.
- Vote Energy가 목표치에 도달하면 현재 투표는 마감됩니다.
- 방 생성 시 초기 후보 추가는 무료입니다.
- 이미 시작된 활성 투표에 후보를 중간 추가할 때는 투표권을 사용하고, 사용한 투표권만큼 새 후보에 자동 투표됩니다.
- RP는 투표권으로 교환할 수 있으며, 보상 루프가 다시 투표 참여로 이어지도록 설계했습니다.
- 비로그인 사용자는 투표/후보 추가 대신 회원가입 또는 로그인 CTA를 봅니다.

## 환경 변수

`.env.example`을 참고해 `.env`를 만듭니다. `.env`는 커밋하지 않습니다.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://your-project-ref.functions.supabase.co
VITE_APP_NAME=PickRally
VITE_APP_ENV=local
```

프론트엔드에는 Supabase anon key만 둡니다. service role key는 브라우저 앱에 절대 넣지 않습니다.

## 문서 기준

- 최신 제품 요약: `.md/pickrally_current_product_brief_20260531.md`
- 문서 인덱스: `.md/README.md`
- 디자인 시스템: `DESIGN.md`
- 백엔드/보안 아키텍처: `.md/rallyroom_v2_backend_architecture_20260529.md`
- 기술 스택과 디렉터리 구조: `.md/rallyroom_tech_stack_and_directory_structure_20260529.md`
- 구현 순서와 범위: `.md/rallyroom_implementation_sequence_and_scope_20260529.md`
- TDD feature slicing: `.md/rallyroom_tdd_feature_slicing_20260529.md`
- 제출용 주요 프롬프트와 smoke 체크: `.md/rallyroom_submission_prompts_20260530.md`

## 개발 규칙

프로젝트별 지침은 `AGENTS.md`를 따릅니다.

초기 세팅 이후 모든 구현은 GitHub issue, feature branch, draft PR, 테스트, GitHub Codex review, merge 절차를 따릅니다. 사용자가 명시적으로 main 직접 수정을 허용한 문서/메타 정리 작업만 예외입니다.

UI 구현과 CSS 변경은 먼저 `DESIGN.md`를 읽고 진행합니다. PickRally의 첫 화면은 랜딩 페이지가 아니라, 투표방 탐색과 카테고리 필터, Featured 콘텐츠, 프로필/보상 루프가 보이는 앱 화면이어야 합니다.

## 중요한 아키텍처 원칙

React 클라이언트는 투표수, 포인트, Vote Energy, 결과 카드 같은 신뢰 데이터를 직접 쓰지 않습니다.

핵심 mutation은 Supabase Edge Functions와 Postgres RPC를 통해 처리하는 구조로 설계합니다.

- `create-room`
- `cast-vote`
- `complete-mission`
- `post-room-message`
- `publish-result-card`

현재 구현은 VibeX 제출용 목업이므로 실제 Supabase schema, RLS, RPC, Edge Function 배포는 후속 백엔드 feature 범위입니다.

## 현재 보류 범위

- 실제 Supabase schema/RLS/RPC migration
- Edge Function command API 배포
- 실제 회원가입/로그인 세션과 프로필 저장
- 실제 결제 연동
- 결과 카드 이미지 생성과 외부 공유 API
- 신고, moderation, 실시간 알림

## legacy

`legacy/` 폴더는 1차 산출물 참조용입니다. 현재 구현 기준은 아닙니다.

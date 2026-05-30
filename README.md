# RallyRoom

RallyRoom은 팬이 직접 작은 응원방을 만들고, 투표와 미션으로 포인트와 아이콘을 모아 결과 카드를 남기는 팬 주도 커뮤니티 서비스입니다.

이 저장소는 VibeX 과제용 구현 프로젝트입니다. 최신 기획 기준은 `.md/rallyroom_v2_backend_architecture_20260529.md`입니다.

## 현재 상태

VibeX 제출용 프론트엔드 MVP 목업을 feature 단위로 구현 중입니다.

- React + Vite + TypeScript 기반 SPA
- Vitest + Testing Library 기반 TDD
- 홈 탐색, 방 만들기 intent, 투표, 미션, 팬월, 결과 카드, 프로필 보상 이력, Crew aggregate dashboard, 요금제 구매 intent UX 구현
- Supabase command/read architecture는 문서 기준으로 설계하고, 현재 프론트엔드는 demo read model과 command wrapper shell을 사용
- `DESIGN.md` 기반 RallyRoom 디자인 시스템 적용

## 로컬 실행

```bash
npm install
npm run dev
```

## 테스트

```bash
npm test
npm run build
```

## 주요 화면

- `/`: 홈 탐색과 Featured 투표
- `/rooms/new`: 투표방 만들기 command intent
- `/rooms/room-stage-opening`: 방 상세, 투표, 미션, 팬월
- `/rooms/room-pixel-season/result`: 공개 결과 카드
- `/rooms/room-closed-finale/result`: 결과 카드 발행 요청
- `/profile`: 보상 이력과 참여/생성 투표방
- `/crew`: 운영자용 aggregate dashboard
- `/pricing`: 요금제, 투표권/RP 패키지, Crew 문의 intent

제출용 주요 프롬프트와 smoke 체크는 `.md/rallyroom_submission_prompts_20260530.md`에 정리합니다.

## 환경 변수

`.env.example`을 참고해 `.env`를 만듭니다. `.env`는 커밋하지 않습니다.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://your-project-ref.functions.supabase.co
```

프론트엔드에는 Supabase anon key만 둡니다. service role key는 브라우저 앱에 절대 넣지 않습니다.

## 개발 규칙

프로젝트별 지침은 `AGENTS.md`를 따릅니다.

UI 구현과 CSS 변경은 먼저 `DESIGN.md`를 읽고 진행합니다. RallyRoom의 첫 화면은 랜딩 페이지가 아니라, 응원방 피드와 미션, RP 요약, 방 만들기 CTA가 보이는 앱 대시보드여야 합니다.

기술 스택과 디렉터리 구조는 `.md/rallyroom_tech_stack_and_directory_structure_20260529.md`에서 관리합니다. 의존성이나 구조가 바뀌면 같은 feature PR에서 함께 갱신합니다.

구현 순서와 범위는 `.md/rallyroom_implementation_sequence_and_scope_20260529.md`를 기준으로 합니다.

초기 세팅 이후 모든 구현은 다음 순서로 진행합니다.

1. GitHub issue로 작업 범위와 완료 기준을 정의합니다.
2. feature branch를 만듭니다.
3. 필요한 경우 `.md/local/` 아래에 로컬 작업 메모를 둡니다. 이 디렉터리는 커밋하지 않습니다.
4. 실패하는 테스트를 먼저 작성합니다.
5. 최소 구현으로 테스트를 통과시킵니다.
6. `npm test`, `npm run build`를 통과시킵니다.
7. pull request를 열고 GitHub Codex 리뷰를 요청합니다.
8. Codex 리뷰 피드백이 남으면 자동화가 follow-up issue로 이관합니다.
9. follow-up issue는 현재 PR의 merge gate가 아니다. CI/status/check가 깨끗하고 남은 unresolved review thread가 없으면 자동 merge를 시도합니다.
10. Codex review thread 자동 resolve는 thread의 모든 댓글 페이지를 확인한 뒤, Codex 봇만 남긴 thread에만 적용합니다.
11. workflow가 기본 브랜치 대상 PR을 자동 merge하면 PR body의 same-repo closing keyword issue를 `completed`로 명시 종료합니다.

## 중요한 아키텍처 원칙

React 클라이언트는 투표수, 포인트, 방 에너지, 결과 카드 같은 신뢰 데이터를 직접 쓰지 않습니다.

핵심 mutation은 Supabase Edge Functions와 Postgres RPC를 통해 처리합니다.

- `create-room`
- `cast-vote`
- `complete-mission`
- `post-room-message`
- `publish-result-card`

## legacy

`legacy/` 폴더는 1차 산출물 참조용입니다. 현재 구현 기준은 아닙니다.

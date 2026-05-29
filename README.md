# RallyRoom

RallyRoom은 팬이 직접 작은 응원방을 만들고, 투표와 미션으로 포인트와 아이콘을 모아 결과 카드를 남기는 팬 주도 커뮤니티 서비스입니다.

이 저장소는 VibeX 과제용 구현 프로젝트입니다. 최신 기획 기준은 `.md/rallyroom_v2_backend_architecture_20260529.md`입니다.

## 현재 상태

초기 프로젝트 세팅 단계입니다.

- React + Vite + TypeScript
- Vitest + Testing Library
- Supabase 기반 아키텍처 예정
- TDD 기반 feature 개발 예정

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

기술 스택과 디렉터리 구조는 `.md/rallyroom_tech_stack_and_directory_structure_20260529.md`에서 관리합니다. 의존성이나 구조가 바뀌면 같은 feature PR에서 함께 갱신합니다.

초기 세팅 이후 모든 구현은 다음 순서로 진행합니다.

1. `.md/features/`에 feature 문서를 작성합니다.
2. GitHub issue를 만듭니다.
3. feature branch를 만듭니다.
4. 실패하는 테스트를 먼저 작성합니다.
5. 최소 구현으로 테스트를 통과시킵니다.
6. `npm test`, `npm run build`를 통과시킵니다.
7. pull request를 열고 리뷰 후 merge합니다.

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

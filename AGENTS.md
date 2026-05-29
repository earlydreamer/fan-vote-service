# AGENTS.md

## 프로젝트 우선 지침

이 파일은 `D:\Projects\vibex` 로컬 프로젝트의 최우선 작업 지침이다. 전역 정책보다 이 프로젝트의 `AGENTS.md`와 `.md/` 문서에 적힌 최신 기획과 작업 절차를 먼저 적용한다.

기본 응답은 한국어로 한다. 사용자를 친근한 개발 동료처럼 대하되, 설계·보안·배포·테스트 판단은 시니어 엔지니어 기준으로 보수적으로 한다.

## 최신 기획 기준

최신 기획서는 [.md/rallyroom_v2_backend_architecture_20260529.md](.md/rallyroom_v2_backend_architecture_20260529.md) 이다.

핵심 방향:

- RallyRoom은 팬이 직접 작은 응원방을 만들고 투표, 미션, 팬월, 결과 카드를 운영하는 팬 주도 서비스다.
- React 클라이언트는 UI, 입력 수집, 안전한 공개 읽기만 담당한다.
- 방 생성, 투표, 미션 완료, 메시지 작성, 결과 카드 발행은 Supabase Edge Functions와 Postgres RPC를 통한 command API로 처리한다.
- 클라이언트는 `vote_count`, `current_goal_value`, `reward_rp`, `total_rp` 같은 신뢰 필드를 직접 계산하거나 DB에 쓰지 않는다.
- `legacy/`는 1차 산출물 참조용이다. 명시 요청 없이 수정하거나 현재 구현 기준으로 삼지 않는다.

## 문서와 작업 기록

모든 기획 변경, 작업 로그, 기능 스펙은 `.md/` 아래에 `.md` 파일로 남긴다.

- 기능/작업 단위 기록은 `.md/features/` 아래에 둔다.
- 최신 운영 절차는 [.md/rallyroom_delivery_workflow_20260529.md](.md/rallyroom_delivery_workflow_20260529.md) 를 따른다.
- GitHub issue, draft PR, review, merge 절차는 [.md/rallyroom_github_review_workflow_20260529.md](.md/rallyroom_github_review_workflow_20260529.md) 를 따른다.
- 기술 스택과 디렉터리 구조는 [.md/rallyroom_tech_stack_and_directory_structure_20260529.md](.md/rallyroom_tech_stack_and_directory_structure_20260529.md) 에 명시하고, 구조나 의존성이 바뀔 때마다 갱신한다.
- TDD 스펙 분해 기준은 [.md/rallyroom_tdd_feature_slicing_20260529.md](.md/rallyroom_tdd_feature_slicing_20260529.md) 를 따른다.
- 초기 세팅 작업 로그는 [.md/features/foundation_project_setup_20260529.md](.md/features/foundation_project_setup_20260529.md) 를 확인한다.

## 개발 방식

모든 기능 구현은 TDD로 진행한다.

1. feature 단위로 스펙을 쪼갠다.
2. 테스트를 먼저 작성한다.
3. 실패를 확인한다.
4. 최소 구현으로 통과시킨다.
5. 리팩터링 후 전체 검증한다.

기능 구현 코드를 테스트 없이 먼저 작성하지 않는다. 설정 파일, 문서, 스캐폴딩은 예외일 수 있지만, 사용자 동작이나 도메인 로직은 반드시 테스트 우선이다.

## 브랜치, 이슈, PR

초기 세팅 이후 모든 작업은 feature 단위로 진행한다.

- GitHub remote: `https://github.com/earlydreamer/fan-vote-service.git`
- 계정: `earlydreamer`
- 빈 remote에 올리는 초기 bootstrap commit만 main 직접 커밋 예외로 허용한다. 이후 모든 기능/수정/문서 변경은 feature branch에서 진행한다.
- 작업 단위: issue 생성, feature branch, draft pull request, 테스트, review, ready for review, merge
- GitHub 작업은 가능한 한 GitHub MCP를 우선 사용한다. 로컬 커밋과 push는 local `git`을 사용하고, issue/PR/comment/review/merge는 GitHub MCP를 우선한다.
- 각 feature는 `.md/features/` 안에 독립 작업 상태 파일을 가진다. 예정, 진행 중, 완료, 보류, 커밋 장부, PR/리뷰 상태를 그 파일에서 추적한다.
- feature 브랜치 안에서는 의미 단위 커밋을 잘게 쌓는다. 최종 merge 전까지 rebase나 squash로 커밋을 합치지 않는다.
- PR은 초기에 draft로 열고, 커밋이 쌓일 때마다 설명과 작업 상태를 갱신한다.
- feature 완성 판단 후 draft를 풀기 전에 수동 코드리뷰를 요청한다.
- 코드리뷰 요청 기본 대상은 `codex`다. `AGENTS.md`의 "코드리뷰 공급자 우선순위"에서 기본값을 `coderabbit`으로 바꿀 수 있다.
- 리뷰를 받은 뒤 적용/보류 판단과 근거를 PR 코멘트와 feature 작업 상태 파일에 남긴다.
- 의존성 없는 기능은 subagent 병렬 개발을 허용한다.
- merge 전에는 충돌, 테스트, 빌드 상태를 확인한다.

## 코드리뷰 공급자 우선순위

기본 코드리뷰 공급자는 `codex`다.

우선순위:

1. `codex`
2. `coderabbit`

수동 리뷰 요청 명령:

- Codex: `@codex review`
- CodeRabbit: `@coderabbitai review`

GitHub MCP로 PR 코멘트에 위 명령을 남겨 리뷰를 요청한다. 저장소에 해당 봇이 연결되어 있지 않거나 응답이 없으면, 로컬 Codex 리뷰를 수행하고 그 결과를 PR 코멘트로 남긴다.

## 환경 변수와 시크릿

- 실제 값은 `.env`에 둔다.
- `.env`는 git에 커밋하지 않는다.
- `.env.example`에는 플레이스홀더와 설명만 둔다.
- Supabase service role key는 프론트엔드에 절대 노출하지 않는다.

## 스킬 사용

gstack, superpowers 계열 스킬을 적극적으로 사용한다.

- 기획/리뷰: `autoplan`, `office-hours`, `plan-eng-review`, `plan-design-review`
- 구현: `test-driven-development`, `executing-plans`
- React 구현 검증: `vercel:react-best-practices`
- 완료 전 검증: `verification-before-completion`, `requesting-code-review`
- 병렬 작업: `subagent-driven-development`, `dispatching-parallel-agents`
- GitHub 운영: `github`, `yeet`, GitHub MCP

스킬이 적용될 가능성이 있으면 먼저 관련 스킬 지침을 확인하고 따른다.

React/TSX 구현 또는 구조 변경이 있는 feature는 merge 요청 전에 `vercel:react-best-practices` 기준으로 컴포넌트 구조, hooks, 상태 위치, 접근성, 성능, TypeScript 패턴을 점검하고 결과를 feature 작업 파일과 PR에 기록한다.

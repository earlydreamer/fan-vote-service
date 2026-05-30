# AGENTS.md

## 프로젝트 우선 지침

이 파일은 `D:\Projects\vibex` 로컬 프로젝트의 최우선 작업 지침이다. 전역 정책보다 이 프로젝트의 `AGENTS.md`와 `.md/` 문서에 적힌 최신 기획과 작업 절차를 먼저 적용한다.

기본 응답은 한국어로 한다. 사용자를 친근한 개발 동료처럼 대하되, 설계·보안·배포·테스트 판단은 시니어 엔지니어 기준으로 보수적으로 한다.

## 최신 기획 기준

최신 제품 요약은 [.md/pickrally_current_product_brief_20260531.md](.md/pickrally_current_product_brief_20260531.md) 이다.
백엔드/보안 아키텍처 기준은 [.md/rallyroom_v2_backend_architecture_20260529.md](.md/rallyroom_v2_backend_architecture_20260529.md) 이다.
`rallyroom_*` 파일명은 초기 코드네임 이력을 유지한 것이다. 현재 서비스명과 UI 표기는 `PickRally`를 우선한다.
UI와 시각 설계의 최우선 기준은 [DESIGN.md](DESIGN.md) 이다. React/TSX, CSS, 화면 문구, 페이지 구조, 목데이터 표시를 바꾸기 전에는 반드시 `DESIGN.md`를 먼저 읽고 적용한다.

핵심 방향:

- PickRally는 팬이 직접 투표방을 만들고 인기투표, 미션, 팬월, 결과 카드를 운영하는 팬 주도 서비스다.
- React 클라이언트는 UI, 입력 수집, 안전한 공개 읽기만 담당한다.
- 방 생성, 투표, 미션 완료, 메시지 작성, 결과 카드 발행은 Supabase Edge Functions와 Postgres RPC를 통한 command API로 처리한다.
- 클라이언트는 `vote_count`, `current_goal_value`, `reward_rp`, `total_rp` 같은 신뢰 필드를 직접 계산하거나 DB에 쓰지 않는다.
- `legacy/`는 1차 산출물 참조용이다. 명시 요청 없이 수정하거나 현재 구현 기준으로 삼지 않는다.

## 문서와 작업 기록

장기 기획, 아키텍처, 운영 정책은 `.md/` 아래에 `.md` 파일로 남긴다. 전체 작업 목록과 feature 진행 상태의 source of truth는 GitHub Issues와 Pull Requests다.

- 기능/작업 단위의 영구 기록은 GitHub issue, PR 본문, PR 코멘트, review thread에 남긴다.
- 사용자가 명시적으로 main 직접 수정을 허용한 문서/메타 정리 작업은 예외로 main에서 바로 진행할 수 있다. 이 경우에도 범위를 작게 유지하고 `git diff --check`, `npm test`, `npm run build` 검증 후 의미 단위 커밋으로 남긴다.
- 사람이 작성하는 GitHub issue 본문, PR 본문, PR 코멘트, review reply, follow-up issue 본문은 기본적으로 한국어로 작성한다.
- 외부 리뷰 원문을 옮길 때도 한국어 요약을 먼저 쓰고, 필요한 경우에만 원문 링크나 짧은 원문 인용을 덧붙인다.
- 명령어, 코드 식별자, 파일 경로, label 이름, 봇 호출문, 고유한 제품명은 원문 표기를 유지할 수 있다.
- GitHub Actions가 자동 생성하는 issue/comment 템플릿도 한국어를 기본으로 한다.
- 외부 봇이 자동으로 남기는 영어 코멘트는 예외지만, 그 내용을 사람이 정리할 때는 한국어로 기록한다.
- 브랜치 작업 중 임시 체크리스트가 필요하면 `.md/local/` 아래에 로컬 `.md` 파일로 둔다. `.md/local/`은 gitignore 대상이며 커밋하지 않는다.
- 최신 운영 절차는 [.md/rallyroom_delivery_workflow_20260529.md](.md/rallyroom_delivery_workflow_20260529.md) 를 따른다.
- `.md/` 문서의 현재/역사적 기준 구분은 [.md/README.md](.md/README.md) 를 먼저 확인한다.
- GitHub issue, draft PR, review, merge 절차는 [.md/rallyroom_github_review_workflow_20260529.md](.md/rallyroom_github_review_workflow_20260529.md) 를 따른다.
- 기술 스택과 디렉터리 구조는 [.md/rallyroom_tech_stack_and_directory_structure_20260529.md](.md/rallyroom_tech_stack_and_directory_structure_20260529.md) 에 명시하고, 구조나 의존성이 바뀔 때마다 갱신한다.
- 구현 순서와 범위는 [.md/rallyroom_implementation_sequence_and_scope_20260529.md](.md/rallyroom_implementation_sequence_and_scope_20260529.md) 를 따른다.
- TDD 스펙 분해 기준은 [.md/rallyroom_tdd_feature_slicing_20260529.md](.md/rallyroom_tdd_feature_slicing_20260529.md) 를 따른다.

## 개발 방식

모든 기능 구현은 TDD로 진행한다.

1. feature 단위로 스펙을 쪼갠다.
2. 테스트를 먼저 작성한다.
3. 실패를 확인한다.
4. 최소 구현으로 통과시킨다.
5. 리팩터링 후 전체 검증한다.

기능 구현 코드를 테스트 없이 먼저 작성하지 않는다. 설정 파일, 문서, 스캐폴딩은 예외일 수 있지만, 사용자 동작이나 도메인 로직은 반드시 테스트 우선이다.

## 디자인 시스템

`DESIGN.md`는 PickRally UI의 source of truth다.

- 첫 화면은 랜딩 페이지가 아니라 투표방 탐색이 바로 보이는 앱 화면으로 설계한다.
- `Fan Vote Discovery` 방향을 따른다. 팬 커뮤니티의 즐거움은 투표방 카드, 후보 랭킹, 미션, RP, Vote Energy, 결과 카드로 표현하고, 공식 아이돌 앱처럼 보이게 만들지 않는다.
- `Inter`, 베이지 SaaS 히어로, 보라/파랑 그라디언트, 실존 스타/작품 이미지, 공식성 오인 문구는 기본 금지다.
- `투표방 만들기`는 주요 화면에서 쉽게 찾을 수 있는 primary command로 유지한다.
- 목데이터는 컴포넌트 내부 하드코딩 배열이 아니라, 이후 Supabase read model로 교체 가능한 구조화된 fixture/schema를 우선한다.
- React/TSX 구현 또는 CSS 변경이 있는 feature는 `DESIGN.md` 준수 여부와 `vercel:react-best-practices` 점검 결과를 PR에 기록한다.

## 브랜치, 이슈, PR

초기 세팅 이후 모든 작업은 feature 단위로 진행한다.

- GitHub remote: `https://github.com/earlydreamer/fan-vote-service.git`
- 계정: `earlydreamer`
- 빈 remote에 올리는 초기 bootstrap commit만 main 직접 커밋 예외로 허용한다. 이후 모든 기능/수정/문서 변경은 feature branch에서 진행한다.
- 작업 단위: issue 생성, feature branch, draft pull request, 테스트, ready for review, review, 피드백 이관 또는 반영, merge
- GitHub 작업은 가능한 한 GitHub MCP를 우선 사용한다. 로컬 커밋과 push는 local `git`을 사용하고, issue/PR/comment/review/merge는 GitHub MCP를 우선한다.
- 각 feature의 예정, 진행 중, 완료, 보류, 리뷰 상태는 GitHub issue와 PR에서 추적한다. tracked 진행도 파일을 만들지 않는다.
- feature 브랜치 안에서는 의미 단위 커밋을 잘게 쌓는다. 최종 merge 전까지 rebase나 squash로 커밋을 합치지 않는다.
- PR은 초기에 draft로 열고, 커밋이 쌓일 때마다 설명과 작업 상태를 갱신한다.
- feature 완성 판단 후 draft를 ready for review로 전환하고 GitHub PR에서 수동 코드리뷰를 요청한다.
- 코드리뷰 요청 기본 대상은 `codex`다. `AGENTS.md`의 "코드리뷰 공급자 우선순위"에서 기본값을 `coderabbit`으로 바꿀 수 있다.
- GitHub Codex 리뷰를 요청했다면 응답을 기다린 뒤 피드백을 확인한다. 현재 PR에서 바로 고치지 않을 피드백은 follow-up issue로 이관한다.
- 저장소 규칙상 unresolved PR conversation 또는 review thread가 남아 있으면 merge하지 않는다.
- follow-up issue는 현재 PR의 merge gate가 아니다. follow-up issue의 수정은 별도 feature branch와 PR에서 처리한다.
- Codex 리뷰 자동화는 Codex 피드백을 follow-up issue로 이관한 뒤 관련 Codex review thread resolve와 자동 merge를 시도한다.
- 자동 merge 조건은 PR이 draft가 아니고, Codex 리뷰 응답이 확인되었고, CI/status/check가 실패 또는 대기 상태가 아니며, 남은 unresolved review thread가 없는 상태다.
- 자동 resolve는 review thread의 모든 댓글 페이지를 확인한 뒤, Codex 봇만 남긴 thread에만 적용한다.
- workflow가 기본 브랜치 대상 PR을 자동 merge한 경우에만 PR body의 same-repo closing keyword issue를 `completed`로 명시 종료한다. GitHub closing keyword 자동 종료에만 의존하지 않는다.
- 자동 resolve가 실패하거나 사람이 남긴 unresolved thread가 있으면 merge하지 않는다. GitHub MCP로 resolution 상태 확인이나 처리가 불가능하면 GitHub UI에서 수동 확인한다.
- 의존성 없는 기능은 subagent 병렬 개발을 허용한다.
- merge 전에는 충돌, 테스트, 빌드 상태를 확인한다.

## 코드리뷰 공급자 우선순위

기본 코드리뷰 공급자는 `codex`다.

우선순위:

1. `codex`
2. `gemini`
3. `coderabbit`

수동 리뷰 요청 명령:

- Codex: `@codex review`
- GitHub Gemini Code Assist: `/gemini review`
- CodeRabbit: `@coderabbitai review`

GitHub MCP로 PR 코멘트에 위 명령을 남겨 리뷰를 요청한다. GitHub Codex 리뷰가 기본 차단 리뷰이며, 로컬 Codex 리뷰는 GitHub 리뷰를 대체하지 않는다.

GitHub-hosted fallback 원칙:

- `@codex review` 요청 후 3분 동안 응답이 없으면 bare `@codex review`를 1회 재요청한다.
- 재요청 후 2분 동안 응답이 없거나 `To use Codex here, create an environment for this repo`처럼 리뷰가 아니라 환경 설정 오류임이 명확하면 GitHub Codex 지연/누락으로 분류한다.
- fallback은 로컬 리뷰보다 GitHub 위에서 동작하는 GitHub Gemini Code Assist를 먼저 사용한다.
- Gemini는 PR conversation에 `/gemini review`를 남겨 호출한다.
- Gemini가 설치되어 있지 않거나 응답이 없고, 변경 위험이 낮은 문서/카피/테스트 작업이면 CodeRabbit을 마지막 fallback으로 사용할 수 있다.
- 코드 동작, 데이터, 권한, 결제, 배포 변경은 Codex 누락만으로 자동 merge하지 않고 사람 확인 또는 별도 승인 근거를 남긴다.
- fallback으로 merge한 뒤 늦게 도착한 Codex 리뷰는 무시하지 않고 후속 이슈로 이관한다.
- Codex 환경 설정 오류 메시지는 코드 리뷰 피드백이 아니므로 `codex-feedback` follow-up issue로 만들지 않고, `codex-unavailable` 상태와 #139 같은 운영 이슈에서 추적한다.

로컬 Codex 리뷰는 다음 예외 상황에서만 보조 수단으로 사용한다.

- GitHub Codex 봇이 저장소에 연결되어 있지 않음이 확인된 경우
- GitHub Codex 요청이 명시적으로 실패한 경우
- 사용자가 응답 대기 중단과 로컬 fallback 사용을 명시적으로 승인한 경우

로컬 fallback을 사용한 경우에도 사유, 대기 시간, 판단 근거를 PR 코멘트 또는 follow-up issue에 남긴다. GitHub Codex 리뷰가 진행 중이면 로컬 Codex 리뷰를 중복 실행하지 않는다.

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

React/TSX 구현 또는 구조 변경이 있는 feature는 merge 요청 전에 `vercel:react-best-practices` 기준으로 컴포넌트 구조, hooks, 상태 위치, 접근성, 성능, TypeScript 패턴을 점검하고 결과를 PR 또는 GitHub issue에 기록한다.

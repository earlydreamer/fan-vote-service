# RallyRoom GitHub MCP Review Workflow

작성일: 2026-05-29

## 목적

이 문서는 RallyRoom 프로젝트에서 GitHub issue, draft PR, 코드리뷰 요청, 리뷰 반영, draft 해제, merge를 어떻게 운영할지 정의한다.

## 원칙

- GitHub 작업은 가능한 한 GitHub MCP를 우선 사용한다.
- 로컬 브랜치 생성, staging, commit, push는 local `git`을 사용한다.
- issue 생성, PR 생성, PR 코멘트, 리뷰 요청, draft 해제, merge는 GitHub MCP를 우선 사용한다.
- PR은 feature 시작 시 draft로 연다.
- feature branch의 커밋은 rebase/squash하지 않고 의미 단위로 쌓는다.
- merge method는 `merge`를 기본으로 한다. squash/rebase merge는 사용하지 않는다.
- 빈 remote 초기 bootstrap commit만 main 직접 커밋 예외로 허용한다. 이후 모든 작업은 feature branch와 draft PR을 거친다.

## 저장소

- Repository: `earlydreamer/fan-vote-service`
- Remote: `https://github.com/earlydreamer/fan-vote-service.git`
- Default branch: `main`
- GitHub MCP 확인: 접근 가능, admin/push/triage 권한 확인.

## feature 시작 절차

1. GitHub MCP로 issue를 만든다.
2. issue에 문제, 사용자 가치, 범위, 제외 범위, 검증 기준을 적는다.
3. 기술 스택 또는 디렉터리 구조 변경 여부를 판단하고 필요 시 `.md/rallyroom_tech_stack_and_directory_structure_20260529.md` 갱신을 범위에 넣는다.
4. `feature/<issue-number>-<short-name>` 브랜치를 만든다.
5. 필요하면 `.md/local/<issue-number>-<short-name>.md` 로컬 메모를 만든다. 이 파일은 커밋하지 않는다.
6. 첫 커밋 또는 초기 스펙 커밋을 push한다.
7. GitHub MCP로 draft PR을 만든다.
8. PR 본문에 issue 링크와 검증 계획을 적는다.

## feature 진행 절차

각 의미 단위마다 다음을 반복한다.

1. TDD가 필요한 작업이면 실패 테스트를 먼저 작성하고 실패를 확인한다.
2. 최소 구현을 작성한다.
3. `npm test` 또는 범위 테스트를 실행한다.
4. 의미 단위 커밋을 만든다.
5. 필요하면 PR 본문 또는 코멘트에 진행 상태를 갱신한다.
6. React/TSX 변경이 있으면 `vercel:react-best-practices` 기준 점검 결과를 PR 또는 issue에 기록한다.
7. status-only commit은 만들지 않는다.

## 코드리뷰 요청

feature 완성 판단 후, 먼저 검증을 통과시킨 뒤 draft PR을 ready for review 상태로 바꾸고 코드리뷰를 요청한다.

기본 공급자:

1. `codex`
2. `coderabbit`

수동 명령:

- Codex: `@codex review`
- CodeRabbit: `@coderabbitai review`

요청 방식:

- GitHub MCP의 PR comment 기능으로 위 명령을 남긴다.
- `AGENTS.md`에서 우선순위를 바꾸면 해당 공급자를 먼저 호출한다.
- GitHub Codex 리뷰가 기본 차단 리뷰다.
- `@codex review`를 요청한 뒤에는 GitHub PR comment/review timeline에서 응답을 확인할 때까지 기다린다.
- 리뷰 대기 중에는 GitHub MCP로 PR comment, review, review thread를 스캔한다. 자동 trigger가 없다면 수동 또는 heartbeat 방식으로 이 스캔을 반복해야 한다.
- `chatgpt-codex-connector[bot]`의 review submission 또는 inline review comment가 확인되면 GitHub Codex 리뷰 응답이 도착한 것으로 본다.
- CodeRabbit의 release notes 또는 "review in progress" 코멘트는 리뷰 완료로 보지 않는다.
- 로컬 Codex 리뷰는 GitHub Codex 리뷰를 대체하지 않는다.

로컬 fallback 허용 조건:

- GitHub Codex 봇이 저장소에 연결되어 있지 않음이 확인된다.
- GitHub Codex 요청이 실패했다는 명시 응답이 있다.
- 사용자가 응답 대기 중단과 로컬 fallback 사용을 명시적으로 승인한다.

fallback 기록:

- fallback을 사용한 이유
- GitHub 리뷰를 얼마나 기다렸는지
- 어떤 공급자 응답을 확인했는지
- fallback 결과를 merge gate로 인정할지에 대한 사용자 승인 또는 판단 근거

금지:

- GitHub Codex 리뷰가 진행 중인데 로컬 Codex 리뷰를 중복 실행하는 것
- GitHub Codex 응답 확인 없이 로컬 Codex 리뷰만으로 merge하는 것
- CodeRabbit 진행 중 코멘트를 리뷰 완료로 처리하는 것

## 리뷰 반영 절차

1. GitHub MCP로 PR comment/review timeline을 가져온다.
2. 요청한 GitHub 리뷰 공급자의 응답이 실제로 도착했는지 확인한다.
3. 리뷰 항목을 `critical`, `important`, `minor`, `question`, `won't fix`로 분류한다.
4. `critical`과 `important`는 기본적으로 수정한다.
5. 적용하지 않는 항목은 PR 코멘트 또는 follow-up issue에 근거를 남긴다.
6. 수정이 필요하면 별도 의미 단위 커밋으로 반영한다.
7. PR 코멘트 또는 review reply로 판단 근거를 남긴다.
8. 리뷰가 별도 작업으로 분리되어야 하면 follow-up issue로 추적한다.
9. 리뷰 반영 커밋을 push한 뒤 필요한 경우 같은 공급자에게 재리뷰를 요청한다.

## ready for review와 merge

다음 조건을 모두 만족해야 draft를 푼다.

- `npm test` 통과
- `npm run build` 통과
- GitHub issue/PR의 완료 조건 최신화
- conflict 없음

draft 해제 후:

1. GitHub MCP로 draft PR을 ready for review 상태로 바꾼다.
2. GitHub MCP로 PR 코멘트에 `@codex review`를 남긴다.
3. GitHub MCP로 PR comment/review/review thread를 스캔해 GitHub Codex 리뷰 응답 도착 여부를 확인한다.
4. GitHub Codex 리뷰 응답이 없으면 merge하지 않고 대기한다.
5. 리뷰 내용을 적용하거나 보류 판단을 기록한다.
6. 보류한 리뷰가 있다면 PR 코멘트에 근거를 작성한다.
7. 최종 검증을 다시 수행한다.
8. 최종 merge 전에 head SHA를 확인한다.
9. GitHub MCP merge 기능으로 `merge_method: merge`를 사용해 merge한다.

## 금지

- feature branch에서 rebase로 커밋 재작성
- squash commit으로 의미 단위 이력 제거
- ready for review 전환 직후 GitHub Codex 리뷰 요청을 생략
- GitHub Codex 리뷰 도착 여부 스캔 없이 merge
- GitHub Codex 리뷰 응답 확인 없이 merge
- GitHub Codex 리뷰 진행 중 로컬 Codex 리뷰 중복 실행
- tracked 진행도 파일 또는 status-only commit 생성
- 리뷰 근거 없이 의견 무시
- `.env` 커밋
- service role key 프론트 노출

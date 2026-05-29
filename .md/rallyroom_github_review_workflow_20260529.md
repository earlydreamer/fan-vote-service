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

1. `.md/features/<feature>_<date>.md` 파일을 만든다.
2. 상태를 `planned`로 둔다.
3. 기술 스택 또는 디렉터리 구조 변경 여부를 판단하고 필요 시 `.md/rallyroom_tech_stack_and_directory_structure_20260529.md` 갱신을 범위에 넣는다.
4. GitHub MCP로 issue를 만든다.
5. feature 파일에 issue URL을 적는다.
6. `feature/<issue-number>-<short-name>` 브랜치를 만든다.
7. 상태를 `in_progress`로 바꾼다.
8. 첫 커밋 또는 초기 스펙 커밋을 push한다.
9. GitHub MCP로 draft PR을 만든다.

## feature 진행 절차

각 의미 단위마다 다음을 반복한다.

1. feature 파일의 진행 중 작업을 갱신한다.
2. TDD가 필요한 작업이면 실패 테스트를 먼저 작성하고 실패를 확인한다.
3. 최소 구현을 작성한다.
4. `npm test` 또는 범위 테스트를 실행한다.
5. 의미 단위 커밋을 만든다.
6. feature 파일의 커밋 장부에 commit hash, 의미, 검증 결과를 기록한다.
7. PR 본문 또는 코멘트에 진행 상태를 갱신한다.
8. React/TSX 변경이 있으면 `vercel:react-best-practices` 기준 점검 결과를 feature 파일과 PR에 기록한다.

## 코드리뷰 요청

feature 완성 판단 후, draft를 풀기 전에 코드리뷰를 요청한다.

기본 공급자:

1. `codex`
2. `coderabbit`

수동 명령:

- Codex: `@codex review`
- CodeRabbit: `@coderabbitai review`

요청 방식:

- GitHub MCP의 PR comment 기능으로 위 명령을 남긴다.
- `AGENTS.md`에서 우선순위를 바꾸면 해당 공급자를 먼저 호출한다.
- 저장소에 봇이 연결되어 있지 않거나 응답이 없으면 로컬 Codex 리뷰를 수행하고, 리뷰 결과를 PR 코멘트로 남긴다.

## 리뷰 반영 절차

1. GitHub MCP로 PR comment/review timeline을 가져온다.
2. 리뷰 항목을 `critical`, `important`, `minor`, `question`, `won't fix`로 분류한다.
3. `critical`과 `important`는 기본적으로 수정한다.
4. 적용하지 않는 항목은 근거를 남긴다.
5. 수정이 필요하면 별도 의미 단위 커밋으로 반영한다.
6. feature 파일의 리뷰 장부에 적용/보류 판단을 기록한다.
7. PR 코멘트 또는 review reply로 판단 근거를 남긴다.

## draft 해제와 merge

다음 조건을 모두 만족해야 draft를 푼다.

- `npm test` 통과
- `npm run build` 통과
- feature 파일의 완료 작업과 커밋 장부 최신화
- 코드리뷰 요청 완료
- 리뷰 반영/보류 판단 완료
- 보류한 리뷰가 있다면 PR 코멘트에 근거 작성
- conflict 없음

조건 충족 후:

1. GitHub MCP로 draft PR을 ready for review 상태로 바꾼다.
2. 최종 merge 전에 head SHA를 확인한다.
3. GitHub MCP merge 기능으로 `merge_method: merge`를 사용해 merge한다.

## 금지

- feature branch에서 rebase로 커밋 재작성
- squash commit으로 의미 단위 이력 제거
- 리뷰 요청 없이 draft 해제
- 리뷰 근거 없이 의견 무시
- `.env` 커밋
- service role key 프론트 노출

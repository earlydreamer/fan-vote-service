# PickRally GitHub MCP Review Workflow

작성일: 2026-05-29
최종 갱신일: 2026-05-31

> 파일명은 초기 코드네임 `RallyRoom` 이력을 유지한다. 현재 서비스명과 UI 표기는 `PickRally`를 우선한다.

## 목적

이 문서는 PickRally 프로젝트에서 GitHub issue, draft PR, 코드리뷰 요청, 리뷰 반영, draft 해제, merge를 어떻게 운영할지 정의한다.

## 원칙

- GitHub 작업은 가능한 한 GitHub MCP를 우선 사용한다.
- 로컬 브랜치 생성, staging, commit, push는 local `git`을 사용한다.
- issue 생성, PR 생성, PR 코멘트, 리뷰 요청, draft 해제, 수동 merge는 GitHub MCP를 우선 사용한다.
- PR은 feature 시작 시 draft로 연다.
- feature branch의 커밋은 rebase/squash하지 않고 의미 단위로 쌓는다.
- merge method는 `merge`를 기본으로 한다. squash/rebase merge는 사용하지 않는다.
- 빈 remote 초기 bootstrap commit과 사용자가 명시적으로 허용한 문서/메타 정리 작업만 main 직접 커밋 예외로 허용한다. 그 외 모든 작업은 feature branch와 draft PR을 거친다.

## 저장소

- Repository: `earlydreamer/fan-vote-service`
- Remote: `https://github.com/earlydreamer/fan-vote-service.git`
- Default branch: `main`
- GitHub MCP 확인: 접근 가능, admin/push/triage 권한 확인.

## GitHub 기록 언어

- 사람이 작성하는 GitHub issue 본문, PR 본문, PR 코멘트, review reply, follow-up issue 본문은 기본적으로 한국어로 작성한다.
- 리뷰 요청 코멘트도 `@codex review`, `@coderabbitai review` 같은 호출문을 제외한 설명은 한국어로 작성한다.
- 외부 리뷰 원문을 follow-up issue로 이관할 때는 한국어 요약을 먼저 적고 원문 링크를 남긴다.
- 명령어, 코드 식별자, 파일 경로, label 이름, 봇 호출문, 고유한 제품명은 원문 표기를 유지할 수 있다.
- 외부 봇 자동 코멘트는 예외지만, 적용/보류 판단과 재리뷰 요청은 한국어로 기록한다.

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
2. `gemini`
3. `coderabbit`

수동 명령:

- Codex: `@codex review`
- GitHub Gemini Code Assist: `/gemini review`
- CodeRabbit: `@coderabbitai review`

요청 방식:

- GitHub MCP의 PR comment 기능으로 위 명령을 남긴다.
- `AGENTS.md`에서 우선순위를 바꾸면 해당 공급자를 먼저 호출한다.
- GitHub Codex 리뷰가 기본 차단 리뷰다.
- `@codex review`를 요청한 뒤에는 GitHub PR comment/review timeline에서 응답을 확인할 때까지 기다린다.
- 리뷰 대기 중에는 GitHub MCP로 PR comment, review, review thread를 스캔한다. 자동 trigger가 없다면 수동 또는 heartbeat 방식으로 이 스캔을 반복해야 한다.
- `chatgpt-codex-connector[bot]`의 review submission 또는 inline review comment가 확인되면 GitHub Codex 리뷰 응답이 도착한 것으로 본다.
- `To use Codex here, create an environment for this repo` 같은 응답은 코드 리뷰가 아니라 Codex 환경 설정 오류로 본다.
- CodeRabbit의 release notes 또는 "review in progress" 코멘트는 리뷰 완료로 보지 않는다.
- 로컬 Codex 리뷰는 GitHub Codex 리뷰를 대체하지 않는다.

GitHub-hosted fallback 허용 조건:

- `@codex review` 요청 후 3분 동안 응답이 없으면 bare `@codex review`를 1회 재요청한다.
- 재요청 후 2분 동안 응답이 없고, 이전 PR 응답 시간과 비교해 명백히 늦으면 지연 또는 파이프라인 누락으로 볼 수 있다.
- Codex가 환경 설정 오류를 반환하면 기다림을 반복하지 않고 `codex-unavailable` 상태로 기록한다.
- fallback은 `GitHub Codex -> GitHub Gemini Code Assist -> CodeRabbit` 순서로 사용한다.
- Gemini는 PR conversation에 `/gemini review`를 남겨 호출한다.
- 낮은 위험의 문서/카피/테스트 변경은 GitHub Gemini Code Assist 또는 마지막 fallback인 CodeRabbit 리뷰와 CI 성공을 merge 판단 근거로 사용할 수 있다.
- 코드 동작, 데이터, 권한, 결제, 배포 변경은 Codex 누락만으로 자동 merge하지 않고 사람 확인 또는 별도 승인 근거를 남긴다.
- fallback으로 merge한 뒤 늦게 도착한 GitHub Codex 리뷰는 후속 이슈로 이관한다.

로컬 fallback 허용 조건:

- GitHub Codex 봇이 저장소에 연결되어 있지 않음이 확인된다.
- GitHub Codex 요청이 실패했다는 명시 응답이 있다.
- 사용자가 응답 대기 중단과 로컬 fallback 사용을 명시적으로 승인한다.

fallback 기록:

- fallback을 사용한 이유
- GitHub 리뷰를 얼마나 기다렸는지
- 어떤 공급자 응답을 확인했는지
- fallback 결과를 merge gate로 인정할지에 대한 사용자 승인 또는 판단 근거
- Codex 환경 설정 오류는 코드 피드백 follow-up issue로 만들지 않고, `codex-unavailable` 라벨과 운영 이슈에서 추적한다.

금지:

- GitHub Codex 리뷰가 진행 중인데 로컬 Codex 리뷰를 중복 실행하는 것
- GitHub Codex 응답 확인 없이 로컬 Codex 리뷰만으로 merge하는 것
- CodeRabbit 진행 중 코멘트를 리뷰 완료로 처리하는 것

## 리뷰 반영 절차

1. GitHub MCP로 PR comment/review timeline을 가져온다.
2. 요청한 GitHub 리뷰 공급자의 응답이 실제로 도착했는지 확인한다.
3. 리뷰 항목을 `critical`, `important`, `minor`, `question`, `won't fix`로 분류한다.
4. `critical`과 `important`는 기본적으로 수정한다.
5. 현재 PR에서 바로 고치지 않을 항목은 follow-up issue로 이관한다.
6. 수정이 필요하면 별도 의미 단위 커밋으로 반영한다.
7. PR 코멘트 또는 review reply로 판단 근거를 한국어로 남긴다.
8. 리뷰가 별도 작업으로 분리되어야 하면 한국어 follow-up issue로 추적한다.
9. follow-up issue는 현재 PR의 merge gate가 아니다.
10. Codex 리뷰 자동화는 follow-up issue 생성 후 Codex만 남긴 review thread resolve와 자동 merge를 시도한다.
11. 사람이 답변한 review thread는 자동 resolve하지 않는다. 자동 resolve가 실패하거나 사람이 남긴 unresolved thread가 있으면 merge하지 않는다.
12. Codex review thread 자동 resolve 전에는 thread의 모든 댓글 페이지를 확인해 51번째 이후 사람 댓글도 놓치지 않는다.
13. workflow가 기본 브랜치 대상 PR을 자동 merge한 경우에만 PR body의 same-repo closing keyword issue를 `completed`로 명시 종료한다.
14. GitHub MCP로 resolution 상태를 확인하거나 처리할 수 없으면 GitHub UI에서 수동 확인한다.
15. 현재 PR에 실질 수정 커밋을 push한 경우에는 같은 공급자에게 재리뷰를 요청한다.

## ready for review와 merge

다음 조건을 모두 만족해야 draft를 푼다.

- `npm test` 통과
- `npm run build` 통과
- GitHub issue/PR의 완료 조건 최신화
- conflict 없음

draft 해제 후:

1. GitHub MCP로 draft PR을 ready for review 상태로 바꾼다.
2. GitHub MCP로 PR 코멘트에 `@codex review`를 남긴다.
3. GitHub Codex 리뷰 응답은 PR comment/review/review thread 또는 `codex-reviewed`/`codex-feedback` label로 확인한다.
4. GitHub Codex 리뷰 응답이 없으면 merge하지 않고 대기한다.
5. Codex가 actionable feedback을 남기면 workflow가 follow-up issue로 이관한다.
6. follow-up issue는 현재 PR의 merge gate가 아니다.
7. workflow는 Codex review thread resolve를 시도한다.
8. workflow는 PR이 draft가 아니고, CI/status/check가 실패 또는 대기 상태가 아니며, 남은 unresolved review thread가 없으면 `merge_method: merge`로 자동 merge를 시도한다.
9. Actions check 완료 이벤트가 누락되는 경우를 보완하기 위해 schedule retry가 open PR의 자동 merge 조건을 주기적으로 다시 확인한다.
10. 자동 merge가 실패하면 GitHub MCP로 PR 상태, head SHA, check 상태, unresolved thread를 확인하고 수동 merge 여부를 판단한다.

## 금지

- feature branch에서 rebase로 커밋 재작성
- squash commit으로 의미 단위 이력 제거
- ready for review 전환 직후 GitHub Codex 리뷰 요청을 생략
- GitHub Codex 리뷰 도착 여부 또는 `codex-reviewed`/`codex-feedback` label 확인 없이 merge
- GitHub Codex 리뷰 응답 확인 없이 merge
- GitHub Codex 리뷰 진행 중 로컬 Codex 리뷰 중복 실행
- tracked 진행도 파일 또는 status-only commit 생성
- unresolved PR conversation 또는 review thread가 남은 상태에서 merge
- follow-up issue 생성만으로 사람이 남긴 PR conversation을 resolved 처리했다고 간주
- follow-up issue 처리 여부를 현재 PR의 merge gate로 삼아 자동 merge를 멈추는 것
- 리뷰 근거 없이 의견 무시
- `.env` 커밋
- service role key 프론트 노출

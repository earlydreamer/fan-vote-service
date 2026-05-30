# PickRally Delivery Workflow

작성일: 2026-05-29
최종 갱신일: 2026-05-31

> 파일명은 초기 코드네임 `RallyRoom` 이력을 유지한다. 현재 서비스명과 UI 표기는 `PickRally`를 우선한다.

## 목적

이 문서는 PickRally 프로젝트의 로컬 작업, GitHub issue, pull request, merge 절차를 정의한다. 초기 세팅 이후 모든 구현은 이 문서를 따른다.

## 현재 기준

- 최신 제품 요약: `.md/pickrally_current_product_brief_20260531.md`
- 백엔드/보안 기획: `.md/rallyroom_v2_backend_architecture_20260529.md`
- remote: `https://github.com/earlydreamer/fan-vote-service.git`
- 기본 브랜치 후보: `main`
- 작업 단위 기록 위치: GitHub Issues와 Pull Requests
- 로컬 임시 작업 메모 위치: `.md/local/`, gitignore 대상
- 기술 스택/디렉터리 기준: `.md/rallyroom_tech_stack_and_directory_structure_20260529.md`
- GitHub MCP 확인: `earlydreamer/fan-vote-service` 접근 가능, admin/push/triage 권한 확인.

## GitHub 기록 언어

- 사람이 작성하는 GitHub issue 본문, PR 본문, PR 코멘트, review reply, follow-up issue 본문은 기본적으로 한국어로 작성한다.
- 외부 리뷰 원문을 follow-up issue로 옮길 때는 한국어 요약을 먼저 쓰고 원문 링크를 함께 남긴다.
- 명령어, 코드 식별자, 파일 경로, label 이름, 봇 호출문, 고유한 제품명은 원문 표기를 유지할 수 있다.
- GitHub Actions가 자동 생성하는 issue/comment 템플릿도 한국어를 기본으로 작성한다.
- 외부 봇 자동 코멘트는 예외지만, 사람이 판단 근거를 남길 때는 한국어로 다시 정리한다.

## main 브랜치 예외

`main` 직접 커밋은 원칙적으로 금지한다. 다만 다음 경우는 예외로 본다.

- remote가 비어 있는 상태에서 저장소 bootstrap을 구성하는 초기 init commit
- 사용자가 명시적으로 main 직접 수정을 허용한 문서/메타 정리 작업

예외 작업도 다음 조건을 지킨다.

- 기능 구현과 섞지 않는다.
- status-only commit을 만들지 않는다.
- 변경 범위를 문서/메타 정리에 한정한다.
- 커밋 전 `git diff --check`, `npm test`, `npm run build`를 실행한다.
- 커밋 메시지와 완료 보고에 검증 결과를 남긴다.

그 외 모든 기능, 문서 변경, 설정 변경은 다음 절차를 따른다.

1. GitHub issue 생성
2. feature branch 생성
3. draft PR 생성
4. 의미 단위 커밋 누적
5. draft 해제
6. GitHub Codex 코드리뷰 요청
7. 리뷰 응답 확인과 피드백 이관 또는 반영
8. CI/status/check와 unresolved thread 상태가 깨끗하면 merge commit으로 main 반영

## 작업 흐름

1. 기획서에서 feature 후보를 고른다.
2. GitHub issue를 만들고 문제, 사용자 가치, 범위, 제외 범위, 검증 기준을 적는다.
3. 브랜치 내부 작업 메모가 필요하면 `.md/local/<issue-number>-<short-name>.md`를 만든다. 이 파일은 커밋하지 않는다.
4. 변경이 기술 스택 또는 디렉터리 구조에 영향을 주는지 확인하고, 필요하면 기술 스택/디렉터리 문서를 갱신 대상으로 추가한다.
5. `feature/<issue-number>-<short-name>` 브랜치를 만든다.
6. draft pull request를 열고, PR 본문에 issue 링크와 현재 검증 상태를 적는다.
7. 실패하는 테스트를 먼저 작성한다.
8. 실패 이유를 확인한다.
9. 최소 구현을 작성한다.
10. 의미 단위마다 커밋한다.
11. 커밋이 추가될 때마다 PR 본문 또는 코멘트를 갱신한다. status-only commit은 만들지 않는다.
12. React/TSX 변경이 있으면 `vercel:react-best-practices` 기준 점검을 수행하고 PR 또는 issue에 기록한다.
13. 테스트와 빌드를 통과시킨다.
14. feature 완성 판단 후 검증을 통과시킨다.
15. draft PR을 ready for review로 전환한다.
16. GitHub PR에서 `@codex review`를 요청한다.
17. GitHub Codex 리뷰는 GitHub 이벤트와 follow-up issue를 source of truth로 추적한다.
18. 현재 PR에서 바로 고치지 않을 리뷰 피드백은 follow-up issue로 이관한다.
19. follow-up issue는 현재 PR의 merge gate가 아니다.
20. CI/status/check가 깨끗하고 남은 unresolved review thread가 없으면 자동 merge를 시도한다.

## 커밋 정책

- 커밋은 의미 단위로 작게 만든다.
- 커밋 수가 많아도 괜찮다. 작은 의미 단위가 우선이다.
- feature branch 안에서 rebase나 squash를 하지 않는다.
- 최종 merge도 squash/rebase가 아니라 merge commit 방식을 기본으로 한다.
- 커밋 장부를 tracked md 파일로 갱신하지 않는다. 필요한 작업 상태는 issue/PR timeline에 남긴다.
- 실패한 실험이나 되돌림도 의미가 있으면 별도 커밋으로 남긴다.

## 로컬 작업 메모

- `.md/local/` 아래의 파일은 브랜치 작업 중 임시 체크리스트와 사고 메모를 위한 공간이다.
- `.md/local/`은 gitignore 대상이다.
- 중요한 결정, 리뷰 판단, 보류 근거는 반드시 GitHub issue, PR 본문, PR 코멘트, review thread 중 하나에 남긴다.
- 로컬 메모는 merge gate가 아니다.

## Codex 리뷰 follow-up issue

- GitHub Codex 리뷰가 actionable feedback을 남기면 GitHub Actions가 `codex-feedback` label을 붙이고 follow-up issue를 만든다.
- "major issues 없음" 응답은 follow-up issue를 만들지 않고 `codex-reviewed` label만 붙인다.
- follow-up issue는 한국어 본문으로 리뷰 요약, 원문 링크, PR 번호, head SHA, 현재 PR 처리 원칙을 포함한다.
- follow-up issue는 현재 PR의 merge gate가 아니다.
- 자동화는 issue 생성 후 관련 Codex review thread resolve를 시도하고, PR이 draft가 아니며 CI/status/check가 실패 또는 대기 상태가 아니고 남은 unresolved thread가 없으면 자동 merge를 시도한다.
- 사람이 답변한 review thread는 자동 resolve하지 않는다. Codex만 남긴 thread만 자동 resolve 대상이다.
- Codex review thread 자동 resolve 전에는 thread의 모든 댓글 페이지를 확인해 51번째 이후 사람 댓글도 놓치지 않는다.
- Actions check 완료 이벤트가 누락되는 경우를 보완하기 위해 schedule retry가 open PR의 자동 merge 조건을 주기적으로 다시 확인한다.
- workflow가 기본 브랜치 대상 PR을 자동 merge한 경우에만 PR body의 same-repo closing keyword issue를 `completed`로 명시 종료한다. GitHub closing keyword 자동 종료에만 의존하지 않는다.
- follow-up issue의 수정은 issue 기반 feature workflow로 별도 진행한다.
- 자동화가 실패하더라도 PR 리뷰 원문과 issue/label 상태를 기준으로 복구한다.
- 자동 resolve가 실패하거나 사람이 남긴 unresolved thread가 있으면 merge하지 않는다.
- 이 워크플로우 파일이 아직 default branch에 없는 bootstrap PR에서는 review event가 자동 실행되지 않는다. 이 경우 Codex 피드백을 수동으로 follow-up issue에 이관한다.

## merge 전 체크

- `npm test`
- `npm run build`
- `.env` 또는 시크릿 커밋 여부 확인
- Supabase service role key 프론트 노출 여부 확인
- `legacy/` 변경 여부 확인
- 기술 스택/디렉터리 구조 문서 갱신 필요 여부 확인
- conflict 없음 확인
- React/TSX 변경 시 `vercel:react-best-practices` 점검 기록 확인
- GitHub MCP로 PR 코멘트/리뷰 확인
- GitHub Codex 코드리뷰 요청 및 응답 처리 완료
- GitHub Codex 리뷰 응답 도착 여부를 PR comment/review/review thread 또는 `codex-reviewed`/`codex-feedback` label로 확인
- Codex follow-up issue가 있더라도 현재 PR의 merge gate로 보지 않음
- 모든 PR conversation/review thread가 resolved 상태인지 확인
- GitHub MCP가 resolution 상태를 제공하지 못하면 GitHub UI에서 unresolved conversation이 없는지 수동 확인
- GitHub Codex 리뷰가 진행 중이면 로컬 Codex 리뷰로 대체하지 않았는지 확인
- 적용하지 않은 리뷰가 있으면 보류 근거 코멘트 작성
- merge 전 최종 검증 완료
- merge method는 `merge` 사용, squash/rebase 금지

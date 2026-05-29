# RallyRoom Delivery Workflow

작성일: 2026-05-29

## 목적

이 문서는 RallyRoom 프로젝트의 로컬 작업, GitHub issue, pull request, merge 절차를 정의한다. 초기 세팅 이후 모든 구현은 이 문서를 따른다.

## 현재 기준

- 최신 기획: `.md/rallyroom_v2_backend_architecture_20260529.md`
- remote: `https://github.com/earlydreamer/fan-vote-service.git`
- 기본 브랜치 후보: `main`
- 작업 단위 기록 위치: `.md/features/`
- GitHub MCP 확인: `earlydreamer/fan-vote-service` 접근 가능, admin/push/triage 권한 확인.

## 작업 흐름

1. 기획서에서 feature 후보를 고른다.
2. `.md/features/<feature-name>_<date>.md` 파일을 만든다.
3. 예정 작업, 진행 중 작업, 완료 작업, 보류 작업, 테스트 목록, 검증 명령을 기록한다.
4. GitHub MCP로 issue를 만든다.
5. `feature/<issue-number>-<short-name>` 브랜치를 만든다.
6. draft pull request를 열고, PR 본문에 feature 파일 링크와 현재 상태를 적는다.
7. 실패하는 테스트를 먼저 작성한다.
8. 실패 이유를 확인한다.
9. 최소 구현을 작성한다.
10. 의미 단위마다 커밋한다.
11. 커밋이 추가될 때마다 feature 파일과 draft PR 본문 또는 코멘트를 갱신한다.
12. 테스트와 빌드를 통과시킨다.
13. feature 완성 판단 후 수동 코드리뷰를 요청한다.
14. 리뷰 내용을 적용/보류 판단하고 근거를 PR 코멘트와 feature 파일에 남긴다.
15. 결함이 없다고 판단되면 draft를 풀고 merge한다.

## 커밋 정책

- 커밋은 의미 단위로 작게 만든다.
- 커밋 수가 많아도 괜찮다. 작은 의미 단위가 우선이다.
- feature branch 안에서 rebase나 squash를 하지 않는다.
- 최종 merge도 squash/rebase가 아니라 merge commit 방식을 기본으로 한다.
- 각 커밋은 `.md/features/<feature>.md`의 "커밋 장부"에 기록한다.
- 실패한 실험이나 되돌림도 의미가 있으면 별도 커밋으로 남긴다.

## feature 기록 템플릿

```md
# Feature: <name>

## 상태

- 상태: planned | in_progress | blocked | review_requested | ready_to_merge | merged
- 현재 진행 중:
- GitHub issue:
- GitHub PR:

## 문제

## 사용자 가치

## 범위

## 제외 범위

## TDD 스펙

- [ ] RED:
- [ ] GREEN:
- [ ] REFACTOR:

## 예정 작업

## 진행 중 작업

## 완료 작업

## 보류 작업

## 커밋 장부

| Commit | 의미 단위 | 검증 | 비고 |
|---|---|---|---|

## 리뷰 장부

| Provider | 요청 방식 | 결과 | 적용/보류 판단 | 근거 |
|---|---|---|---|---|

## 검증 명령

## PR/Issue

## 결정 로그

## 남은 위험
```

## merge 전 체크

- `npm test`
- `npm run build`
- 관련 `.md/features/` 작업 로그 최신화
- `.env` 또는 시크릿 커밋 여부 확인
- Supabase service role key 프론트 노출 여부 확인
- `legacy/` 변경 여부 확인
- conflict 없음 확인
- GitHub MCP로 PR 코멘트/리뷰 확인
- 코드리뷰 요청 및 응답 처리 완료
- 적용하지 않은 리뷰가 있으면 보류 근거 코멘트 작성
- draft 해제 전 최종 검증 완료
- merge method는 `merge` 사용, squash/rebase 금지

# Feature: docs/github-codex-review-wait-policy

작성일: 2026-05-29

## 상태

- 상태: feedback_applied
- 현재 진행 중: GitHub Codex 리뷰 피드백 반영 및 검증 통과, 재리뷰 요청 준비
- GitHub issue: https://github.com/earlydreamer/fan-vote-service/issues/4
- GitHub PR: https://github.com/earlydreamer/fan-vote-service/pull/5
- Branch: `feature/4-github-codex-review-wait-policy`

## 문제

기존 절차는 GitHub Codex 리뷰와 로컬 Codex fallback의 역할을 느슨하게 적어 두었다. 그 결과 GitHub Codex 리뷰를 기다리지 않고 로컬 Codex 리뷰로 대체해 merge하는 잘못된 해석이 가능했다.

## 사용자 가치

PR마다 리뷰 주체와 merge gate가 명확해진다. GitHub Codex 리뷰가 진행 중일 때 로컬 리뷰가 중복으로 실행되거나, 응답 대기 없이 merge되는 일을 막는다.

## 범위

- `AGENTS.md` 코드리뷰 공급자 설명 보정
- `.md/rallyroom_github_review_workflow_20260529.md` 리뷰 대기/반영/merge gate 보정
- `.md/rallyroom_delivery_workflow_20260529.md` 작업 흐름과 merge 전 체크 보정
- 이 feature 상태 파일 작성

## 제외 범위

- 제품 기능 구현
- GitHub 봇 설치 또는 설정 변경
- 이미 merge된 PR #3 되돌리기

## TDD 스펙

- 문서/절차 보정 작업이므로 production behavior TDD 대상은 아니다.
- 회귀 검증으로 `git diff --check`, `npm test`, `npm run build`를 사용한다.

## 예정 작업

- [x] GitHub issue 생성
- [x] feature branch 생성
- [x] 문서 보정
- [x] 검증
- [x] 의미 단위 커밋
- [x] 원격 push
- [x] draft PR 생성
- [x] ready for review 전환
- [x] GitHub Codex 리뷰 요청
- [x] GitHub Codex 리뷰 응답 스캔
- [x] 피드백 적용/보류 판단 기록
- [x] 피드백 반영 후 검증
- [ ] 재리뷰 응답 확인
- [ ] 최종 merge 전 검증
- [ ] merge

## 진행 중 작업

- [x] 기존 workflow 문서 확인
- [x] fallback 허용 조건과 금지 조건 명시
- [x] `git diff --check` 통과
- [x] `npm test` 통과
- [x] `npm run build` 통과
- [x] PR #5 ready for review 전환
- [x] `@codex review` 요청
- [x] GitHub Codex 리뷰 응답 확인
- [x] Codex P2 피드백 적용
- [x] 피드백 반영 후 `git diff --check` 통과
- [x] 피드백 반영 후 `npm test` 통과
- [x] 피드백 반영 후 `npm run build` 통과

## 완료 작업

- [x] issue #4 생성
- [x] `feature/4-github-codex-review-wait-policy` 브랜치 생성
- [x] PR #5 draft 생성

## 보류 작업

- [ ] GitHub Codex 리뷰 응답 확인 전 merge 금지

## 커밋 장부

| Commit | 의미 단위 | 검증 | 비고 |
|---|---|---|---|
| `f472f94` | GitHub Codex 리뷰 대기 정책 문서화 | `git diff --check`, `npm test`, `npm run build` | AGENTS/workflow/delivery/feature log |
| `27df2ab` | feature 작업 로그 갱신 | `git diff --check`, `npm test`, `npm run build` | 첫 커밋 해시 반영 |
| `854c56f` | PR 상태 기록 | `git diff --check`, `npm test`, `npm run build` | PR #5 URL과 상태 반영 |
| 예정 | Codex 리뷰 피드백 반영 | 예정 | draft 해제 금지 문구 충돌 수정, 리뷰 스캔 절차 추가 |

## 리뷰 장부

| Provider | 요청 방식 | 결과 | 적용/보류 판단 | 근거 |
|---|---|---|---|---|
| GitHub Codex | PR ready 후 `@codex review` | P2 코멘트 1건 | 적용 | `draft 해제 후 리뷰 요청` 순서와 금지 항목 충돌 수정 |

## React Best Practice 점검

- 대상 파일: 없음
- 컴포넌트 구조: 변경 없음
- hooks/state: 변경 없음
- 접근성: 변경 없음
- 성능: 변경 없음
- TypeScript: 변경 없음
- 조치: React/TSX 변경 없음.

## 검증 명령

```bash
git diff --check
npm test
npm run build
```

검증 결과:

- `git diff --check`: 통과
- `npm test`: 통과, 1 test file / 1 test
- `npm run build`: 통과, Vite production build 생성

## PR/Issue

- Issue: https://github.com/earlydreamer/fan-vote-service/issues/4
- PR: https://github.com/earlydreamer/fan-vote-service/pull/5

## 결정 로그

- GitHub Codex 리뷰는 기본 차단 리뷰로 둔다.
- GitHub Codex 리뷰 요청 뒤 PR comment/review/review thread를 스캔해 응답 도착 여부를 확인한다.
- 로컬 Codex 리뷰는 GitHub Codex 리뷰를 대체하지 않는다.
- fallback은 GitHub Codex 미연결, 명시 실패, 사용자 승인 시에만 허용한다.
- fallback을 쓰더라도 사유와 판단 근거를 PR/feature 파일에 기록한다.

## 남은 위험

- GitHub Codex 봇이 실제로 응답하지 않을 경우 사용자 승인 없이는 merge를 진행할 수 없다.

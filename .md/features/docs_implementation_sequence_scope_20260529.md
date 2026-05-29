# Feature: docs/implementation-sequence-scope

작성일: 2026-05-29
최종 갱신일: 2026-05-29

## 상태

- 상태: ready_for_review
- 현재 진행 중: draft PR 리뷰 대기
- GitHub issue: https://github.com/earlydreamer/fan-vote-service/issues/2
- GitHub PR: https://github.com/earlydreamer/fan-vote-service/pull/3
- Branch: `feature/2-implementation-sequence-scope`

## 문제

RallyRoom의 최신 기획, TDD feature slicing, Supabase 보안 아키텍처는 문서화되어 있었지만 실제 구현을 어떤 순서로 어디까지 진행할지 한눈에 볼 수 있는 기준 문서가 없었다.

## 사용자 가치

다음 작업부터 무엇을 먼저 만들고 무엇을 뒤로 미룰지 흔들리지 않고 단계적으로 진행할 수 있다. 특히 과제 제출 일정이 짧기 때문에 MVP 컷라인을 명시해 범위 폭주를 줄인다.

## 범위

- 구현 순서/범위 문서 추가
- MVP 컷라인 명시
- AGENTS/README에서 구현 순서 문서 참조
- 이 문서 자체의 feature 상태 파일 작성 및 갱신

## 제외 범위

- 제품 기능 구현
- UI 추가 구현
- Supabase schema/RLS/Edge Functions 작성
- 배포

## TDD 스펙

- 문서 작업이므로 production behavior TDD 대상은 아니다.
- 기존 앱 smoke test와 production build를 회귀 검증으로 사용한다.

## 예정 작업

- [x] GitHub issue 생성
- [x] feature branch 생성
- [x] 구현 순서/범위 문서 작성
- [x] AGENTS/README 참조 추가
- [x] 검증
- [x] 의미 단위 커밋
- [x] 원격 push
- [x] draft PR 생성
- [ ] 필요 시 PR 리뷰 요청
- [ ] 리뷰 후 draft 해제 및 merge

## 진행 중 작업

- [x] 최신 기획/아키텍처/TDD slicing 확인
- [x] 구현 순서 초안 작성
- [x] 검증 결과 반영
- [x] draft PR 생성

## 완료 작업

- [x] issue #2 생성
- [x] `feature/2-implementation-sequence-scope` 브랜치 생성
- [x] `.md/rallyroom_implementation_sequence_and_scope_20260529.md` 작성
- [x] `AGENTS.md`에 구현 순서 문서 참조 추가
- [x] `README.md`에 구현 순서 문서 참조 추가
- [x] `npm test` 통과
- [x] `npm run build` 통과
- [x] PR #3 draft 생성

## 보류 작업

- [ ] `@codex review` 요청
- [ ] 리뷰 의견 적용 여부 판단 및 PR 코멘트 기록
- [ ] draft 해제
- [ ] merge

## 커밋 장부

| Commit | 의미 단위 | 검증 | 비고 |
|---|---|---|---|
| `0106f74` | 구현 순서와 범위 문서화 | `npm test`, `npm run build` | Phase 0-13, MVP 컷라인, AGENTS/README 참조 |
| `25c6161` | feature 상태 문서 갱신 | `npm test`, `npm run build` | PR URL과 검증 결과 반영 |

## 리뷰 장부

| Provider | 요청 방식 | 결과 | 적용/보류 판단 | 근거 |
|---|---|---|---|---|
| codex | draft PR 코멘트 `@codex review` | 대기 | 대기 | 문서 PR 생성 후 요청 예정 |

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
npm test
npm run build
```

검증 결과:

- `npm test`: 통과, 1 test file / 1 test
- `npm run build`: 통과, Vite production build 생성

## PR/Issue

- Issue: https://github.com/earlydreamer/fan-vote-service/issues/2
- PR: https://github.com/earlydreamer/fan-vote-service/pull/3

## 결정 로그

- 구현 순서는 프론트 UX 골격, read model, command boundary, 핵심 사용자 행동, 백엔드 산출물 순서로 둔다.
- MVP 컷라인은 Phase 1-8로 둔다.
- Supabase 실제 구현은 프론트 command boundary가 닫힌 뒤 별도 phase로 진행한다.
- Profile, Crew Dashboard, Supabase migration, Edge Function skeleton은 제출 일정에 따라 후순위로 조정할 수 있다.

## 남은 위험

- 일정이 촉박하면 Phase 11-12는 산출물 수준으로만 남을 수 있다.
- 실제 Supabase 프로젝트 연결 전까지 command API는 mock/skeleton 수준일 수 있다.

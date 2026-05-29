# Feature: docs/implementation-sequence-scope

작성일: 2026-05-29

## 상태

- 상태: in_progress
- 현재 진행 중: 구현 순서와 범위 문서 작성.
- GitHub issue: https://github.com/earlydreamer/fan-vote-service/issues/2
- GitHub PR: 없음, branch 작업 후 draft PR 예정.

## 문제

RallyRoom의 최신 기획, TDD feature slicing, Supabase 보안 아키텍처는 문서화되어 있지만, 실제 구현을 어떤 순서로 어디까지 진행할지 한눈에 볼 수 있는 기준 문서가 없다.

## 사용자 가치

다음 작업부터 무엇을 먼저 만들고, 무엇을 뒤로 미룰지 흔들리지 않고 단계적으로 진행할 수 있다.

## 범위

- 구현 순서/범위 문서 추가
- AGENTS/README에서 로드맵 문서 참조
- 이 문서 자체의 feature 상태 파일 작성

## 제외 범위

- 제품 기능 구현
- UI 추가 구현
- Supabase schema/RLS/Edge Functions 작성
- 배포

## TDD 스펙

- 문서 작업이므로 production behavior TDD 대상은 아니다.
- 기존 앱 smoke test와 build를 회귀 검증으로 사용한다.

## 예정 작업

- [x] GitHub issue 생성
- [x] feature branch 생성
- [ ] 구현 순서/범위 문서 작성
- [ ] AGENTS/README 참조 추가
- [ ] 검증
- [ ] 의미 단위 커밋
- [ ] 원격 push 후 draft PR 생성

## 진행 중 작업

- [x] 최신 기획/아키텍처/TDD slicing 확인
- [x] 구현 순서 초안 작성

## 완료 작업

- [x] issue #2 생성
- [x] `feature/2-implementation-sequence-scope` 브랜치 생성

## 보류 작업

- [ ] code review 요청, draft PR 생성 이후 진행

## 커밋 장부

| Commit | 의미 단위 | 검증 | 비고 |
|---|---|---|---|
| 예정 | 구현 순서와 범위 문서화 | `npm test`, `npm run build` | 현재 작업에서 커밋 예정 |

## 리뷰 장부

| Provider | 요청 방식 | 결과 | 적용/보류 판단 | 근거 |
|---|---|---|---|---|
| codex | draft PR 생성 후 `@codex review` | 대기 | 대기 | 문서 PR 생성 후 요청 |

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

## PR/Issue

- Issue: https://github.com/earlydreamer/fan-vote-service/issues/2
- PR: 생성 예정

## 결정 로그

- 구현 순서는 프론트 UX 골격, read model, command boundary, 핵심 사용자 행동, 백엔드 산출물 순서로 둔다.
- MVP 컷라인은 Phase 1-8로 둔다.
- Supabase 실제 구현은 프론트 command boundary가 잡힌 뒤 별도 phase로 진행한다.

## 남은 위험

- 일정이 촉박하면 Phase 11-12는 산출물 수준으로만 남을 수 있다.
- 실제 Supabase 프로젝트 연결 전까지 command API는 mock/skeleton 수준일 수 있다.


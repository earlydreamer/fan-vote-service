# Feature: foundation/project-setup

작성일: 2026-05-29

## 상태

- 상태: in_progress
- 현재 진행 중: 기술 스택/디렉터리 구조 문서화와 React Best Practice 지침 반영.
- GitHub issue: https://github.com/earlydreamer/fan-vote-service/issues/1
- GitHub PR: 없음, 초기 세팅 로컬 커밋 후 리뷰 예정.

## 문제

RallyRoom의 최신 기획은 Supabase Edge Functions, Postgres RPC, RLS를 전제로 한다. 새 React 프로젝트가 아직 없고, 프로젝트별 작업 규칙, TDD 절차, env 분리, GitHub remote 기준이 정리되어 있지 않다.

## 사용자 가치

다음 feature부터 issue, PR, TDD 사이클로 바로 들어갈 수 있는 안전한 로컬 기반을 만든다.

## 범위

- 프로젝트용 `AGENTS.md`
- React/Vite/TypeScript/Vitest 초기 구조
- `.env`와 `.env.example` 분리
- `.gitignore`
- 인간 독자용 `README.md`
- `.md/` 작업 절차 문서
- git 초기화와 remote 설정
- GitHub MCP 접근 확인
- feature별 상태/커밋/리뷰 장부 규칙 추가
- 기술 스택과 디렉터리 구조 문서 추가
- React Best Practice 검증 지침 추가

## 제외 범위

- 실제 Supabase 스키마 구현
- Edge Function 구현
- 방 생성, 투표, 미션 등 기능 구현
- GitHub PR 생성
- 배포

## TDD 스펙

- [x] RED: 앱 셸이 서비스명과 `응원방 만들기` CTA를 렌더링해야 한다는 테스트를 먼저 작성한다.
  - 확인: `src/App.tsx`가 없는 상태에서 `npm test` 실행, `Failed to resolve import "./App"`로 실패.
- [x] GREEN: 최소 App 컴포넌트를 구현해 테스트를 통과시킨다.
  - 확인: `npm test` 통과, 1개 테스트 통과.
- [x] REFACTOR: 불필요한 구현 없이 앱 셸만 유지한다.
  - 확인: 앱 셸은 서비스명, 설명, CTA만 포함.

## 예정 작업

- [ ] 초기 세팅 커밋 분리 후 리뷰.
- [ ] 다음 feature부터 issue, branch, draft PR 흐름 적용.
- [ ] 기술 스택/디렉터리 구조 문서화 커밋.

## 진행 중 작업

- [x] 프로젝트 운영 규칙 문서화.
- [x] React/Vite/Vitest 초기 세팅.
- [x] GitHub MCP로 저장소 접근 확인.
- [x] GitHub MCP로 foundation issue 생성.
- [x] 현재 변경분 의미 단위 커밋.
- [x] main 직접 커밋은 빈 remote 초기 bootstrap 예외임을 문서화.
- [x] React 구현 검증에 `vercel:react-best-practices` 사용하도록 문서화.

## 완료 작업

- [x] `AGENTS.md` 생성.
- [x] `.md/` 작업 절차 문서 생성.
- [x] `.env.example`과 `.env` 분리.
- [x] `.gitignore`로 `.env`, `node_modules/`, `dist/`, `legacy/` 제외.
- [x] 앱 셸 smoke test 작성 및 통과.
- [x] 기술 스택/디렉터리 구조 문서 생성.

## 보류 작업

- [ ] draft PR 생성, 원격 push 이후 진행.
- [ ] Supabase schema/RLS/Edge Functions 구현, 별도 feature에서 진행.

## 커밋 장부

| Commit | 의미 단위 | 검증 | 비고 |
|---|---|---|---|
| `bdd2e25` | 프로젝트 작업 규칙과 GitHub 워크플로 문서화 | 문서 검토 | `AGENTS.md`, `.md/` 절차 문서 |
| `5d2bfba` | React/Vite/Vitest 기반 세팅과 앱 셸 smoke test | `npm test`, `npm run build` | TDD RED 확인 후 GREEN 구현 |
| `0c284ca` | RallyRoom 기획 아티팩트 등록 | 문서 추적 확인 | 최신 기획서 포함 `.md/` 기존 산출물 등록 |
| `200f925` | foundation 작업 로그의 실제 커밋 장부 반영 | `npm test`, `npm run build` | issue #1 기준 작업 로그 최신화 |
| 예정 | 기술 스택/디렉터리 구조와 React Best Practice 지침 반영 | `npm test`, `npm run build` | 현재 작업에서 커밋 예정 |

## React Best Practice 점검

- 대상 파일: `src/App.tsx`, `src/main.tsx`
- 컴포넌트 구조: 현재는 앱 셸 1개라 분리할 추가 컴포넌트 없음.
- hooks/state: hooks와 client state 없음.
- 접근성: `main`, `section`, `h1`, native `button` 사용.
- 성능: 리스트/메모이제이션 대상 없음.
- TypeScript: `any` 없음.
- 조치: 다음 React feature부터 `vercel:react-best-practices` 점검 결과를 PR과 feature 파일에 기록.

## 리뷰 장부

| Provider | 요청 방식 | 결과 | 적용/보류 판단 | 근거 |
|---|---|---|---|---|
| codex | draft PR 생성 후 `@codex review` | 대기 | 대기 | 초기 세팅 push/PR 후 진행 |

## 검증 명령

```bash
npm test
npm run build
```

검증 결과:

- `npm install`: 126 packages 설치, 취약점 0개.
- `npm test`: 통과.
- `npm run build`: 통과.
- `git status --ignored --short`: `.env`, `node_modules/`, `dist/`, `legacy/` ignore 확인.
- GitHub MCP: `earlydreamer/fan-vote-service` 접근 가능, issue #1 생성 완료.

## 결정 로그

- `legacy/`는 참조 전용으로 유지한다.
- 기능 구현은 초기 세팅 이후 issue/branch/PR 단위로 진행한다.
- 각 feature는 예정/진행/완료/보류 작업과 커밋 장부를 가진다.
- feature branch에서는 의미 단위 커밋을 쌓고 rebase/squash하지 않는다.
- 현재 main 직접 커밋은 빈 remote 초기 bootstrap 예외로 기록하고, 이후 작업은 feature branch와 draft PR을 필수로 한다.
- draft PR 상태에서 리뷰와 변경을 누적한다.
- 코드리뷰 기본 요청 대상은 `codex`, 대체 대상은 `coderabbit`이다.
- 기술 스택 또는 디렉터리 구조 변경 시 전용 문서를 같은 feature에서 갱신한다.
- React/TSX 구현 변경은 `vercel:react-best-practices` 기준으로 검증한다.
- CharaPick은 별도 최종안이 아니라 RallyRoom 내부 템플릿 후보로 취급한다.
- 신뢰 mutation은 클라이언트 직접 DB 쓰기가 아니라 command API 기준으로 설계한다.

## 남은 위험

- 의존성 설치에는 네트워크 접근이 필요할 수 있다.
- Supabase 실제 프로젝트 값은 아직 없다. `.env.example`에 플레이스홀더만 둔다.
- 초기 세팅 커밋은 `bdd2e25`, `5d2bfba`, `0c284ca`, `200f925`로 의미 단위 분리했다.

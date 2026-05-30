# RallyRoom 제출용 주요 프롬프트와 smoke 체크

작성일: 2026-05-30

## 목적

VibeX 과제 제출 항목 중 "사용한 주요 프롬프트"와 제출 직전 점검 항목을 정리한다. 이 문서는 실제 제출 메일에 그대로 복사할 수 있는 요약을 우선한다.

## 제출용 서비스 설명

RallyRoom은 팬이 직접 작은 투표방을 만들고, 투표, 미션, 팬월 메시지, 결과 카드로 참여 기록을 남기는 팬 주도 커뮤니티 서비스다. MVP에서는 실존 스타나 작품을 직접 사용하지 않고 가상 대상과 demo data만 사용한다. 팬이 얻은 RP, 투표권, 아이콘은 프로필에서 확인할 수 있고, 방 운영자는 Crew 대시보드에서 aggregate 지표를 볼 수 있다.

## 핵심 화면 흐름

1. 홈: Featured 투표, 카테고리 필터, 인기 투표 그리드, 마감 임박 투표를 탐색한다.
2. 투표방 만들기: 방 이름, 투표 제목, 주제, 카테고리, 대상, 후보 항목, 보상 비용을 입력하고 `create-room` command intent를 확인한다.
3. 방 상세: 후보 투표, 후보 항목 추가 intent, 미션 완료, 팬월 메시지 작성이 command boundary로 동작한다.
4. 결과 카드: 공개된 결과 카드와 미발행 결과 카드 발행 요청 흐름을 확인한다.
5. 내 활동: RP, 투표권, 획득 아이콘, 최근 보상 이력, 참여/생성 투표방을 확인한다.
6. Crew: 운영자용 aggregate 지표, 방별 vote/mission/message count, 다음 미션 추천을 확인한다.
7. 요금제: 향후 과금 방향과 fan/crew/official 확장 플랜을 보여준다.

## 사용한 주요 프롬프트 요약

### 1. 기획 정렬

```text
팬 커뮤니티 혹은 자유 주제 중 비즈니스와 연결될 수 있는 형태를 찾고 싶다.
단순 랜딩 페이지나 정보성 페이지가 아니라 정기 재방문과 과금 가치가 있는 구조여야 한다.
실존 스타와 제휴하지 않은 상태에서 공식성 오인을 피하고, 팬이 직접 투표/응원방을 만드는 구조를 검토해 달라.
응원방 단위, 투표, 포인트/아이콘 리워드, 공식 계정 확장 가능성을 포함해 현실적 제약과 보완 방향을 비판적으로 정렬해 달라.
```

### 2. 디자인 방향 재정의

```text
응원이라는 키워드에 매몰되지 말고 실제 행위는 vote에 가깝게 보라.
Featured, 카테고리 탐색, 관심 영역 콘텐츠가 보이는 탐색형 홈으로 구성하라.
2단 대시보드 느낌을 줄이고 넓은 카드 그리드와 명확한 카테고리 태그를 사용하라.
다크모드가 아니라 밝은 톤에서 트렌디하고 시원한 화면을 우선하라.
```

### 3. 개발 운영 정책

```text
모든 구현은 TDD 기반으로 진행한다.
기능 단위로 issue, feature branch, draft PR, Codex review, merge 절차를 따른다.
작업 진행 상태는 GitHub issue/PR 중심으로 관리하고, 로컬 진행도 파일은 git에 올리지 않는다.
Codex 리뷰 피드백은 follow-up issue로 이관하고, unresolved thread가 있으면 merge하지 않는다.
GitHub issue, PR, comment, review reply는 한국어로 작성한다.
```

### 4. 프론트엔드 구현

```text
기획서와 디자인 시스템을 기준으로 React/Vite/TypeScript MVP를 구현하라.
홈, 방 만들기, 방 상세, 투표, 미션, 팬월, 결과 카드, 프로필, Crew 대시보드가 demo data 기반으로 연결되어야 한다.
클라이언트는 vote_count, reward_rp, total_rp 같은 신뢰 필드를 직접 쓰지 말고 command API boundary를 보여줘야 한다.
```

### 5. 제출 준비

```text
VibeX 제출 전에 주요 프롬프트, 화면 흐름, 남은 범위, 검증 명령, 배포 체크리스트를 정리하라.
실제 Supabase 배포는 MVP 필수 범위가 아니며, 현재는 mockup flow와 아키텍처 설명을 우선한다.
```

## 로컬 smoke 체크리스트

로컬 서버:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

체크 대상:

- `/`: 홈 탐색, Featured, 카테고리 필터, 카드 그리드
- `/rooms/new`: 투표방 만들기 command preview
- `/rooms/room-stage-opening`: 투표, 후보 추가 intent, 미션, 팬월
- `/rooms/room-pixel-season/result`: 공개 결과 카드
- `/rooms/room-closed-finale/result`: 결과 카드 발행 요청
- `/profile`: 보상 이력과 참여/생성 투표방
- `/crew`: aggregate 운영 대시보드
- `/pricing`: 요금제와 확장 방향

## 검증 명령

```bash
git diff --check main..HEAD
npm test
npm run build
```

## 제출 시 남겨야 할 것

- 게시된 VibeX 서비스 URL
- 위 주요 프롬프트 요약
- 완성 범위: mockup MVP, demo data, command boundary
- 보류 범위: 실제 Supabase 배포, 결제, 실제 인증, 실시간 기능

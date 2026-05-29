# RallyRoom 2차 개발 기획서 보강 — 프론트엔드/백엔드 분리와 Supabase 보안 구조

작성일: 2026-05-29

작성 목적: 기존 `rallyroom_v2_supabase_planning_20260529.md`에서 모호했던 프론트엔드/백엔드 분리 방식을 구체화한다. 특히 React 클라이언트가 Supabase 테이블에 직접 신뢰 기반 insert/update를 수행하는 얇은 구현을 피하고, 투표·미션·포인트·결과 카드처럼 조작되면 서비스 신뢰가 무너지는 기능을 서버 측 명령 API와 DB 트랜잭션으로 통제하는 구조를 정의한다.

---

## 1. 결론

2차본은 **React 단독 앱 + Supabase 테이블 직접 조작**으로 가지 않는다.

최종 구조는 다음과 같은 하이브리드 백엔드 구조로 잡는다.

```text
React SPA
  ↓ public read / safe own-data read
Supabase PostgREST + RLS

React SPA
  ↓ command request
Supabase Edge Functions, BFF/API layer
  ↓ validated call
Postgres RPC / transaction functions
  ↓
Supabase Postgres + RLS + constraints
```

핵심 원칙은 다음이다.

- 프론트엔드는 UI와 사용자 입력 수집만 담당한다.
- 프론트엔드가 `vote_count`, `current_goal_value`, `reward_rp`, `reward_energy`, `total_rp`, `winner_candidate_id` 같은 신뢰 데이터 값을 직접 보내거나 수정하지 않는다.
- 방 생성, 투표, 미션 완료, 메시지 작성, 결과 카드 생성은 **명령 API(command API)** 로 처리한다.
- 명령 API는 Supabase Edge Functions를 우선 사용한다.
- 실제 데이터 일관성은 Postgres RPC 함수와 DB 제약 조건으로 다시 한 번 보장한다.
- RLS는 최종 방어선이다. RLS만으로 모든 비즈니스 규칙을 해결하려고 하지 않는다.

---

## 2. 왜 React 단독 + Supabase 직접 쓰기는 위험한가

RallyRoom의 핵심 루프는 다음이다.

```text
응원방 생성 → 투표/미션/팬월 참여 → RP/Room Energy 증가 → 결과 카드 생성 → 마이페이지/Crew 대시보드 반영
```

이 루프는 단순 CRUD가 아니다.

투표 한 번에는 다음 검증이 필요하다.

- 사용자가 로그인했는가?
- 방이 `active` 상태인가?
- 방의 마감 시간이 지나지 않았는가?
- 후보가 해당 방에 속하는가?
- 후보가 승인 상태인가?
- 이 사용자가 이미 이 방에서 투표했는가?
- 해당 vote mode에서 선택 개수 제한을 지켰는가?
- 후보 득표 수와 방 에너지 증가가 같은 트랜잭션으로 처리되는가?
- 사용자 RP, 방 멤버 기여도, activity event가 함께 반영되는가?

미션 완료도 마찬가지다.

- 미션이 해당 방에 속하는가?
- 미션이 활성 상태인가?
- `once` 미션인지 `daily` 미션인지 확인했는가?
- 오늘 이미 완료한 미션인가?
- 텍스트 미션이면 최소 길이와 금칙어를 검사했는가?
- 보상 값은 서버가 계산했는가?
- user_stats와 room_members가 같은 트랜잭션으로 갱신되는가?

이런 기능을 프론트에서 직접 테이블 insert/update로 처리하면 사용자가 브라우저 콘솔이나 API 호출을 통해 다음 조작을 시도할 수 있다.

- 같은 방에 여러 번 투표
- 후보 ID를 바꿔 다른 방 후보에 투표
- 마감된 방에 투표
- `reward_rp` 값을 크게 보내 포인트 조작
- `current_goal_value` 직접 증가
- `result_cards`를 임의 생성
- 방장이 아닌 사용자가 후보를 승인하거나 메시지를 숨김

따라서 2차 개발은 “프론트 요청을 DB가 믿는 구조”가 아니라, **프론트가 의도를 보내고 서버/DB가 검증·계산·기록하는 구조**로 설계한다.

---

## 3. 레이어별 책임

## 3.1 React Frontend

역할:

- 화면 렌더링
- 폼 입력
- UX용 1차 검증
- TanStack Query를 통한 읽기/캐싱
- Supabase Auth 세션 유지
- 명령 API 호출
- optimistic UI는 선택적으로 사용하되 실패 시 rollback

하지 말 것:

- 투표 수 직접 증가
- 포인트 직접 증가
- Room Energy 직접 증가
- 결과 카드 직접 생성
- 관리자 권한 판단을 프론트 조건문에만 의존
- service role key 보유

프론트에서 보내는 것은 “결과값”이 아니라 “사용자 의도”여야 한다.

예:

```ts
// 좋음
castVote({ roomId, candidateIds: [candidateId] })

// 나쁨
updateCandidate({ candidateId, voteCount: candidate.voteCount + 1 })
updateUserStats({ totalRp: user.totalRp + 20 })
```

---

## 3.2 Supabase Edge Functions — BFF/API Layer

역할:

- 클라이언트 명령 요청 수신
- JWT 기반 사용자 식별
- 입력 스키마 검증
- 요청당 rate limit 또는 간단한 abuse check
- Postgres RPC 호출
- 프론트에 필요한 DTO만 반환
- 필요 시 관리자/AI/배치 처리에서 service role 사용

우선 구현할 Edge Functions:

```text
create-room
cast-vote
complete-mission
post-room-message
publish-result-card
suggest-candidate, 선택
moderate-message, 관리자용
```

Edge Function은 가능하면 사용자의 Authorization 헤더를 유지한 Supabase client로 RPC를 호출한다. service role은 일반 사용자 명령에 남발하지 않는다. service role을 쓰는 경우 함수 내부에서 직접 권한 검증을 해야 한다.

---

## 3.3 Postgres RPC — 도메인 트랜잭션 계층

역할:

- 한 번의 사용자 행동을 하나의 트랜잭션으로 처리
- DB 내부에서 최종 검증 수행
- 후보 카운터, 방 게이지, 사용자 통계, 방 멤버 통계를 원자적으로 갱신
- 중복 투표/중복 미션 완료 방지
- 결과 카드 winner/top message 계산

우선 구현할 RPC:

```text
public.create_room_with_defaults(...)
public.cast_room_vote(...)
public.complete_room_mission(...)
public.post_room_message(...)
public.publish_result_card(...)
```

RPC는 단순히 “테이블 insert 편의 함수”가 아니라, RallyRoom의 실제 백엔드 비즈니스 로직이다.

---

## 3.4 Supabase Postgres + RLS + Constraints

역할:

- 인증된 사용자와 비인증 사용자의 데이터 접근 제어
- 방장/참여자/관리자 권한 제어
- public read와 private write 구분
- DB 제약 조건으로 우회 조작 방지
- SQL view로 대시보드 집계 제공

RLS는 필수지만, RLS 하나로 모든 검증을 해결하지 않는다. RLS는 “누가 어떤 row에 접근 가능한가”를 담당하고, 비즈니스 규칙은 RPC와 제약 조건에서 처리한다.

---

## 4. 직접 Supabase 접근 허용 범위

## 4.1 클라이언트 직접 SELECT 허용

다음 데이터는 RLS가 켜진 상태에서 클라이언트가 직접 읽어도 된다.

```text
categories
- active category 목록

targets
- selectable demo target 목록

rooms
- public/link_only active/result_published room 목록
- 비공개 방은 member만 읽기

room_candidates
- approved candidate만 공개 읽기

room_missions
- active mission만 공개 읽기

room_messages
- visible/selected message만 공개 읽기

result_cards
- public room의 result card 공개 읽기

profiles
- 공개 프로필 일부만 읽기

user_stats
- 자신의 stats만 읽기
```

읽기 쿼리는 TanStack Query로 관리한다.

## 4.2 클라이언트 직접 INSERT/UPDATE 금지

다음 테이블은 클라이언트가 직접 쓰지 않는다. 반드시 Edge Function/RPC를 통한다.

```text
rooms
room_candidates
ballots
ballot_items
mission_completions
room_messages
room_members
user_stats
reward_definitions
user_rewards
result_cards
activity_events
```

예외적으로 `profiles`의 자기 프로필 수정, `reports`의 신고 생성 정도는 직접 insert/update를 허용할 수 있다. 그래도 MVP에서는 `submit-report` 같은 함수로 통일해도 된다.

## 4.3 왜 room_messages도 직접 insert하지 않는가

팬월 메시지는 단순 댓글처럼 보이지만, RallyRoom에서는 다음과 연결된다.

- 응원 메시지 작성 미션 완료
- RP 지급
- Room Energy 증가
- 결과 카드 top message 후보
- 신고/숨김/채택 정책

따라서 메시지 작성도 직접 insert가 아니라 `post-room-message` 명령으로 처리한다.

---

## 5. API / Command 설계

## 5.1 공통 규칙

모든 command API는 다음 구조를 가진다.

```text
Request
- Authorization: Bearer <supabase access token>
- JSON body

Server validation
- user 확인
- zod 등으로 payload schema 검증
- rate limit, 선택
- RPC 호출

Response
- 성공 시 domain DTO 반환
- 실패 시 표준 error code 반환
```

표준 에러 코드:

```text
UNAUTHENTICATED
FORBIDDEN
ROOM_NOT_FOUND
ROOM_NOT_ACTIVE
ROOM_CLOSED
INVALID_TARGET
INVALID_CANDIDATE
DUPLICATE_VOTE
DUPLICATE_MISSION_COMPLETION
INVALID_MISSION
VALIDATION_ERROR
RATE_LIMITED
```

---

## 5.2 create-room

Endpoint:

```text
POST /functions/v1/create-room
```

Client request:

```json
{
  "title": "던전 옆 작은 식당 캐릭터 월드컵",
  "description": "이번 주 가장 응원하고 싶은 캐릭터를 골라주세요.",
  "categoryId": "uuid",
  "primaryTargetId": "uuid",
  "voteMode": "pick",
  "topic": "이번 주 가장 응원하고 싶은 캐릭터는?",
  "candidateTargetIds": ["uuid", "uuid", "uuid"],
  "customCandidates": [],
  "endAt": "2026-06-05T14:59:59.000Z",
  "goalValue": 500,
  "rewardIcon": "🌟",
  "allowCandidateSuggestion": false,
  "resultVisibility": "after_vote"
}
```

Server validation:

- 로그인 사용자만 가능
- title/topic 길이 제한
- 금칙어/공식성 오인 단어 검사: 공식, 인증, 소속사, 전달 보장 등
- `primaryTargetId`가 selectable target인지 확인
- 후보가 최소 2개 이상인지 확인
- 후보가 같은 상위 target 또는 허용된 범위에 속하는지 확인
- `endAt > now()`이고 최대 기간을 넘지 않는지 확인
- rewardIcon은 허용 목록에서만 선택

DB transaction:

- rooms 생성
- room_candidates 생성
- 기본 room_missions 생성
- room_members에 방장 추가
- user_stats.created_room_count 증가
- activity_events 기록

Response:

```json
{
  "roomId": "uuid",
  "slug": "dungeon-kitchen-character-pick",
  "redirectTo": "/rooms/uuid"
}
```

---

## 5.3 cast-vote

Endpoint:

```text
POST /functions/v1/cast-vote
```

Client request:

```json
{
  "roomId": "uuid",
  "candidateIds": ["uuid"]
}
```

Server validation:

- 로그인 사용자만 가능
- room exists
- room.status = active
- room.end_at > now()
- vote_mode가 현재 지원되는 방식인지 확인
- candidate가 해당 room에 속하고 approved 상태인지 확인
- 한 유저가 같은 room에 이미 ballot을 만들었는지 확인
- multi_pick이면 선택 개수 제한 확인

DB transaction:

- ballots 생성
- ballot_items 생성
- room_candidates.vote_count 증가
- rooms.current_goal_value 증가
- room_members upsert 및 contributed_energy/earned_rp 증가
- user_stats.vote_count/total_rp/weekly_rp 갱신
- vote mission 자동 완료, 선택
- activity_events 기록

Response:

```json
{
  "roomId": "uuid",
  "myBallotId": "uuid",
  "awardedRp": 10,
  "awardedEnergy": 2,
  "roomEnergy": 132,
  "candidates": [
    { "id": "uuid", "voteCount": 32 },
    { "id": "uuid", "voteCount": 27 }
  ]
}
```

프론트는 이 응답으로 UI를 갱신한다. 프론트가 voteCount를 계산해서 DB에 쓰지 않는다.

---

## 5.4 complete-mission

Endpoint:

```text
POST /functions/v1/complete-mission
```

Client request:

```json
{
  "roomId": "uuid",
  "missionId": "uuid",
  "textValue": "토토 없이는 이 식당도 없다!"
}
```

Server validation:

- 로그인 사용자만 가능
- mission이 해당 room에 속하는지 확인
- mission.is_active 확인
- repeat_rule이 once면 기존 완료 여부 확인
- repeat_rule이 daily면 오늘 완료 여부 확인
- text mission이면 최소 글자 수 확인
- 필요하면 금칙어/도배 패턴 검사

DB transaction:

- mission_completions 생성
- reward_rp/reward_energy는 DB의 mission 설정값에서 가져옴
- rooms.current_goal_value 증가
- room_members upsert 및 energy/rp 증가
- user_stats 갱신
- reward 조건 충족 시 user_rewards 지급
- activity_events 기록

Response:

```json
{
  "missionId": "uuid",
  "awardedRp": 15,
  "awardedEnergy": 5,
  "newTotalRp": 240,
  "newRoomEnergy": 188,
  "earnedRewards": [
    { "code": "first_mission", "name": "첫 미션 완료", "icon": "🌟" }
  ]
}
```

---

## 5.5 post-room-message

Endpoint:

```text
POST /functions/v1/post-room-message
```

Client request:

```json
{
  "roomId": "uuid",
  "type": "cheer",
  "body": "오늘도 응원합니다!"
}
```

Server validation:

- 로그인 사용자만 가능
- room이 active/result_published 중 메시지 허용 상태인지 확인
- body 길이 제한
- 금칙어/도배 검사
- 동일 방에서 짧은 시간 내 연속 작성 제한

DB transaction:

- room_messages 생성
- 메시지 보상 정책에 따라 RP/Energy 지급
- 관련 text mission 자동 완료 가능
- activity_events 기록

Response:

```json
{
  "message": {
    "id": "uuid",
    "body": "오늘도 응원합니다!",
    "createdAt": "..."
  },
  "awardedRp": 10,
  "awardedEnergy": 3
}
```

---

## 5.6 publish-result-card

Endpoint:

```text
POST /functions/v1/publish-result-card
```

Client request:

```json
{
  "roomId": "uuid"
}
```

Server validation:

- room owner 또는 admin만 수동 발행 가능
- 또는 room.end_at이 지났고 자동 발행 조건 충족
- 이미 result_card가 있으면 중복 생성 금지

DB transaction:

- winner candidate 계산
- total participants/votes/energy 계산
- selected/top messages 계산
- result_cards 생성
- rooms.status = result_published 갱신
- room 참여자에게 결과 카드 확인 미션/보상 조건 부여, 선택
- activity_events 기록

Response:

```json
{
  "resultCardId": "uuid",
  "redirectTo": "/rooms/uuid/result"
}
```

---

## 6. RLS / 권한 정책 구체화

## 6.1 기본 전략

1. 모든 public table에 RLS enable.
2. 공개 읽기가 필요한 테이블에만 SELECT policy 제공.
3. 핵심 쓰기 테이블에는 클라이언트 직접 INSERT/UPDATE policy를 만들지 않는다.
4. 명령 RPC는 `security definer`를 사용할 수 있으나 반드시 내부에서 `auth.uid()` 기반 권한 검증을 한다.
5. `security definer` 함수는 `search_path`를 명시한다.
6. admin 여부는 `profiles.role = 'admin'` 기준으로 검사한다.

## 6.2 예시 정책 방향

### categories / targets

```text
SELECT: is_active = true / is_selectable = true인 row는 누구나 읽기
INSERT/UPDATE/DELETE: admin만
```

### rooms

```text
SELECT:
- visibility = public 이고 status in active, closed, result_published
- link_only는 URL 접근 사용자를 위해 MVP에서는 public과 동일 처리 가능
- private는 room_members만

INSERT:
- 직접 insert 금지. create_room_with_defaults RPC만 사용

UPDATE:
- 직접 update 금지 또는 방장/admin이 title/description 등 일부 필드만 수정 가능
- vote_count, current_goal_value, status 등 핵심 상태는 RPC만 수정
```

### room_candidates

```text
SELECT:
- approved 후보는 공개 읽기
- pending 후보는 방장/admin/제안자만 읽기

INSERT:
- 직접 insert 금지. create-room 또는 suggest-candidate 함수 사용

UPDATE:
- 방장/admin의 승인/거절 함수만 사용
```

### ballots / ballot_items

```text
SELECT:
- 사용자는 자기 ballot만 읽기
- 공개 결과는 aggregate view로 제공

INSERT/UPDATE/DELETE:
- 직접 조작 금지. cast_room_vote RPC만 사용
```

### mission_completions

```text
SELECT:
- 사용자는 자기 완료 기록만 읽기
- 방장은 자기 방의 aggregate만 view로 확인

INSERT/UPDATE/DELETE:
- 직접 조작 금지. complete_room_mission RPC만 사용
```

### room_messages

```text
SELECT:
- visible/selected 메시지는 공개 읽기
- hidden/reported는 작성자/방장/admin만 제한적으로

INSERT:
- 직접 insert 금지. post_room_message 함수 사용

UPDATE:
- 작성자는 삭제 요청 정도만
- 방장/admin은 hide/select/moderate 함수 사용
```

### user_stats / user_rewards

```text
SELECT:
- 사용자는 자기 stats/rewards 읽기
- public profile에 표시되는 요약은 view로 별도 제공

INSERT/UPDATE:
- 직접 조작 금지. RPC만 갱신
```

### activity_events

```text
INSERT:
- 직접 insert를 열 수도 있지만, 지표 오염 방지를 위해 record_activity_event 함수 또는 Edge Function 경유 권장

SELECT:
- admin/crew 대시보드용 aggregate view만 제공
```

---

## 7. DB 제약 조건과 인덱스

RLS와 API 검증만으로는 부족하다. DB 차원의 제약 조건을 둔다.

## 7.1 주요 constraints

```sql
-- 방 기간
alter table public.rooms
  add constraint rooms_valid_period check (end_at > start_at);

-- 목표값
alter table public.rooms
  add constraint rooms_goal_positive check (goal_value > 0);

-- 후보 제목 길이
alter table public.room_candidates
  add constraint room_candidates_title_length check (char_length(title) between 1 and 80);

-- 메시지 길이
alter table public.room_messages
  add constraint room_messages_body_length check (char_length(body) between 1 and 500);

-- 미션 보상 음수 금지
alter table public.room_missions
  add constraint room_missions_reward_non_negative check (reward_rp >= 0 and reward_energy >= 0);
```

## 7.2 중복 방지 unique index

```sql
-- 한 사용자는 한 방의 특정 vote_mode에서 ballot 1개
create unique index ballots_unique_room_user_mode
on public.ballots(room_id, user_id, vote_mode);

-- 미션 daily 중복 완료 방지
create unique index mission_completions_unique_daily
on public.mission_completions(mission_id, user_id, completed_on);

-- 같은 방 안 후보 제목 중복 방지, 선택
create unique index room_candidates_unique_title_per_room
on public.room_candidates(room_id, lower(title))
where status in ('approved', 'pending');
```

## 7.3 조회 성능 인덱스

```sql
create index rooms_status_end_at_idx on public.rooms(status, end_at);
create index rooms_category_status_idx on public.rooms(category_id, status);
create index rooms_created_by_idx on public.rooms(created_by);
create index room_candidates_room_status_idx on public.room_candidates(room_id, status);
create index room_messages_room_status_created_idx on public.room_messages(room_id, status, created_at desc);
create index activity_events_room_created_idx on public.activity_events(room_id, created_at desc);
```

---

## 8. 대시보드용 View / Aggregate

Crew 대시보드가 모든 row를 직접 읽으면 안 된다. 방장에게 필요한 집계만 제공한다.

## 8.1 room_public_stats view

```text
room_id
participant_count
vote_count
mission_completion_count
message_count
current_goal_value
top_candidate_id
updated_at
```

읽기:

- public room에 대해서는 공개 가능
- private room은 room owner/member만

## 8.2 crew_room_stats view

```text
room_id
created_by
view_count
participant_count
vote_count
mission_completion_rate
message_count
result_card_generated
report_count
```

읽기:

- 방장 또는 admin만

## 8.3 admin_platform_stats view

```text
total_users
active_rooms
created_rooms_7d
votes_7d
missions_7d
messages_7d
result_cards_7d
report_pending_count
```

읽기:

- admin만

---

## 9. 배포 구조

## 9.1 권장 배포

```text
Frontend:
- Vercel 또는 Cloudflare Pages
- 정적 SPA
- env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

Backend:
- Supabase Edge Functions
- Supabase Postgres
- Supabase Auth
- Supabase RLS

Database migrations:
- supabase/migrations/*.sql
```

프론트 배포 위치가 Vercel이든 Cloudflare Pages든, 백엔드 command API는 Supabase Edge Functions에 두면 프론트 호스팅과 백엔드 책임이 분리된다.

## 9.2 대안 구조

### 대안 A: Vercel Serverless Functions BFF

```text
React on Vercel → /api/* Vercel Functions → Supabase RPC/DB
```

장점:

- Vercel 배포와 통합이 쉽다.
- Node 기반으로 작성 가능하다.

단점:

- Cloudflare Pages로 옮기면 API 레이어도 다시 옮겨야 한다.
- Supabase와 가까운 인증/정책 흐름은 Edge Functions가 더 자연스럽다.

### 대안 B: Cloudflare Pages Functions / Workers BFF

```text
React on Cloudflare Pages → Pages Functions/Workers → Supabase RPC/DB
```

장점:

- Cloudflare 생태계와 잘 맞는다.
- Workers 기반 확장이 가능하다.

단점:

- 과제 단기 배포에서는 설정이 늘 수 있다.

### 최종 선택

과제용 2차본은 **Supabase Edge Functions를 기본 BFF**로 둔다. 프론트는 Vercel에 올리든 Cloudflare Pages에 올리든 동일한 백엔드 endpoint를 호출한다.

---

## 10. 구현 우선순위

## P0. Supabase 직접 쓰기 금지 규칙 반영

- 프론트에서 insert/update하는 테이블을 식별한다.
- 핵심 mutation은 command function으로 이동한다.
- 프론트 data layer에서 `supabase.from('ballots').insert(...)` 같은 코드를 만들지 않는다.

## P1. 최소 Edge Function 3개

시간이 부족하면 우선 다음 3개만 만든다.

```text
create-room
cast-vote
complete-mission
```

이 3개가 있으면 핵심 루프의 절반 이상이 안전해진다.

## P2. post-room-message / publish-result-card 추가

팬월과 결과 카드가 RallyRoom의 정체성을 만든다. 두 번째로 추가한다.

## P3. Crew 대시보드 집계 view

Crew 대시보드는 직접 row 조회가 아니라 aggregate view로 만든다.

## P4. Admin/moderation

관리자 기능은 과제 MVP에서는 얕게 구현해도 된다. 단, 구조상 admin만 볼 수 있는 페이지와 report queue는 보여준다.

---

## 11. Codex 작업 프롬프트 갱신

## 11.1 아키텍처 수정 프롬프트

```text
현재 RallyRoom 2차 개발 기획은 Supabase를 사용하지만, React 클라이언트가 DB 테이블에 직접 insert/update하는 구조가 되면 투표/포인트/미션 보상 조작 위험이 있다.

프로젝트 아키텍처를 다음 원칙으로 수정해줘.

1. React 프론트엔드는 공개 데이터 read와 자기 데이터 read만 Supabase client로 직접 수행한다.
2. 방 생성, 투표, 미션 완료, 팬월 메시지 작성, 결과 카드 생성은 직접 테이블 insert/update를 하지 않는다.
3. 위 핵심 mutation은 Supabase Edge Functions를 통해 command API로 호출한다.
4. Edge Function은 JWT를 확인하고 payload를 검증한 뒤 Postgres RPC를 호출한다.
5. Postgres RPC는 실제 DB 트랜잭션을 처리하고, RP/Room Energy/vote_count/result_card를 서버 측에서 계산한다.
6. service_role key는 프론트에 절대 노출하지 않는다.
7. 모든 테이블에는 RLS를 켜고, 핵심 쓰기 테이블에는 직접 INSERT/UPDATE policy를 만들지 않는다.
8. 프론트는 vote_count, reward_rp, current_goal_value, total_rp 같은 신뢰 필드를 직접 보내지 않는다.

이 기준에 맞춰 docs/ARCHITECTURE.md와 docs/BACKEND_COMMANDS.md를 작성해줘.
```

## 11.2 스키마/RLS 프롬프트

```text
RallyRoom의 Supabase schema를 RLS와 command API 전제에 맞춰 작성해줘.

요구사항:
1. 모든 public table에 RLS enable.
2. categories, targets, public active rooms, approved room_candidates, visible room_messages, result_cards는 SELECT policy를 둔다.
3. rooms, room_candidates, ballots, ballot_items, mission_completions, user_stats, user_rewards, result_cards는 클라이언트 직접 INSERT/UPDATE를 허용하지 않는다.
4. 핵심 쓰기는 create_room_with_defaults, cast_room_vote, complete_room_mission, post_room_message, publish_result_card RPC로 처리한다.
5. RPC는 security definer를 사용할 경우 search_path를 명시하고, 함수 내부에서 auth.uid()와 room ownership/admin 권한을 직접 검사한다.
6. 중복 투표, 중복 미션 완료, 잘못된 후보 투표를 막는 unique index와 check constraint를 추가한다.
7. crew_room_stats, room_public_stats view를 만들어 대시보드가 집계 데이터만 읽도록 한다.
```

## 11.3 Edge Function 프롬프트

```text
Supabase Edge Functions로 RallyRoom command API를 구현해줘.

함수:
- create-room
- cast-vote
- complete-mission
- post-room-message
- publish-result-card

공통 요구사항:
1. Authorization header의 Supabase JWT를 사용한다.
2. 인증되지 않은 사용자는 UNAUTHENTICATED를 반환한다.
3. zod 또는 명확한 TypeScript validation 함수로 payload를 검증한다.
4. Edge Function 안에서 직접 여러 테이블을 수정하지 말고, Postgres RPC를 호출한다.
5. RPC 응답을 프론트용 DTO로 정리해서 반환한다.
6. service_role은 일반 사용자 함수에서 사용하지 않는다. 반드시 필요할 경우 이유를 주석으로 남기고 권한 검사를 함수 안에서 수행한다.
```

---

## 12. 최종 기획 반영 문장

2차 개발 기획서에는 다음 문장을 추가한다.

> 2차본은 React 단독 구현이 아니라 Supabase를 백엔드 플랫폼으로 사용하는 구조다. 단, 클라이언트가 Supabase 테이블을 직접 신뢰 기반으로 조작하지 않도록, 공개 읽기와 사용자 소유 데이터 조회만 직접 허용하고, 방 생성·투표·미션 완료·메시지 작성·결과 카드 생성은 Supabase Edge Functions와 Postgres RPC를 통해 처리한다. RLS는 접근 제어의 최종 방어선이며, RallyRoom의 핵심 비즈니스 규칙은 서버 측 명령 API와 DB 트랜잭션에서 검증한다.

---

## 13. 최종 판단

이 구조라면 RallyRoom 2차본은 “React 단독 + Supabase DB 붙인 얇은 데모”가 아니라, 다음에 가까워진다.

```text
프론트엔드: React/Vite/TypeScript SPA
백엔드 API: Supabase Edge Functions
도메인 트랜잭션: Postgres RPC
데이터/권한: Supabase Postgres + RLS + constraints
배포: Vercel 또는 Cloudflare Pages + Supabase
```

과제 기간을 고려하면 모든 기능을 완벽하게 만들 필요는 없다. 하지만 최소한 `create-room`, `cast-vote`, `complete-mission` 세 명령은 프론트 직접 DB 쓰기가 아니라 서버 측 명령으로 처리해야 한다. 그래야 RallyRoom의 핵심인 투표, 미션, 포인트, 방 에너지가 조작 가능한 로컬 장난감처럼 보이지 않는다.

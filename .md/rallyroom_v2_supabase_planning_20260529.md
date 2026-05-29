# RallyRoom 2차 개발 기획서 — Supabase/Vercel/Cloudflare 전환안

작성일: 2026-05-29  
작성 목적: VibeX 무료 토큰 소진 이후, VibeX 1차 산출물은 과제 요건 대응용 프로토타입으로 보존하고, Codex/Claude 기반으로 RallyRoom 2차 완성본을 독립 앱으로 재구축하기 위한 기획·구현 지침을 정의한다.

---

## 1. 이번 갱신의 핵심 판단

### 1.1 VibeX 1차본의 역할

VibeX 1차 산출물은 **과제 요구사항상 VibeX 도메인 퍼블리싱 요건을 충족하는 제출용 프로토타입**으로 보존한다.

1차본은 다음 성과를 남긴다.

- RallyRoom이라는 서비스 컨셉을 VibeX에서 빠르게 생성했다.
- 홈, 응원방 만들기, 응원방 상세, 마이페이지, 요금제, 로그인/회원가입, 관리자 대시보드, CRUD 화면 등 주요 페이지 골격을 확보했다.
- 투표, 미션, 포인트, 결과 카드, 관리자 기능의 대략적인 인터랙션 방향을 확인했다.
- VibeX 내부 무료 토큰 한계에서 도메인/화면 구조/프롬프트 협업 과정을 보여줄 수 있다.

하지만 1차본은 다음 한계가 있다.

- VibeX Entity/API와 자체 관리자 도구에 의존한다.
- 대부분 JSX 기반이며 도메인 타입 정의가 없다.
- 투표와 포인트는 브라우저 로컬 상태에 크게 의존한다.
- 생성한 방, 투표, 미션, 결과 카드, Crew 지표가 하나의 DB 모델로 연결되지 않았다.
- 자동 생성 디자인 언어가 과하고, RallyRoom만의 브랜드 정체성이 충분히 정돈되지 않았다.

따라서 2차 개발은 1차본을 직접 이어붙이는 방식이 아니라, **기획과 페이지 목록은 승계하되, 데이터 모델·디자인 시스템·프론트 구조는 새로 정리하는 재구축**으로 간다.

### 1.2 2차본의 역할

2차본은 다음 목적을 가진다.

- 실제 배포 가능한 독립 웹앱으로 RallyRoom의 핵심 루프를 증명한다.
- Supabase를 이용해 인증, DB, RLS, 저장소를 대체한다.
- Vercel 또는 Cloudflare Pages 위에 React + TypeScript 기반 프론트엔드를 배포한다.
- VibeX에서 제공하던 어드민/DB 관리자 의존성을 제거하고, 앱 내부 Crew/Admin 대시보드로 대체한다.
- 평가자에게 “VibeX로 아이디어를 빠르게 구조화했고, 이후 외부 AI 도구로 구조를 보강했다”는 사고 과정을 보여준다.

### 1.3 제출 전략

과제 안내에는 VibeX 도메인 퍼블리싱이 필수로 명시되어 있으므로, 제출 메일에서는 다음 순서를 권장한다.

1. **필수 제출 URL**: VibeX 도메인으로 게시한 1차 프로토타입
2. **추가 개선본 URL**: Codex/Claude로 보강한 2차 독립 배포본, 예: Vercel 또는 Cloudflare Pages
3. **사용한 주요 프롬프트**: VibeX 1차 생성 프롬프트와 이후 외부 AI 도구를 활용한 구조화/리팩터링 프롬프트
4. **설명 문장**: “VibeX로 빠르게 1차 프로토타입을 생성한 뒤, 무료 토큰 한계로 인해 외부 AI 도구를 활용해 TypeScript/Supabase 기반으로 추가 개선본을 제작했습니다.”

2차본만 단독 제출하는 것은 VibeX 도메인 필수 조건을 놓칠 수 있으므로 위험하다. 2차본은 “대체물”이 아니라 “개선본/비교본”으로 제출하는 편이 안전하다.

---

## 2. 최종 서비스 정의 유지

### 2.1 서비스명

**RallyRoom**

### 2.2 한 줄 정의

RallyRoom은 팬이 직접 작은 응원방을 만들고, 투표·미션·팬월·결과 카드로 응원 기록을 남기는 팬 주도 마이크로 캠페인 플랫폼이다.

### 2.3 핵심 객체

서비스의 핵심 객체는 여전히 **응원방(Room)**이다.

```text
응원방 = 응원 대상 + 진행 방식 + 투표 주제 + 후보 + 기간 + 미션 + 보상 + 결과 카드
```

### 2.4 핵심 루프

```text
팬이 응원방을 만든다
→ 카테고리/대상 DB에서 응원 대상을 선택한다
→ 투표/티어/토너먼트/미션/팬월에 참여한다
→ RP와 Room Energy가 증가한다
→ 마감 후 결과 카드가 생성된다
→ 마이페이지와 Crew 대시보드에 기록과 지표가 남는다
→ 결과 카드에서 다음 응원방 생성으로 이어진다
```

### 2.5 정책상 유지해야 할 것

- 실존 스타/작품/브랜드를 무단으로 전면 사용하지 않는다.
- MVP의 대상 데이터는 가상 샘플 DB로 구성한다.
- 공식 팬클럽, 공식 투표, 공식 반영을 암시하지 않는다.
- 유료 투표권 판매 또는 돈으로 순위를 사는 구조를 만들지 않는다.
- 전체 팬덤 통합 랭킹을 만들지 않는다.
- 랭킹과 결과는 응원방 내부 또는 같은 템플릿 내부에만 제한한다.
- AI는 핵심 약속이 아니라 보조 기능으로 둔다. 예: 미션 추천, 결과 카드 문구 생성, 팬 키워드 요약, 운영자 인사이트.

---

## 3. 2차 개발 기술 스택

### 3.1 권장 스택

```text
Frontend
- Vite
- React
- TypeScript
- React Router
- TanStack Query
- Zustand, 단 UI/local draft 상태에만 제한
- Tailwind CSS
- Radix UI 또는 shadcn/ui 기반 컴포넌트
- lucide-react

Backend / BaaS
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- Supabase Storage, 선택
- Supabase Edge Functions, 선택

Deployment
- 1안: Vercel
- 2안: Cloudflare Pages

Development
- Codex 중심 구현
- Claude 보조 리뷰/문서화
- GitHub 저장소 기반 작업
```

### 3.2 왜 Vite + React + TypeScript인가

기존 VibeX 산출물이 Vite/React 구조이므로 페이지 단위 이전이 쉽다. Next.js로 옮기면 SSR/라우팅/배포 설정이 늘어나고, 과제 마감성 프로젝트에서는 과도한 전환 비용이 생긴다.

이번 2차본은 SEO 서비스가 아니라 **상호작용형 프로토타입**이므로 Vite SPA가 적합하다. 서버 렌더링보다 중요한 것은 응원방 생성, 투표, 미션, 결과 카드, Crew 대시보드의 동작 연결이다.

### 3.3 Supabase 선택 이유

Supabase는 RallyRoom에 필요한 핵심 요소를 한 번에 제공한다.

- 인증: 이메일/패스워드 또는 소셜 로그인
- DB: Postgres 기반의 관계형 데이터 모델
- 권한: RLS로 방장/참여자/관리자 권한 분리
- Storage: 결과 카드 이미지나 프로필 이미지 저장 시 사용 가능
- Realtime: 나중에 실시간 투표/팬월을 확장할 때 사용 가능
- TypeScript 타입 생성: DB 스키마에서 타입을 생성해 프론트 안전성 강화

### 3.4 Vercel vs Cloudflare Pages

#### Vercel 우선 추천

이유:

- Vite React 배포가 단순하다.
- GitHub 연동과 환경변수 설정이 빠르다.
- 과제 제출용 단기 배포에 적합하다.
- `pnpm build` → `dist` 배포 흐름이 간단하다.

#### Cloudflare Pages 대안

이유:

- 정적 SPA 배포에 적합하다.
- Cloudflare Workers/Pages Functions를 붙이면 Edge API 확장이 가능하다.
- 장기적으로 Cloudflare Tunnel/Workers 등과 묶을 수 있다.

#### 결론

과제 제출 속도를 우선하면 **Vercel**.  
향후 Cloudflare 생태계까지 공부하려면 **Cloudflare Pages**.  
이번 2차 제출본은 Vercel을 기본 경로로 잡고, Cloudflare Pages는 대체 경로로 문서화한다.

---

## 4. VibeX 1차본에서 가져올 것과 버릴 것

### 4.1 가져올 것

- 페이지 목록
- RallyRoom의 도메인 컨셉
- 홈 → 방 만들기 → 방 상세 → 참여 → 결과 카드 → 마이페이지 → Crew 대시보드 흐름
- 일부 마이크로카피
- 투표 결과 프로그레스 바 패턴
- 미션 완료 후 포인트/아이콘이 증가하는 피드백 패턴
- 관리자 CRUD가 필요하다는 인식

### 4.2 버릴 것

- VibeX Entity API
- VibeX 자체 관리자/DB 관리자 의존
- 로컬스토리지에 의존하는 투표/포인트 핵심 데이터
- `res.data.data` 형태의 불안정한 API 응답 처리
- 자유 텍스트 기반 응원 대상 입력
- 과한 violet→cyan 프리즘 그라데이션 남발
- Free/Pro/Team 요금제명
- CRUD 중심 관리자 대시보드
- 실제 동작과 연결되지 않는 “실시간” 표현

### 4.3 변환할 것

| 1차본 요소 | 2차본 변환 |
|---|---|
| Category/RallyRoom/ResultCard/User 4개 엔티티 | profiles, categories, targets, rooms, candidates, ballots, votes, missions, completions, messages, result_cards, activity_events |
| 관리자 CRUD | Crew 대시보드 + Platform Admin 대시보드 |
| 자유 입력 응원 대상 | 큐레이션 Target DB 선택 |
| 로컬 투표 상태 | Supabase DB + RLS + RPC |
| 로컬 포인트 | user_stats / user_rewards |
| 결과 카드 탭 | result_cards 테이블 + 결과 카드 상세 라우트 |
| 프리즘 디자인 | Signal Board 디자인 시스템 |

---

## 5. 2차본 페이지 목록

페이지 목록은 기획에 정의한 대로 유지한다. 단, VibeX 자동생성 흐름을 그대로 쓰지 않고 RallyRoom 도메인 루프 중심으로 재설계한다.

### 5.1 Public / User Pages

```text
/
/home
/rooms/new
/rooms/:roomId
/rooms/:roomId/result
/me
/pricing
/login
/register
```

### 5.2 Crew / Admin Pages

```text
/crew
/crew/rooms/:roomId
/admin
/admin/rooms
/admin/users
/admin/categories
/admin/targets
/admin/reports
```

### 5.3 페이지별 역할

| 페이지 | 역할 |
|---|---|
| 홈 | 응원방 만들기 CTA, 새로 열린 방, 마감 임박, 참여가 활발한 방, 템플릿 소개 |
| 응원방 만들기 | 5단계 wizard로 카테고리/대상/진행방식/후보/기간/보상 설정 |
| 응원방 상세 | 투표, 미션, 팬월, 목표 게이지, 내부 랭킹, 비공식 고지 |
| 결과 카드 | 마감 후 남는 기록. 우승 후보, 참여 수, 인기 메시지, 다음 방 CTA |
| 마이페이지 | RP, 배지, 아이콘, 참여한 방, 만든 방, 내 메시지/결과 카드 |
| Crew 대시보드 | 방별 참여율, 미션 완료율, 팬 키워드, AI 추천 액션 |
| Admin 대시보드 | 사용자/방/대상 DB/신고 관리, 템플릿 성과 |
| 요금제 | Free, Fan Plus, Room Crew, Official Beta 설명. 실제 결제 없음 |

---

## 6. Supabase 데이터 모델

### 6.1 핵심 설계 원칙

- 클라이언트에서 Supabase anon key를 사용하므로 모든 테이블에 RLS를 켠다.
- 핵심 행동인 투표, 미션 완료, 결과 카드 생성은 가능하면 RPC로 처리한다.
- MVP에서는 실제 결제, 공식 계정 인증, 이미지 업로드를 구현하지 않는다.
- 모든 응원 대상은 가상 Target DB에서 선택한다.
- 방장 권한과 관리자 권한을 구분한다.

### 6.2 Enum 정의

```sql
create type app_role as enum ('fan', 'room_crew', 'admin', 'official_pending', 'official');
create type user_plan as enum ('free', 'fan_plus', 'room_crew', 'official_beta');
create type target_type as enum ('creator', 'work', 'character', 'team', 'event', 'scene', 'topic');
create type official_status as enum ('demo', 'unofficial', 'official');
create type room_status as enum ('draft', 'active', 'closed', 'result_published', 'archived');
create type room_visibility as enum ('public', 'link_only', 'private');
create type vote_mode as enum ('pick', 'multi_pick', 'tier', 'tournament', 'message');
create type result_visibility as enum ('live', 'after_vote', 'after_close');
create type candidate_source as enum ('target_db', 'room_owner', 'user_suggestion');
create type candidate_status as enum ('approved', 'pending', 'rejected');
create type vote_value as enum ('pick', 'up', 'down', 'skip');
create type mission_type as enum ('checkin', 'vote', 'text', 'question', 'share_card', 'candidate_suggest');
create type repeat_rule as enum ('once', 'daily');
create type message_type as enum ('cheer', 'question', 'slogan', 'review_line');
create type moderation_status as enum ('visible', 'selected', 'hidden', 'reported');
```

### 6.3 주요 테이블

#### profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_icon text default '🌙',
  profile_theme text default 'default',
  bio text,
  role app_role not null default 'fan',
  plan user_plan not null default 'free',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

#### user_stats

```sql
create table public.user_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  total_rp integer not null default 0,
  weekly_rp integer not null default 0,
  room_energy_contributed integer not null default 0,
  created_room_count integer not null default 0,
  joined_room_count integer not null default 0,
  vote_count integer not null default 0,
  mission_completion_count integer not null default 0,
  message_count integer not null default 0,
  current_streak_days integer not null default 0,
  longest_streak_days integer not null default 0,
  last_active_on date,
  updated_at timestamptz not null default now()
);
```

#### categories

```sql
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text not null default '✨',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
```

#### targets

```sql
create table public.targets (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  parent_target_id uuid references public.targets(id),
  type target_type not null,
  slug text not null unique,
  name text not null,
  display_name text not null,
  description text,
  icon text not null default '✨',
  tags text[] not null default '{}',
  official_status official_status not null default 'demo',
  is_selectable boolean not null default true,
  created_at timestamptz not null default now()
);
```

#### rooms

```sql
create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  category_id uuid references public.categories(id),
  primary_target_id uuid references public.targets(id),
  vote_mode vote_mode not null default 'pick',
  topic text not null,
  status room_status not null default 'active',
  visibility room_visibility not null default 'public',
  start_at timestamptz not null default now(),
  end_at timestamptz not null,
  goal_type text not null default 'room_energy',
  goal_value integer not null default 500,
  current_goal_value integer not null default 0,
  reward_icon text not null default '🌟',
  result_visibility result_visibility not null default 'after_vote',
  allow_candidate_suggestion boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

#### room_candidates

```sql
create table public.room_candidates (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  linked_target_id uuid references public.targets(id),
  title text not null,
  description text,
  icon text not null default '✨',
  source_type candidate_source not null default 'room_owner',
  status candidate_status not null default 'approved',
  sort_order integer not null default 0,
  vote_count integer not null default 0,
  up_count integer not null default 0,
  down_count integer not null default 0,
  tournament_win_count integer not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
```

#### room_members

```sql
create table public.room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  member_role text not null default 'participant',
  contributed_energy integer not null default 0,
  earned_rp integer not null default 0,
  joined_at timestamptz not null default now(),
  unique(room_id, user_id)
);
```

#### ballots / ballot_items

투표는 단일/멀티/티어/토너먼트 확장을 고려해 ballot 단위로 저장한다.

```sql
create table public.ballots (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vote_mode vote_mode not null,
  completed_at timestamptz not null default now(),
  unique(room_id, user_id, vote_mode)
);

create table public.ballot_items (
  id uuid primary key default gen_random_uuid(),
  ballot_id uuid not null references public.ballots(id) on delete cascade,
  candidate_id uuid not null references public.room_candidates(id) on delete cascade,
  value vote_value not null default 'pick',
  created_at timestamptz not null default now()
);
```

MVP에서는 한 방당 한 유저가 한 번만 투표하는 구조로 시작한다. 추후 “투표 변경 허용”이 필요하면 ballot을 업데이트하거나 version을 추가한다.

#### room_missions / mission_completions

```sql
create table public.room_missions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  title text not null,
  description text,
  type mission_type not null,
  reward_rp integer not null default 10,
  reward_energy integer not null default 5,
  repeat_rule repeat_rule not null default 'once',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.mission_completions (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.room_missions(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  text_value text,
  completed_on date not null default current_date,
  completed_at timestamptz not null default now(),
  reward_rp integer not null default 0,
  reward_energy integer not null default 0,
  unique(mission_id, user_id, completed_on)
);
```

#### room_messages

```sql
create table public.room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type message_type not null default 'cheer',
  body text not null,
  like_count integer not null default 0,
  status moderation_status not null default 'visible',
  created_at timestamptz not null default now()
);
```

#### result_cards

```sql
create table public.result_cards (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null unique references public.rooms(id) on delete cascade,
  title text not null,
  winner_candidate_id uuid references public.room_candidates(id),
  summary_text text,
  total_participants integer not null default 0,
  total_votes integer not null default 0,
  total_energy integer not null default 0,
  top_messages jsonb not null default '[]',
  earned_reward_icon text,
  card_theme text not null default 'signal',
  generated_at timestamptz not null default now(),
  generated_by uuid references public.profiles(id)
);
```

#### rewards / user_rewards

```sql
create table public.reward_definitions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  icon text not null,
  description text,
  rarity text not null default 'common',
  condition_text text,
  created_at timestamptz not null default now()
);

create table public.user_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reward_id uuid not null references public.reward_definitions(id),
  room_id uuid references public.rooms(id),
  earned_at timestamptz not null default now(),
  unique(user_id, reward_id, room_id)
);
```

#### activity_events

```sql
create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  user_id uuid references public.profiles(id),
  session_id text,
  room_id uuid references public.rooms(id),
  target_id uuid references public.targets(id),
  category_id uuid references public.categories(id),
  candidate_id uuid references public.room_candidates(id),
  mission_id uuid references public.room_missions(id),
  vote_mode vote_mode,
  plan user_plan,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
```

#### reports

```sql
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id),
  room_id uuid references public.rooms(id),
  message_id uuid references public.room_messages(id),
  reason text not null,
  status text not null default 'pending',
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

## 7. Supabase RLS 정책 초안

### 7.1 기본 정책

- `categories`, `targets`: 공개 읽기. admin만 쓰기.
- `rooms`: public/link_only 방은 공개 읽기. 로그인 사용자는 생성 가능. 방장은 자신의 방 수정 가능. admin은 전체 관리.
- `room_candidates`: 공개 읽기. 방장만 승인/수정. 후보 제안이 켜진 방에서는 로그인 사용자가 pending 후보 생성 가능.
- `ballots`, `ballot_items`: 사용자는 자기 투표만 insert/select 가능. 집계는 view/RPC로 제공.
- `room_missions`: 공개 읽기. 방장/admin만 생성/수정.
- `mission_completions`: 사용자는 자기 완료 기록만 생성/조회.
- `room_messages`: 공개 읽기. 로그인 사용자는 작성 가능. 작성자/방장/admin은 숨김 처리 가능.
- `result_cards`: 공개 읽기. 방장/admin 또는 자동 함수만 생성.
- `activity_events`: insert는 허용하되, select는 admin/crew 제한.
- `reports`: 로그인 사용자는 신고 생성 가능. admin만 조회/처리.

### 7.2 권장 구현 방식

MVP에서 SQL RLS를 너무 복잡하게 만들면 시간이 터진다. 따라서 다음 순서를 추천한다.

1. 공개 읽기와 로그인 쓰기부터 단순하게 설정한다.
2. 투표/미션/결과 카드처럼 데이터 일관성이 필요한 행동은 RPC로 묶는다.
3. 관리자 기능은 `profiles.role = 'admin'` 조건으로 보호한다.
4. 실제 운영 수준의 남용 방지는 이번 과제 범위 밖으로 둔다.

### 7.3 주요 RPC 함수

#### create_room_with_defaults

역할:

- room 생성
- candidate 생성
- 기본 mission 3개 생성
- room_members에 방장 추가
- user_stats.created_room_count 증가

#### cast_room_vote

역할:

- 방이 active이고 마감 전인지 확인
- 기존 ballot이 있는지 확인
- ballot/ballot_items 생성
- candidate vote_count 또는 up/down count 증가
- room current_goal_value 증가
- room_members/contributed_energy 갱신
- user_stats.total_rp/vote_count 갱신
- 관련 mission 자동 완료 가능

#### complete_room_mission

역할:

- daily/once 중복 완료 방지
- mission_completions 생성
- RP/Room Energy 지급
- room_members/user_stats 갱신

#### publish_result_card

역할:

- 방 마감 여부 확인
- winner 계산
- top messages 계산
- result_cards 생성
- rooms.status를 result_published로 변경

#### record_activity_event

역할:

- activity_events insert
- 클라이언트 이벤트 기록을 통일

---

## 8. 프론트엔드 구조

### 8.1 권장 디렉터리

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  assets/
  components/
    ui/
    layout/
    common/
  features/
    auth/
    rooms/
    targets/
    voting/
    missions/
    messages/
    result-cards/
    rewards/
    crew/
    admin/
    pricing/
  lib/
    supabase/
      client.ts
      database.types.ts
    analytics/
      recordEvent.ts
    routes.ts
    date.ts
    ids.ts
  pages/
    HomePage.tsx
    CreateRoomPage.tsx
    RoomDetailPage.tsx
    ResultCardPage.tsx
    MyPage.tsx
    PricingPage.tsx
    LoginPage.tsx
    RegisterPage.tsx
    crew/
    admin/
  styles/
    tokens.css
    globals.css
  data/
    demoSeed.ts
```

### 8.2 상태 관리 원칙

- 서버 데이터: TanStack Query
- 인증 상태: Supabase Auth + Query/Context
- UI 상태: Zustand 또는 React local state
- 응원방 생성 wizard draft: Zustand 가능
- 투표/미션/포인트의 원천 데이터: Supabase DB

금지:

- 핵심 투표 결과를 localStorage만으로 유지
- 포인트를 클라이언트에서만 증가
- DB 스키마 없는 임시 배열로 Crew 대시보드 구성

### 8.3 환경변수

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

주의:

- Supabase service role key는 절대 프론트엔드 환경변수에 넣지 않는다.
- AI 기능이나 관리자 배치 처리가 필요하면 Edge Function/서버 환경에만 service role을 둔다.

---

## 9. 디자인 시스템 갱신

### 9.1 DESIGN.md 유지

2차본에는 루트 또는 `docs/DESIGN.md`를 둔다. 기존에 정의한 Signal Board 방향을 유지한다.

핵심 키워드:

- Room-first
- Fan-made
- Credible Fun
- Traceable Action
- Safe Unofficial

### 9.2 시각 방향

기존 VibeX의 프리즘 그라데이션은 완전히 폐기하지 않고, 제한적으로만 사용한다.

- 일반 화면: off-white 배경, 명확한 카드, 절제된 primary accent
- CTA: primary accent 사용
- 진행 상태: Signal green/teal
- 보상: Cheer amber
- Result Card: 제한적 gradient 허용
- Admin/Crew: SaaS 대시보드처럼 정돈된 표·카드·필터 중심

### 9.3 핵심 컴포넌트

```text
RoomCard
TargetCard
CreateRoomStepper
VotePanel
TournamentPanel
TierVotePanel
MissionItem
EnergyMeter
FanWallItem
RewardBadge
ResultCardPreview
MetricCard
InsightCard
PricingPlanCard
UnofficialNotice
```

### 9.4 디자인 토큰

`src/styles/tokens.css` 또는 Tailwind theme에 다음 토큰을 정의한다.

```css
:root {
  --rr-bg: #F7F7FA;
  --rr-surface: #FFFFFF;
  --rr-surface-muted: #F1F3F8;
  --rr-ink: #171821;
  --rr-ink-soft: #5B6172;
  --rr-line: #E3E6EF;
  --rr-primary: #4F46E5;
  --rr-primary-soft: #EEF0FF;
  --rr-signal: #16B8A6;
  --rr-cheer: #F59E0B;
  --rr-danger: #EF4444;
  --rr-official: #2563EB;
}
```

---

## 10. 기능 범위 재정의

### 10.1 2차 MVP에서 반드시 구현

```text
인증
- 회원가입/로그인
- 로그인 사용자만 방 생성/투표/미션/메시지 작성 가능

홈
- 새로 열린 방
- 마감 임박 방
- 참여가 활발한 방
- 응원방 만들기 CTA

응원방 만들기
- 5단계 wizard
- 카테고리 선택
- Target DB 선택
- 진행 방식 선택
- 후보 설정
- 기간/보상 설정
- 생성 후 상세로 이동

응원방 상세
- Target 정보
- Room Energy
- 투표 패널
- 미션 패널
- 팬월
- 비공식 고지

참여
- pick vote 1개는 반드시 실제 DB 반영
- 미션 완료 실제 DB 반영
- 응원 메시지 작성 실제 DB 반영

결과 카드
- 마감 또는 수동 생성
- winner/top message/참여자 수 표시

마이페이지
- 내 RP
- 내 참여 방
- 내 생성 방
- 획득 보상

Crew 대시보드
- 내가 만든 방 목록
- 방별 참여자/투표/미션/메시지 지표
- AI 보조처럼 보이는 추천 카드, 실제 LLM 없이 규칙 기반 가능

요금제
- Free/Fan Plus/Room Crew/Official Beta
- 실제 결제 없음
```

### 10.2 2차 MVP에서 선택 구현

```text
티어리스트
랜덤 토너먼트
후보 제안 승인
결과 카드 테마 변경
이미지 저장/html2canvas
Supabase Storage 프로필 이미지
Cloudflare/Vercel Analytics
Realtime 반영
```

### 10.3 이번에는 하지 말 것

```text
실제 결제
실제 공식 계정 인증
유료 투표권
실존 인물/작품 자유 등록
실시간 채팅
복잡한 신고/모더레이션
AI 챗봇
외부 SNS 자동 공유
서버 사이드 렌더링
```

---

## 11. 2차 개발 일정안

### Sprint 0 — VibeX 1차본 보존

목표:

- 1차본 zip, VibeX URL, 주요 프롬프트, 스크린샷 보존
- 제출 메일에 1차본과 2차본의 관계 설명 준비

산출물:

```text
/archive/vibex-v1.zip
/docs/vibex-prompts.md
/docs/vibex-v1-review.md
```

### Sprint 1 — 새 프로젝트 스캐폴딩

목표:

- Vite + React + TypeScript 프로젝트 생성
- Tailwind/Radix/TanStack Query/Supabase 설정
- DESIGN.md 적용
- 라우팅과 레이아웃 구성

산출물:

```text
pnpm dev 가능
pnpm build 성공
기본 라우팅 동작
```

### Sprint 2 — Supabase 스키마/시드

목표:

- Supabase 프로젝트 생성
- 마이그레이션 SQL 작성
- RLS 기본 정책 적용
- 가상 카테고리/대상/샘플 방 seed
- TypeScript DB 타입 생성

산출물:

```text
/supabase/migrations/*.sql
/src/lib/supabase/database.types.ts
/src/data/demoSeed.ts 또는 seed.sql
```

### Sprint 3 — 핵심 루프 구현

목표:

- 홈에서 방 목록 조회
- 방 만들기 wizard
- 방 상세 조회
- pick vote DB 반영
- mission completion DB 반영
- fan wall message DB 반영
- Room Energy/RP 반영

산출물:

```text
방 생성 → 상세 이동 → 투표/미션/메시지 → 마이페이지 반영
```

### Sprint 4 — 결과 카드/대시보드

목표:

- 결과 카드 생성/조회
- MyPage 보상/히스토리
- Crew 대시보드 지표
- Admin 대시보드 최소 기능

산출물:

```text
결과 카드와 Crew 인사이트가 실제 DB 데이터를 사용
```

### Sprint 5 — 제출용 polish

목표:

- 문구 정리
- 비공식/데모 고지 강화
- 반응형 점검
- Vercel/Cloudflare 배포
- README와 제출 설명 작성

산출물:

```text
2차 개선본 URL
README.md
SUBMISSION_NOTE.md
```

---

## 12. Codex 작업 지침

### 12.1 Codex에게 주는 기본 원칙

```text
RallyRoom은 VibeX 1차 프로토타입을 기반으로 한 2차 독립 구현이다.
페이지 목록과 서비스 기획은 유지하되, VibeX Entity API는 사용하지 않는다.
DB/Auth는 Supabase를 사용한다.
프론트엔드는 Vite + React + TypeScript로 구현한다.
핵심 목표는 방 생성 → 투표/미션/팬월 → 포인트/게이지 → 결과 카드 → 마이페이지/Crew 지표의 데이터 연결이다.
새 기능을 늘리기보다 핵심 루프의 일관성을 우선한다.
```

### 12.2 Codex 작업 규칙

- 한 번에 전체 앱을 갈아엎지 않는다.
- 작업 단위는 작은 PR처럼 나눈다.
- 매 작업마다 `pnpm typecheck`, `pnpm lint`, `pnpm build`를 확인한다.
- Supabase schema 변경 시 migration 파일을 반드시 남긴다.
- `service_role` key를 프론트 코드에 넣지 않는다.
- demo 데이터는 실제 인물/작품과 무관한 가상 데이터만 사용한다.
- UI 수정은 DESIGN.md 기준으로 한다.
- Plus/Crew/Official은 실제 결제가 아니라 잠금 UI와 설명만 구현한다.
- 데이터가 비어 있어도 empty state가 보여야 한다.

### 12.3 Codex 첫 작업 프롬프트

```text
이 저장소는 VibeX 1차 프로토타입을 바탕으로 RallyRoom 2차본을 새로 구현하는 프로젝트다.
VibeX Entity API와 관리자 도구를 사용하지 않고, Supabase + Vite + React + TypeScript 기반으로 재구축한다.

먼저 다음 작업만 수행해줘.

1. Vite + React + TypeScript 프로젝트 구조를 정리한다.
2. 기존 JSX 페이지를 그대로 옮기지 말고, 라우팅 골격만 만든다.
3. src/lib/supabase/client.ts를 만들고 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 사용하도록 한다.
4. src/styles/tokens.css에 RallyRoom Signal Board 디자인 토큰을 추가한다.
5. pages는 HomePage, CreateRoomPage, RoomDetailPage, ResultCardPage, MyPage, PricingPage, LoginPage, RegisterPage, CrewDashboardPage, AdminDashboardPage의 placeholder만 만든다.
6. pnpm build가 통과되도록 한다.

아직 Supabase 테이블 연결이나 투표 로직은 구현하지 마.
```

### 12.4 Codex 두 번째 작업 프롬프트

```text
이제 Supabase schema를 작성해줘.

목표는 RallyRoom의 핵심 루프를 지원하는 최소 DB 모델이다.
필요 테이블:
- profiles
- user_stats
- categories
- targets
- rooms
- room_candidates
- room_members
- ballots
- ballot_items
- room_missions
- mission_completions
- room_messages
- result_cards
- reward_definitions
- user_rewards
- activity_events
- reports

요구사항:
1. supabase/migrations/001_initial_schema.sql 생성
2. enum 타입 정의
3. 기본 RLS enable
4. public read가 가능한 categories, targets, active public rooms 정책 추가
5. authenticated user가 room 생성, vote, mission completion, message 작성 가능하도록 최소 정책 추가
6. admin role 조건은 profiles.role = 'admin' 기준으로 둔다
7. 실제 결제/공식 인증/실존 대상 등록은 구현하지 않는다
```

### 12.5 Codex 세 번째 작업 프롬프트

```text
Supabase schema를 기준으로 프론트 타입과 데이터 접근 레이어를 구성해줘.

작업:
1. Supabase generated type을 받을 src/lib/supabase/database.types.ts placeholder를 만든다.
2. src/features/rooms/roomQueries.ts 작성
3. listRooms, getRoomDetail, createRoomWithDefaults 함수를 만든다.
4. src/features/targets/targetQueries.ts 작성
5. listCategories, listTargetsByCategory 함수를 만든다.
6. TanStack Query를 app providers에 연결한다.
7. HomePage에서 rooms를 조회해 RoomCard로 보여준다.
8. Empty state와 loading state를 추가한다.
```

### 12.6 Codex 네 번째 작업 프롬프트

```text
응원방 만들기 wizard를 구현해줘.

요구사항:
1. 5단계 wizard: 대상 선택 → 진행 방식 선택 → 주제/제목 → 후보 설정 → 기간/보상
2. 응원 대상은 자유 입력이 아니라 targets 테이블에서 선택한다.
3. vote_mode는 pick, tier, tournament 중 선택 가능하게 UI만 제공하되, 실제 동작은 pick부터 구현한다.
4. 후보는 최소 2개 이상 필요하다.
5. 기본 기간은 생성일 + 7일이다.
6. 생성 성공 시 /rooms/:roomId로 이동한다.
7. created room은 Home과 MyPage에서 보이도록 DB에 저장한다.
```

### 12.7 Codex 다섯 번째 작업 프롬프트

```text
RoomDetail의 핵심 참여 루프를 구현해줘.

작업:
1. RoomDetail에서 room, target, candidates, missions, messages를 조회한다.
2. pick vote를 구현한다. 한 사용자는 한 room에서 한 번만 투표한다.
3. 투표 성공 시 candidate vote_count와 room current_goal_value가 증가해야 한다.
4. 미션 완료를 구현한다. 중복 완료를 막고 RP와 Room Energy를 지급한다.
5. 팬월 메시지 작성과 목록 조회를 구현한다.
6. 참여 후 MyPage와 Crew Dashboard 지표에 반영될 수 있도록 DB를 갱신한다.
7. 핵심 행동마다 activity_events를 insert한다.
```

---

## 13. 배포 전략

### 13.1 Vercel 배포

권장 기본 경로.

```text
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
Environment Variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
```

절차:

1. GitHub 저장소 생성
2. Vercel에서 import
3. 환경변수 등록
4. Production 배포
5. 배포 URL을 제출 메일의 “추가 개선본”으로 첨부

### 13.2 Cloudflare Pages 배포

대체 경로.

```text
Build Command: pnpm build
Build Output Directory: dist
Environment Variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
```

Cloudflare Pages는 정적 SPA 배포에 적합하다. 다만 과제 마감성 작업에서는 Vercel이 설정이 더 빠를 수 있으므로, Cloudflare는 후순위로 둔다.

### 13.3 Supabase 환경 분리

시간이 부족하면 Supabase 프로젝트 하나로 간다.

권장:

```text
Production: 제출용 DB
Local: supabase local, 가능하면 사용
```

마감이 가까우면 local Supabase까지 구성하지 말고 remote Supabase + SQL editor + migration 파일로 진행한다.

---

## 14. README / 제출 문구 갱신

### 14.1 README 핵심 문구

```text
RallyRoom is a fan-driven micro cheer-room platform.
This repository is the second implementation built after a VibeX-generated prototype.
The first VibeX version was used to rapidly validate the service structure and page flow.
This version rebuilds the product with React, TypeScript, Supabase, and a custom Signal Board design system.
All characters, works, creators, and teams are fictional demo data.
RallyRoom does not claim any official relationship with real artists, works, brands, or agencies.
```

### 14.2 제출 메일용 설명

```text
VibeX 무료 크레딧으로 1차 프로토타입을 만든 뒤, 구현 중 발견한 한계와 데이터 구조 문제를 보완하기 위해 외부 AI 도구(Codex/Claude)를 활용해 2차 개선본을 제작했습니다.

1차 VibeX 링크는 과제 필수 요건 충족용으로 제출하며, 2차 링크는 동일 기획을 TypeScript/Supabase 기반으로 재구축한 개선본입니다.

이번 과제에서 중점적으로 보여주고자 한 것은 단순 화면 완성도가 아니라, 팬 커뮤니티 서비스를 응원방이라는 작은 단위로 구조화하고, 생성·참여·보상·결과 카드·운영 지표로 이어지는 루프를 설계한 과정입니다.
```

---

## 15. 2차 개발 리스크와 대응

### 15.1 Supabase RLS가 생각보다 오래 걸릴 수 있음

대응:

- RLS는 기본적인 public read/auth insert부터 시작한다.
- 복잡한 권한은 문서화하고 MVP에서는 단순화한다.
- 투표/미션은 RPC로 처리해 정책을 줄인다.

### 15.2 기능 범위가 다시 커질 수 있음

대응:

- pick vote만 실제 동작시킨다.
- tier/tournament는 UI와 더미 설명으로 두거나, 시간이 남을 때 구현한다.
- Crew 대시보드는 실제 DB aggregate + 더미 인사이트 카드 조합으로 간다.

### 15.3 VibeX 과제 조건과 어긋나 보일 수 있음

대응:

- VibeX 도메인 1차본을 반드시 제출한다.
- 2차본은 “추가 개선본”으로 명확히 표현한다.
- 사용한 프롬프트 목록에 VibeX 프롬프트와 외부 AI 개선 프롬프트를 모두 넣는다.

### 15.4 디자인 polish가 늦어질 수 있음

대응:

- 새 그래픽보다 카드 계층, 간격, 타이포, 색상 토큰 통일을 우선한다.
- 이미지 생성/일러스트는 하지 않는다.
- 이모지/아이콘/추상 플레이스홀더로 충분히 표현한다.

### 15.5 실존 대상 데이터가 들어가고 싶어질 수 있음

대응:

- 제출본에서는 전부 가상 데이터로 유지한다.
- 실제 대상 등록은 “향후 공식 계정/승인제”로만 설명한다.

---

## 16. 최종 판단

VibeX 무료 토큰이 소진된 상황에서 플랫폼 안에서 억지로 계속 고치는 것은 합리적이지 않다. 지금의 1차본은 VibeX 과제 요건을 충족하는 프로토타입으로 보존하고, 2차본은 Supabase와 TypeScript 기반의 독립 앱으로 재구축하는 편이 낫다.

다만 과제 제출 관점에서는 VibeX 도메인 필수 조건을 놓치면 안 된다. 따라서 최종 제출 전략은 다음이 가장 안전하다.

```text
필수: VibeX 1차 프로토타입 URL
보조: Supabase/Vercel 기반 2차 개선본 URL
설명: VibeX로 구조를 빠르게 만들고, 외부 AI 도구로 데이터 모델과 구현 완성도를 보강했다
```

2차 개발의 핵심은 새 기능을 더 많이 넣는 것이 아니다. 핵심은 아래 하나다.

```text
응원방 생성 → 투표/미션/팬월 참여 → RP/Room Energy 증가 → 결과 카드 생성 → 마이페이지/Crew 대시보드 반영
```

이 루프가 실제 DB 위에서 작동하면, RallyRoom은 단순 Vibe-coded 페이지가 아니라 평가자가 사업성과 사고 과정을 읽을 수 있는 서비스형 프로토타입이 된다.

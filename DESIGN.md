---
version: alpha
name: RallyRoom-design-system
description: "Fan Vote Board for a fan-created popularity poll app. The interface should feel like a trendy mobile-first social voting product where users open vote rooms, compare candidates, track rankings, complete light missions, and publish result cards. The temporary service name and old 'cheer room' wording must not drive the design."
colors:
  ink: "#111827"
  ink-muted: "#4B5563"
  ink-soft: "#6B7280"
  canvas: "#F5F7FB"
  surface: "#FFFFFF"
  surface-glass: "rgba(255, 255, 255, 0.78)"
  surface-tint: "#EEF6FF"
  panel-dark: "#111827"
  panel-dark-2: "#1F2937"
  line: "#DCE3EE"
  line-soft: "#E8EEF7"
  primary: "#E11D48"
  primary-pressed: "#BE123C"
  primary-soft: "#FFE4EA"
  focus: "#2563EB"
  vote: "#2563EB"
  vote-soft: "#DBEAFE"
  energy: "#F59E0B"
  energy-soft: "#FEF3C7"
  mission: "#10B981"
  mission-soft: "#D1FAE5"
  reward: "#7C3AED"
  reward-soft: "#EDE9FE"
  danger: "#DC2626"
  success: "#128A63"
  warning: "#B77900"
typography:
  display: "SUIT Variable, SUIT, IBM Plex Sans KR, Noto Sans KR, system-ui, sans-serif"
  body: "SUIT Variable, SUIT, IBM Plex Sans KR, Noto Sans KR, system-ui, sans-serif"
  data: "IBM Plex Mono, JetBrains Mono, ui-monospace, monospace"
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 48px
radii:
  xs: 3px
  sm: 5px
  md: 8px
  full: 999px
---

# RallyRoom Design System

## Product Context

RallyRoom is a temporary product name. The product behavior is more important than the name.

The MVP is a fan-created popularity poll service. Users create small vote rooms around fictional or curated targets, choose candidates, watch rankings move, complete light participation missions, leave fan-wall messages, and publish result cards after voting closes.

The first usable screen must feel like an app, not a landing page. It should show active vote rooms, ranking signals, expiring polls, user RP, missions, and the command to create a new vote room.

## Design Direction

**Direction:** Fan Vote Board.

Use `ui-ux-pro-max` as a starting point, but do not blindly follow the generic `Vibrant & Block-based` recommendation. That direction became too poster-like and too harsh for this product.

Selected blend:

- `Bento Grids` for modular, content-first vote cards and side panels.
- `Soft glass` for the app shell, sticky navigation, and lightweight mobile-product polish.
- `Micro-interactions` for card hover, press feedback, and clear ranking changes.
- Korean-readable typography over decorative display fonts.

The product should feel like:

- a trendy social voting app
- a mobile-first feed of fan-made popularity polls
- a ranking board that is easy to scan
- a lightweight recurring product where users return to vote, check rank changes, collect RP, and share result cards

The product should not feel like:

- a stadium, rally, campaign, or protest theme derived from the name
- an official idol or agency app
- a generic SaaS admin dashboard
- a one-off landing page
- a hard-border neo-brutalist board
- a purple-gradient AI dashboard
- a celebrity gallery or stock-photo fandom page

## Color Palette And Roles

### Core Tokens

| Token | Hex | Role |
|---|---:|---|
| `ink` | `#111827` | Primary text, headings, active nav |
| `ink-muted` | `#4B5563` | Secondary text, card metadata |
| `ink-soft` | `#6B7280` | Tertiary labels, disabled copy |
| `canvas` | `#F5F7FB` | App background |
| `surface` | `#FFFFFF` | Cards, panels, forms |
| `surface-glass` | `rgba(255, 255, 255, 0.78)` | Sticky shell, soft glass panels |
| `surface-tint` | `#EEF6FF` | Vote/ranking highlight surfaces |
| `panel-dark` | `#111827` | Result card preview |
| `panel-dark-2` | `#1F2937` | Dark nested result surfaces |
| `line` | `#DCE3EE` | Default borders |
| `line-soft` | `#E8EEF7` | Subtle separators |

### Functional Accents

| Token | Hex | Role |
|---|---:|---|
| `primary` | `#E11D48` | Create vote room, main participation action |
| `primary-pressed` | `#BE123C` | Pressed/hover primary |
| `primary-soft` | `#FFE4EA` | Primary tint, officiality guard copy |
| `focus` | `#2563EB` | Focus ring, selected nav, links |
| `vote` | `#2563EB` | Ranking, vote count, selected candidate |
| `vote-soft` | `#DBEAFE` | Vote chips and selected surfaces |
| `energy` | `#F59E0B` | D-day urgency, Vote Energy |
| `energy-soft` | `#FEF3C7` | Energy track background |
| `mission` | `#10B981` | Mission completion and participation nudges |
| `mission-soft` | `#D1FAE5` | Mission cards |
| `reward` | `#7C3AED` | RP, icons, premium/reward moments only |
| `reward-soft` | `#EDE9FE` | Reward chips |

### Color Rules

- Keep the page mostly light neutral. Accent colors should mark status, ranking, rewards, or one primary action.
- Use rose for the strongest action in a viewport, usually `투표방 만들기`.
- Use blue for vote/ranking signals.
- Use amber for D-day and Vote Energy.
- Use mint for mission completion.
- Use violet only for RP, icons, paid-plan perks, or collectible result-card moments.
- Do not use giant color blocks, hard black borders, or poster-like primary color fields.
- Do not make purple/blue gradients the brand identity.
- Do not let any one hue dominate the whole product.

## Typography

- Primary Korean UI: `SUIT Variable`, `SUIT`, `IBM Plex Sans KR`, `Noto Sans KR`, system fallback.
- Data and counters: `IBM Plex Mono`, `JetBrains Mono`, `ui-monospace`, `monospace`.
- Letter spacing is always `0`.
- Do not use all-caps for Korean labels.
- Use weight, spacing, and color before increasing font size.
- Keep button and compact panel text small enough to fit on mobile.

## Layout Principles

### App First

The first viewport should show useful product content:

- sticky top app bar
- create vote room command
- active vote room feed
- ranking and vote count signals
- expiring vote rooms
- user RP summary
- participation missions
- quick templates

### Grid

- Desktop app frame: max width `1280px`.
- Home: vote feed left, RP/missions/expiring rail right.
- Detail: room header, vote status, candidates, missions, fan wall.
- Create: form panel plus live vote-room preview.
- Crew: aggregate metrics and vote-room performance.
- Mobile: one-column feed, bottom navigation, no horizontal scroll.

## Components

### Buttons

- Primary button: rose background, white text, radius `8px`, min height `44px`.
- Secondary button: white surface, subtle border, radius `8px`, min height `40px`.
- Buttons may include lucide icons when the action benefits from fast recognition.
- Every interactive element needs hover/focus/press feedback.

### Vote Room Card

Required content:

- vote room title
- category chip
- D-day chip
- topic summary
- Vote Energy or progress display
- participant count
- candidate count
- link to detail

Style:

- white or glass surface
- subtle border and soft shadow
- radius `8px`
- no hard offset shadow
- small accent strip or top status rail is allowed

### Ranking And Candidate Cards

- Candidate cards should emphasize rank, vote count, and selected/leading state.
- Do not imply the client calculates trusted vote totals.
- Ranking color must be paired with text or labels.

### Missions And RP

- Missions are secondary participation nudges, not the core identity.
- RP and icons are site-internal rewards.
- Avoid copy that claims external impact, delivery, or official recognition.

### Result Card

- Result cards can use a darker collectible surface.
- They should show winner, participant count, fan-wall quote, and earned icon.
- They should route users back into the next vote room loop.

## Page And Route Structure

| Route | Page | Purpose |
|---|---|---|
| `/` | Home Dashboard | Find vote rooms, see rankings/missions, create room |
| `/rooms/new` | Room Create | Stepper-style form and live preview |
| `/rooms/:roomId` | Room Detail | Vote status, candidates, missions, fan wall |
| `/rooms/:roomId/result` | Result Card | Published summary and next vote loop |
| `/profile` | Profile | RP, reward icons, joined/created rooms |
| `/crew` | Crew Dashboard | Aggregate room performance for creators/operators |
| `/pricing` | Pricing | Plus/Crew/Official expansion plan cards |
| `*` | Not Found | Safe fallback and route back home |

## Copy Rules

- Prefer `투표방`, `인기투표`, `랭킹`, `후보`, `결과 카드`, `Vote Energy`.
- Avoid using `응원` as the main product keyword. It may appear only as a secondary emotional context when needed.
- Do not use real star, team, brand, or work names in demo data.
- Do not imply official partnership, official vote, agency delivery, or guaranteed external impact.
- Official/creator expansion must be framed as future or locked-plan capability.

## Accessibility

- Use semantic landmarks: `header`, `nav`, `main`, `section`, `aside`.
- Navigation uses real links.
- Focus states are visible.
- Text contrast must meet WCAG AA.
- Color is never the only state marker.
- Touch targets are at least `40px`, primary actions at least `44px`.
- Respect `prefers-reduced-motion`.

## Agent Prompt Guide

```text
Read DESIGN.md first. Build the app as a Fan Vote Board, not a landing page and not a name-driven rally/cheer product.
The first viewport must show useful app content: active vote rooms, ranking signals, create-room command, user RP, missions, and expiring polls.
Use bento-style modular surfaces, soft glass navigation, restrained accent colors, Korean-readable typography, and clear mobile-first hierarchy.
Avoid hard black borders, giant color blocks, purple-gradient AI dashboards, official idol-app language, real celebrity/IP names, and any claim of official partnership.
```

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-29 | Create `DESIGN.md` before page scaffolding | The initial hero drifted toward generic SaaS landing design. The app needs a durable visual contract before routing work. |
| 2026-05-29 | Keep demo visuals abstract and fictional | The service has no official partnership with real stars or works, so design must avoid official fandom signals and real-person imagery. |
| 2026-05-30 | Reframe from Fan Ops/Cheer Board to Fan Vote Board | The actual recurring behavior is closer to fan-created popularity polls and rankings than emotional cheer campaigns. |
| 2026-05-30 | Select bento + soft glass over vibrant block style | The prior block-style exploration looked too harsh and not trendy enough for a consumer social voting app. |

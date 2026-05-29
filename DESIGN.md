---
version: alpha
name: RallyRoom-design-system
description: "Fan Ops Board for RallyRoom: a fan-led micro rally room app that feels like a campaign board, not an official idol app and not a SaaS landing page. The interface mixes operational trust, fan energy, room cards, missions, points, and result cards into a dense but friendly product surface."
colors:
  ink: "#17151F"
  ink-muted: "#565465"
  ink-soft: "#817E8F"
  canvas: "#F7F8F3"
  surface: "#FFFFFF"
  surface-raised: "#FCFCF8"
  surface-tint: "#EEF8F4"
  panel-dark: "#20202A"
  panel-dark-2: "#2A2935"
  line: "#DADDE5"
  line-soft: "#ECEEF3"
  primary: "#FF5A3C"
  primary-pressed: "#D9432A"
  primary-soft: "#FFE1D8"
  focus: "#2D6BFF"
  energy: "#F6D84B"
  energy-soft: "#FFF4B8"
  mission: "#18B7A4"
  mission-soft: "#D7F5EF"
  reward: "#7C5CFF"
  reward-soft: "#E8E2FF"
  danger: "#D93838"
  success: "#128A63"
  warning: "#B77900"
typography:
  display: "SUIT Variable, SUIT, IBM Plex Sans KR, system-ui, sans-serif"
  body: "SUIT Variable, SUIT, IBM Plex Sans KR, system-ui, sans-serif"
  data: "IBM Plex Mono, JetBrains Mono, ui-monospace, monospace"
  logo: "SUIT Variable, SUIT, IBM Plex Sans KR, system-ui, sans-serif"
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
  lg: 12px
  full: 999px
---

# RallyRoom Design System

## Product Context

RallyRoom is a fan-led micro rally room platform. Fans create small rooms around a fictional or curated target, run votes, missions, fan-wall messages, and publish result cards after the room closes.

The first usable screen must feel like an app dashboard. It should not feel like a one-off marketing landing page. The user should immediately see rooms to join, missions to complete, RP/reward progress, and the primary command to create a room.

## Reference Model

This file follows the DESIGN.md pattern used by `voltagent/awesome-design-md`: a plain-text design contract that agents can read before generating UI. It also follows the Google Stitch idea that UI agents should know what each color and component is for instead of guessing visual intent.

Use these references as structure inspiration only. Do not copy another brand's identity.

- `awesome-design-md`: DESIGN.md files include visual atmosphere, color roles, typography, component styling, layout, depth, Do/Don't rules, responsive behavior, and agent prompts.
- Google Stitch DESIGN.md: design rules travel with the project so generated UI can match one shared visual language.
- Useful mood inputs: Figma's monochrome plus color-block discipline, Airtable's structured data friendliness, Miro's energetic board language, Linear's precision. RallyRoom should combine those ideas into a fan-ops product surface.

## Visual Theme And Atmosphere

**Direction:** Fan Ops Board.

RallyRoom should feel like a shared campaign board for fans: lively, tactical, and usable every day. The fan energy comes from badges, room cards, progress bars, reward icons, and category color strips. The trust comes from clear structure, dense information, predictable navigation, and restrained surfaces.

The product should not look like:

- an official idol app
- a generic voting landing page
- a purple-gradient AI dashboard
- a beige SaaS marketing homepage
- a gallery of celebrity photos

The product should look like:

- a fan-created room feed
- a lightweight mission control board
- a dashboard where rooms, missions, RP, and result cards are visible at once
- a service that could later support official/creator accounts without pretending to be official now

## Color Palette And Roles

### Core Neutrals

| Token | Hex | Role |
|---|---:|---|
| `ink` | `#17151F` | Primary text, headings, active nav |
| `ink-muted` | `#565465` | Secondary text, card metadata |
| `ink-soft` | `#817E8F` | Tertiary labels, disabled copy |
| `canvas` | `#F7F8F3` | App background |
| `surface` | `#FFFFFF` | Cards, panels, form fields |
| `surface-raised` | `#FCFCF8` | Slightly raised panels |
| `surface-tint` | `#EEF8F4` | Gentle fan-community sections |
| `panel-dark` | `#20202A` | Result card preview, high-contrast panels |
| `panel-dark-2` | `#2A2935` | Dark nested panels |
| `line` | `#DADDE5` | Default borders |
| `line-soft` | `#ECEEF3` | Subtle separators |

### Functional Accents

| Token | Hex | Role |
|---|---:|---|
| `primary` | `#FF5A3C` | Create-room command, highest-priority CTA |
| `primary-pressed` | `#D9432A` | Pressed/hover primary |
| `primary-soft` | `#FFE1D8` | CTA background tint, warnings about officiality |
| `focus` | `#2D6BFF` | Focus ring, selected nav, links |
| `energy` | `#F6D84B` | Room Energy gauge, D-day urgency |
| `energy-soft` | `#FFF4B8` | Energy gauge background |
| `mission` | `#18B7A4` | Mission completion, fan-wall activity |
| `mission-soft` | `#D7F5EF` | Mission cards |
| `reward` | `#7C5CFF` | RP, icons, premium/reward moments only |
| `reward-soft` | `#E8E2FF` | Reward chips |
| `danger` | `#D93838` | Destructive or invalid state |
| `success` | `#128A63` | Completed state |
| `warning` | `#B77900` | Caution state |

### Color Rules

- Use `primary` only for `응원방 만들기`, room-open confirmation, or one highest-priority action in a viewport.
- Use `energy` for progress and time-sensitive room status, not generic decoration.
- Use `mission` for mission and fan-wall activity.
- Use `reward` rarely. It marks RP, earned icons, locked plan perks, and result-card highlights.
- Do not let the page become one-note. A room feed should show neutral structure with small category and status colors.
- Do not use purple/blue gradients as a default background.
- Do not use beige/cream as the dominant brand mood. `canvas` is a working surface, not a cozy theme.

## Typography

### Font Families

- **Display/UI:** `SUIT Variable`, fallback `SUIT`, `IBM Plex Sans KR`, `system-ui`, `sans-serif`.
- **Body:** same as display. Korean readability matters more than ornamental type.
- **Data/Numbers:** `IBM Plex Mono`, fallback `JetBrains Mono`, `ui-monospace`, `monospace`.

### Type Scale

Use fixed responsive steps. Do not scale font size directly with viewport width.

| Token | Size | Weight | Line Height | Use |
|---|---:|---:|---:|---|
| `display-lg` | 40px | 800 | 1.15 | App title areas, result card headline |
| `display-md` | 32px | 800 | 1.2 | Page title |
| `heading-lg` | 24px | 800 | 1.25 | Section headings |
| `heading-md` | 20px | 800 | 1.3 | Card titles |
| `body-lg` | 17px | 500 | 1.55 | Lead copy |
| `body` | 15px | 500 | 1.55 | Default UI copy |
| `body-sm` | 13px | 500 | 1.45 | Metadata, descriptions |
| `caption` | 12px | 700 | 1.35 | Chips, badges, labels |
| `data` | 13px | 600 | 1.4 | RP, D-day, counters |

### Typography Rules

- Letter spacing is always `0`.
- Use weight, color, and spacing for hierarchy before increasing font size.
- Do not use all-caps for Korean labels.
- Do not use decorative display fonts for Korean body text.
- Numbers in counters, D-day labels, RP, and energy should use `data`.

## Layout Principles

### App First

The first screen is a dashboard, not a hero. It should include:

- top app bar with product identity and route navigation
- primary `응원방 만들기` command
- user's RP/energy/participation summary
- active room feed
- expiring-soon room rail
- today missions
- template shortcuts for opening a new room

### Grid

- Desktop app frame: max width `1280px`, 12-column content grid.
- Dashboard: 8/4 split is preferred, room feed left and mission/profile rail right.
- Detail page: room header, tabbed participation panels, sticky action area on desktop.
- Create page: stepper form left, live room preview right.
- Crew dashboard: metric cards top, aggregate panels below. No raw event dump.
- Mobile: one-column stacked layout with sticky bottom create-room action when useful.

### Spacing

- Base unit: `4px`.
- Card padding: `16px` to `24px`.
- Section gap: `32px` to `48px`.
- Dense dashboard rows may use `12px` gaps.
- Avoid oversized hero whitespace. The user should see useful next content in the first viewport.

## Component Styling

### Buttons

**Primary Button**

- Use for the single strongest action: `응원방 만들기`, `응원방 열기`.
- Background `primary`, text white, radius `8px`, min height `44px`, padding `0 16px`.
- Hover/pressed uses `primary-pressed`.
- Do not use gradient fills.

**Secondary Button**

- Surface white, `1px` line border, ink text, radius `8px`, min height `40px`.
- Use for preview, share, view result, or route navigation.

**Ghost Button**

- Transparent background, ink or focus text.
- Use in nav and compact repeated actions.

**Icon Button**

- 36px desktop, 40px touch.
- Radius `8px` unless it is a true avatar or status dot.
- Use lucide icons when available.

### Cards

**Room Card**

- White surface, `1px` `line` border, radius `8px`, no heavy shadow.
- Required content: room title, target/category chip, status/D-day, progress gauge, candidate count, participant count, primary action.
- Add a thin category color strip on the left or top. Do not turn the whole card into a colored blob.

**Mission Card**

- Soft mission tint or white surface with mission icon.
- Required content: mission title, reward RP/energy, completion state, action.
- Completed state uses `success`; unavailable state uses neutral surface and clear copy.

**Result Card Preview**

- Dark panel allowed.
- Use `panel-dark`, `energy`, and `reward` to make it feel collectible.
- Required content: winner, total participants, top message, earned icon, next-room CTA.

**Pricing/Plan Card**

- Calm SaaS surface.
- Use locked states and feature comparison, not fake payment flows.
- Official/crew capabilities should be framed as future expansion, not current claims.

### Inputs And Forms

- Inputs are white, radius `8px`, border `line`, min height `44px`.
- Focus ring uses `focus`.
- Validation errors use `danger` text plus a short, concrete reason.
- Create-room forms should always show officiality guard copy near target/topic inputs.

### Chips And Badges

- Radius `999px` is allowed for chips only.
- D-day chip: `energy-soft` background, ink text.
- RP chip: `reward-soft` background, ink text.
- Category chip: category-specific soft surface.
- Official or verified wording is prohibited in MVP demo data unless clearly marked as future/locked plan copy.

### Progress

- Room Energy gauge uses `energy`.
- Mission progress uses `mission`.
- Use server/read-model values as display input. Never imply the client calculates trusted totals.

## Page And Route Structure

The app should implement these routes before backend work:

| Route | Page | Purpose |
|---|---|---|
| `/` | Home Dashboard | Find rooms, see missions, create room |
| `/rooms/new` | Room Create | Stepper form and live preview |
| `/rooms/:roomId` | Room Detail | Vote, missions, fan wall, room state |
| `/rooms/:roomId/result` | Result Card | Published summary and next-room loop |
| `/profile` | Profile | RP, reward icons, joined/created rooms |
| `/crew` | Crew Dashboard | Aggregate room performance for creators/operators |
| `/pricing` | Pricing | Plus/Crew/Official expansion plan cards |
| `*` | Not Found | Safe fallback and route back to home |

### Navigation Model

- Desktop: top app bar with primary routes and create-room button.
- Mobile: top app bar plus bottom navigation for Home, Rooms, Create, Profile.
- `응원방 만들기` should stay reachable from every route.
- Page transitions should be instant and SPA-like. No marketing scroll-jump behavior.

## Mock Data Contract For UI Features

Before Supabase exists, page implementation should use structured JSON or typed fixtures that mirror later read models.

Preferred files for #20/#22 follow-up implementation:

```text
src/shared/types/rallyroom.ts
src/shared/data/demo/categories.json
src/shared/data/demo/targets.json
src/shared/data/demo/rooms.json
src/shared/data/demo/profile.json
src/shared/data/demo/crewStats.json
src/shared/api/demoReadRepository.ts
```

Mock data must model the future schema shape:

- categories: `id`, `name`, `tone`, `colorToken`, `isActive`
- targets: `id`, `categoryId`, `name`, `targetType`, `isSelectable`, `fictionalNotice`
- rooms: `id`, `slug`, `title`, `topic`, `categoryId`, `primaryTargetId`, `status`, `visibility`, `endAt`, `goalValue`, `currentGoalValue`, `candidates`, `missions`, `messages`, `resultCard`
- candidates: `id`, `targetId`, `title`, `status`, `voteCount`
- missions: `id`, `type`, `title`, `rewardRp`, `rewardEnergy`, `isCompleted`
- messages: `id`, `type`, `body`, `status`, `createdAt`
- profile: `totalRp`, `weeklyRp`, `streakDays`, `earnedRewards`, `joinedRoomIds`, `createdRoomIds`
- crewStats: aggregate DTO only, not raw activity event rows

Do not hardcode page text and arrays directly inside components once the demo data feature starts. Keep page structure ready to swap the repository implementation for Supabase read models.

## Depth And Elevation

- Default UI is flat with hairline borders.
- Use subtle shadows only for sticky nav, menus, and overlays.
- Room cards should feel sortable and scannable, not like decorative landing cards.
- Dark panels are reserved for result card previews and high-contrast summary sections.

## Responsive Behavior

### Breakpoints

| Name | Width | Behavior |
|---|---:|---|
| Mobile | `< 640px` | Single column, bottom nav, sticky create action |
| Tablet | `640px - 959px` | Two-column where safe, route nav wraps |
| Desktop | `960px+` | App dashboard grid, right rail visible |
| Wide | `1280px+` | Max content width holds, gutters expand |

### Touch Rules

- Interactive targets are at least `40px`, primary actions at least `44px`.
- Cards can be tappable only if internal buttons remain clearly distinguishable.
- Text must not overlap chips, icons, or counters.

## Do And Don't

### Do

- Build the app surface first: dashboard, rooms, missions, result cards.
- Keep `응원방 만들기` as the most visible command.
- Use category strips, chips, gauges, and reward icons to express fandom energy.
- Use fictional/demo targets and abstract category visuals.
- Show official/creator expansion as future plan surfaces, not current authority.
- Use dense but readable layouts for dashboards.
- Keep UI copy concrete and action-oriented.

### Don't

- Do not make a landing page as the first screen.
- Do not use real star, team, brand, or work names in demo data.
- Do not imply official partnership, official vote, agency delivery, or guaranteed external impact.
- Do not use celebrity photos or stock-like fandom imagery.
- Do not use giant centered hero text as the main app structure.
- Do not make every panel a floating card.
- Do not use purple/blue gradients as the visual identity.
- Do not use Inter as the primary font.
- Do not bury route content below a full viewport hero.

## Accessibility

- Use semantic landmarks: `header`, `nav`, `main`, `section`, `aside`.
- Navigation uses real links or accessible button semantics.
- Focus states are visible with `focus`.
- Color is never the only state marker. Pair color with text or icon.
- Progress bars include text values.
- Cards with time-sensitive status include text such as `D-2`, `마감 임박`, `결과 공개`.

## Agent Prompt Guide

When implementing UI, use this instruction:

```text
Read DESIGN.md first. Build RallyRoom as a Fan Ops Board app, not a landing page.
The first viewport must show useful app content: room feed, create-room command, user RP summary, missions, and expiring rooms.
Use structured demo read models rather than hardcoded component arrays.
Use the color tokens and component rules in DESIGN.md. Avoid Inter, beige SaaS hero layouts, purple gradients, official idol-app language, and real celebrity/IP names.
```

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-29 | Create `DESIGN.md` before page scaffolding | The initial hero drifted toward generic SaaS landing design. The app needs a durable visual contract before #20 routing work. |
| 2026-05-29 | Use Fan Ops Board as the aesthetic direction | RallyRoom's core object is the small fan-created room, so the interface should feel like a campaign board with rooms, missions, RP, and result cards. |
| 2026-05-29 | Keep demo visuals abstract and fictional | The service has no official partnership with real stars or works, so design must avoid official fandom signals and real-person imagery. |

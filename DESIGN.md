---
version: alpha
name: RallyRoom-design-system
description: "Fan Vote Discovery design brief for a fan-created popularity poll service. This document defines product ingredients, visual tone, content requirements, and interaction principles. It intentionally avoids prescribing a fixed home layout so implementers can compose more creative discovery screens."
references:
  structural:
    - "Korean live/content platforms such as CHZZK and SOOP: content discovery, Featured treatment, category browsing, visual cards, compact status metadata"
  caution:
    - "Use references for product feel and information density only. Do not copy logos, brand colors, celebrity imagery, streamer imagery, real broadcasts, or official partnership signals."
colors:
  ink: "#101318"
  ink-muted: "#4B5563"
  ink-soft: "#6B7280"
  canvas: "#F4F6F8"
  surface: "#FFFFFF"
  surface-raised: "#F9FAFB"
  surface-tint: "#EEF6FF"
  hero-tint: "#F7FBFF"
  hero-mint: "#EFFAF5"
  hero-lavender: "#F5F3FF"
  line: "#DDE3EA"
  line-soft: "#E8EEF4"
  primary: "#00D084"
  primary-pressed: "#00B574"
  primary-soft: "#DFFBF0"
  vote: "#2563EB"
  vote-soft: "#DBEAFE"
  live: "#F43F5E"
  live-soft: "#FFE4EA"
  energy: "#F59E0B"
  energy-soft: "#FEF3C7"
  mission: "#10B981"
  mission-soft: "#D1FAE5"
  reward: "#7C3AED"
  reward-soft: "#EDE9FE"
  focus: "#2563EB"
  danger: "#DC2626"
  success: "#128A63"
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
radii:
  xs: 3px
  sm: 5px
  md: 8px
  pill: 999px
---

# RallyRoom Design System

## Product Frame

RallyRoom is a temporary name. The interface must be designed around the product behavior: fans create and browse popularity polls, vote on candidates, follow ranking changes, collect lightweight rewards, and share result cards.

The core hierarchy is:

- a room is a persistent fan-created space
- the current vote is the active poll session inside that room
- completed votes become room history and result-card material
- the MVP shows one active vote per room, but copy and data shaping should leave room for repeat votes and presets

The home experience is a **content discovery surface**, not a dashboard. Each vote room should feel like browsable content:

- it has a visual identity or thumbnail
- it belongs to a category
- it has a status such as live, ending soon, new, hot, or result published
- it exposes popularity metadata
- it offers one clear next action: vote, open, follow, create, or view result

## Reference Interpretation

Use Korean live/content platforms such as CHZZK and SOOP as inspiration for product feel:

- strong Featured moments
- category-first browsing
- visual card density
- compact live/status metadata
- a sense that many items are available and changing
- profile or account state that does not dominate the browsing surface

Do not copy:

- real streamer or celebrity photos
- real broadcast screenshots
- official platform branding
- brand colors as-is
- ad clutter
- fixed sidebar structures
- literal video-player UI when a poll-specific interaction is better

## Design Direction

**Direction:** Fan Vote Discovery.

Skill-backed references:

- `Video Streaming/OTT` for entertainment discovery and visual Featured treatment.
- `Social Media App` for recurring participation, trends, and lightweight community loops.
- `Portfolio/Grid discovery` for visual-first browsing and filtering.
- `Micro-interactions` for active filters, hover/press states, rank movement, and vote selection.

The product should feel like:

- a fan poll platform with strong Featured content
- a category browser for poll rooms
- a place where new vote rooms keep appearing
- a ranking/voting loop worth revisiting
- a lightweight entertainment product

The product should not feel like:

- a SaaS analytics dashboard
- a fixed two-column admin layout
- a form-first CRUD app
- a generic landing page
- a small list of sample rooms
- a campaign operations board

## Composition Freedom

This document intentionally does **not** prescribe a single home layout.

Implementers may use any combination of:

- asymmetric Featured composition
- full-width content stage
- masonry-like grid
- editorial grid
- horizontal shelves
- tabbed category views
- compact profile drawer
- modal or popover profile summary
- dense card gallery
- split hero/card hybrid
- mobile-first stacked discovery

The layout should be chosen based on content volume, viewport, and the story the screen needs to tell. Do not treat any section order, column count, or sidebar placement as mandatory.

### Layout Anti-Constraints

Avoid these unless there is a specific product reason:

- permanent `8/4` or two-column home layout
- right rail that contains the main summary on every screen
- tall profile or stats panels above content
- dashboard metric cards as the first visual impression
- text-only hero that delays content discovery
- exact replica of CHZZK/SOOP navigation or sidebars

## Required Ingredients

The home screen should include these ingredients somewhere in the experience. Their order and spatial arrangement are intentionally open.

### Featured Vote

A Featured vote is a high-priority poll surfaced with stronger visual treatment.

It may include:

- visual thumbnail or abstract media panel
- title and topic
- category tags
- status badge
- candidate/ranking preview
- vote count or participant count
- D-day or result status
- primary action
- related or trending mini-items

Featured should feel like an editorial/product decision, not just the first item in a list.

### Category Filter

Categories are first-class discovery controls.

Required capabilities:

- all-category option
- selected category state
- multiple visible category chips/tabs/buttons
- category labels that can filter vote content
- counts or status markers when useful

Suggested categories:

- 무대
- 작품
- 게임
- 스포츠
- 캐릭터
- 밈/장면
- 자유 주제

Category controls should feel like browsing tags in a content platform, not admin filters.

### Vote Card

Vote cards are the core repeated object.

Each card should include:

- title
- category
- status
- visual thumbnail or visual tone
- leading candidate or ranking preview
- vote count or participant count
- deadline/result indicator
- one primary action or clear detail link

Cards may vary by type. Some can emphasize thumbnails, some rankings, some deadlines, some published results.

### Content Collections

Use collections to create abundance and return value.

Possible collections:

- Featured
- Hot now
- Ending soon
- New vote rooms
- Category picks
- Result cards
- Followed categories
- Quick polls
- Bracket votes

Collections may be rendered as shelves, grids, carousels, editorial blocks, tabs, or any other suitable composition.

### Compact User State

User status should support the loop without taking over the page.

Possible content:

- RP
- streak
- today votes
- followed categories
- pending rewards
- created vote rooms

Preferred treatments:

- compact strip
- avatar popover
- drawer
- My page
- small chip cluster

Avoid tall summary panels on the home page.

### Create Entry

Creating a vote room must be easy to find.

The create action can be:

- top navigation button
- floating action on mobile
- category-adjacent action
- empty-state action
- Featured-side action

The exact placement is not fixed.

## Content Volume Rules

The design requires enough mock content to look real.

Minimum demo content for home:

- 24 or more vote rooms
- 10 or more categories
- 6 or more poll formats
- at least 1 Featured candidate
- at least 4 ending-soon votes
- at least 6 result-card items
- at least 2 category-specific collections
- varied candidate counts from simple 1:1 matchup rooms to 6+ candidate rooms

Poll format examples:

- single-choice popularity vote
- matchup vote
- bracket vote
- scene pick
- line pick
- quick poll

Each vote room should model:

- title
- topic
- category
- thumbnail tone or image
- candidates
- leading candidate
- vote count
- participant count
- D-day or status
- tags
- poll format
- option-add cost in vote tickets or RP
- result state if published

## Reward-To-Participation Loop

Fans should feel that rewards are useful inside the service, not just decorative.

MVP behavior:

- initial candidates added while creating a room are free
- voting consumes vote tickets
- consumed vote tickets increase both the selected candidate count and Vote Energy
- Vote Energy reaching the goal closes the current vote
- adding an option during an already active vote consumes vote tickets
- an option added mid-vote receives the spent tickets as its initial votes
- if no ticket is available, a later paid/RP fallback can be explored, but it should not be the primary MVP copy
- newly added options can enter a pending or review state before becoming trusted candidates if moderation is needed
- candidate counts should vary so option addition feels meaningful on some rooms and unnecessary on others

This loop supports future monetization because vote tickets, RP, badges, result-card themes, and priority review can become subscription or paid-pack benefits without implying official artist or agency delivery.

## Visual Language

### Overall Mood

Use a spacious content-platform mood:

- broad canvas
- visual thumbnails
- strong Featured moments
- content density
- compact metadata
- clear category chips
- energetic but controlled accent colors

Light mode is the default browsing surface. Featured and result-card moments should stay bright and editorial; avoid large near-black blocks or dark-mode-like pages unless a later direction explicitly asks for it.

### Cards

Vote cards should feel like media/content cards, not admin panels.

Rules:

- radius `8px`
- stable thumbnail area
- readable title
- compact metadata
- visible category/status
- hover/focus state
- no layout shift when counts or labels change

Avoid:

- large empty panels
- cards that contain only text
- repeated identical card structures
- nested card stacks

### Thumbnails

The MVP may use:

- generated abstract thumbnails
- fictional poster cards
- category-based visual patterns
- candidate avatar placeholders
- graphic ranking previews

Thumbnail overlays should show semantic badges such as category, live/result status, D-day, or candidate count. Do not expose internal shorthand labels such as `CAST`, `OPENING`, `MEME CUP`, or other unexplained fixture labels.

The MVP must not use:

- real celebrity photos
- real streamer screenshots
- real sports/team imagery without rights
- brand/IP logos
- stock-like cheering imagery

### Tags And Badges

Use tags for:

- category
- poll format
- live/ending soon/result
- candidate count
- reward/RP

Tag rules:

- pills may use `999px` radius
- selected category chips need clear active styling
- do not rely on color alone
- tags should not become messy multi-line blocks inside cards

### Color Roles

- `primary` green: create/vote action, selected category, active state
- `vote` blue: vote count, ranking state, selected candidate
- `live` rose: live/now/hot status
- `energy` amber: D-day and ending-soon urgency
- `mission` mint: participation missions
- `reward` violet: RP, badges, paid perks
- `hero-tint`, `hero-mint`, `hero-lavender`: bright editorial Featured/result surfaces

Keep accent colors functional and contained. Do not let one hue dominate the whole app, and do not make the product feel like a dark streaming clone.

## Page Ingredients

### Home

Home should communicate discovery, abundance, and current activity.

Use these ingredients freely:

- Featured vote
- category filter
- vote cards
- content collections
- compact user state
- create entry
- search or browse affordance
- result-card previews

### Create Vote Room

Creation remains a workflow page.

Useful ingredients:

- category selection
- poll format selection
- candidate setup
- thumbnail/visual tone selection
- live preview as a vote card
- officiality/safety guard copy

### Vote Detail

Detail should feel like opening a content item.

Useful ingredients:

- visual header or thumbnail
- room title as the persistent space name
- current vote title as the active poll title
- vote/ranking section rendered as a vertical candidate list
- inline option-add entry at the bottom of the candidate list
- tabs for current vote, fan-wall/messages, missions, and result/history
- related vote rooms
- result-card route if published

### Result

Result cards should feel shareable.

Useful ingredients:

- poster-like result visual
- winning candidate
- total votes
- category and poll format
- top message
- next vote suggestions

### Profile

Profile contains personal loop state and history.

Useful ingredients:

- RP summary
- followed categories
- joined votes
- created votes
- result cards
- earned icons

## Interaction Rules

- Category controls filter visible vote content.
- Search narrows visible vote rooms.
- Featured and vote cards link to detail.
- Vote cards expose one primary action.
- Profile summary can expand from avatar or route to My page.
- Browser back/forward navigation must work.
- Keyboard focus order follows visual order.
- Hover/press motion stays under 200ms.
- Respect `prefers-reduced-motion`.

## Responsive Rules

Test at:

- 320
- 375
- 414
- 768
- 1024
- 1440

No horizontal scroll is allowed.

Use:

- `aspect-ratio` for thumbnails
- flexible grids or shelves when useful
- line clamp for titles
- reserved thumbnail space
- compact metadata rows

Avoid:

- fixed-width desktop cards on mobile
- sidebars that push content below the fold
- profile summary cards dominating first view

## Copy Rules

Preferred terms:

- 투표방
- 인기투표
- 후보
- 랭킹
- 카테고리
- Featured
- 결과 카드
- 참여 미션
- RP

Avoid using `응원` as the core UI keyword. It may appear only as secondary emotional context.

Do not imply:

- official vote
- agency delivery
- artist endorsement
- official partnership
- guaranteed external impact

## Accessibility

- Use semantic `header`, `nav`, `main`, `section`, `article`, `aside` only where meaningful.
- Category filters should be real buttons, tabs, or links.
- Cards that navigate should expose a clear link name.
- Thumbnail images need descriptive alt text unless purely decorative.
- Icon-only buttons need labels.
- Text contrast must meet WCAG AA.
- Color is never the only state signal.

## Implementation Prompt

```text
Read DESIGN.md first.
Treat it as an ingredient-based design brief, not a fixed layout spec.
Create a Fan Vote Discovery experience inspired by Korean content platforms: strong Featured treatment, category browsing, visual vote cards, compact user state, and enough mock content to feel alive.
You may freely choose the composition: editorial stage, shelves, grid, asymmetric layout, compact top strip, profile popover, category tabs, or another structure that better expresses discovery.
Do not hard-code a two-column dashboard, permanent right summary rail, text-only hero, or exact CHZZK/SOOP clone.
Increase mock content volume: 24+ vote rooms, 10+ categories, several poll formats, ending-soon items, and result-card items.
Vote cards need thumbnails or visual identities, category tags, status badges, ranking/vote metadata, and one clear action. Do not show unexplained raw thumbnail labels.
Treat each room as a persistent space with one current vote session in the MVP.
Do not use real celebrities, streamers, IP images, official partnership language, or hard dashboard panels.
```

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-29 | Create `DESIGN.md` before page scaffolding | The initial UI drifted toward generic SaaS and needed a durable visual contract. |
| 2026-05-30 | Reframe from cheer/campaign language to vote/ranking behavior | The actual recurring user action is closer to fan-created popularity polls than broad emotional cheering. |
| 2026-05-30 | Replace dashboard-first design with discovery-first direction | The dashboard framing made the product feel like an admin tool and failed to create a content browsing impression. |
| 2026-05-30 | Use CHZZK/SOOP as structural references only | Korean content platforms show useful patterns for Featured, category browsing, and card density, but their brands and real content must not be copied. |
| 2026-05-30 | Remove fixed layout prescriptions | The design system should define ingredients and quality bars, so implementers can create more expressive layouts. |
| 2026-05-30 | Define room as persistent space and vote as current session | This resolves room/vote hierarchy ambiguity while preserving a simple MVP with one active vote per room. |

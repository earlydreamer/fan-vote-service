import type { CategoryTone, PollFormat, RallyRoom, RoomStatus } from '../../types/rallyroom';

type CandidateSeed = readonly [id: string, title: string, voteCount: number];

interface RoomSeed {
  id: string;
  slug: string;
  title: string;
  topic: string;
  categoryId: string;
  targetId: string;
  createdAt: string;
  status?: RoomStatus;
  endAt: string;
  pollFormat: PollFormat;
  tags: string[];
  thumbnail: {
    tone: CategoryTone;
    label: string;
    accent: string;
  };
  featuredLabel?: string;
  goalValue: number;
  currentGoalValue: number;
  participantCount: number;
  candidates: CandidateSeed[];
  topMessage?: string;
  earnedIcon?: string;
  publishedAt?: string;
}

export const demoRooms: RallyRoom[] = [
  createRoom({
    id: 'room-stage-opening',
    slug: 'eunha-stage-opening',
    title: '은하 무대 오프닝 투표방',
    topic: '가상 쇼케이스 첫 화면을 어떤 장면으로 기억할지 팬들이 고르는 Featured 투표.',
    categoryId: 'cat-stage',
    targetId: 'target-eunha-stage',
    createdAt: '2026-05-26T08:00:00.000Z',
    endAt: '2026-05-30T14:59:00.000Z',
    pollFormat: 'scene',
    tags: ['Featured', '마감임박', '장면픽'],
    thumbnail: { tone: 'stage', label: 'OPENING', accent: '#00D084' },
    featuredLabel: '오늘의 대표 투표',
    goalValue: 2200,
    currentGoalValue: 1840,
    participantCount: 1368,
    candidates: [
      ['cand-opening-spotlight', '첫 장면 스포트라이트', 912],
      ['cand-opening-chorus', '합창 엔딩 포즈', 721],
      ['cand-opening-silhouette', '커튼콜 실루엣', 506],
      ['cand-opening-camera', '원테이크 카메라 워크', 398],
      ['cand-opening-light', '초록 조명 전환', 286],
      ['cand-opening-confetti', '종이꽃 피날레', 198],
      ['cand-opening-quiet', '무음 인트로', 154]
    ],
    topMessage: '오프닝 장면이 오래 기억될 수 있게 같이 골라보자.',
    earnedIcon: 'Spotlight Crew'
  }),
  createRoom({
    id: 'room-synth-mv',
    slug: 'synth-city-mv-cut',
    title: '신스 시티 MV 최고의 컷',
    topic: '새로 공개된 가상 뮤직비디오에서 결과 카드 썸네일로 남길 한 장면을 고르는 투표.',
    categoryId: 'cat-music',
    targetId: 'target-synth-city',
    createdAt: '2026-05-30T08:45:00.000Z',
    endAt: '2026-06-05T14:59:00.000Z',
    pollFormat: 'scene',
    tags: ['신규', 'MV', '썸네일'],
    thumbnail: { tone: 'music', label: 'SYNTH', accent: '#2563EB' },
    featuredLabel: '방금 뜬 신규 투표',
    goalValue: 1600,
    currentGoalValue: 470,
    participantCount: 344,
    candidates: [
      ['cand-synth-rooftop', '옥상 네온 컷', 188],
      ['cand-synth-rain', '비 내리는 거리 컷', 152],
      ['cand-synth-dance', '군무 브레이크 컷', 130],
      ['cand-synth-train', '야간 열차 컷', 87]
    ],
    earnedIcon: 'Neon Editor'
  }),
  createRoom({
    id: 'room-neon-character',
    slug: 'neon-character-popularity',
    title: '네온 시티 주인공 인기투표',
    topic: '가상 시리즈의 주인공 후보를 팬들이 직접 추가하고 순위를 만드는 캐릭터 투표.',
    categoryId: 'cat-character',
    targetId: 'target-neon-cast',
    createdAt: '2026-05-29T10:00:00.000Z',
    endAt: '2026-06-01T14:59:00.000Z',
    pollFormat: 'single',
    tags: ['캐릭터', '인기투표', '후보추가'],
    thumbnail: { tone: 'character', label: 'CAST', accent: '#7C3AED' },
    featuredLabel: '캐릭터 픽',
    goalValue: 1800,
    currentGoalValue: 1260,
    participantCount: 908,
    candidates: [
      ['cand-neon-rin', '린: 야간 추격자', 494],
      ['cand-neon-zero', '제로: 해킹 담당', 462],
      ['cand-neon-mika', '미카: 드론 파일럿', 371],
      ['cand-neon-ian', '이안: 기록자', 224],
      ['cand-neon-haru', '하루: 정비사', 166]
    ],
    earnedIcon: 'Character Maker'
  }),
  createRoom({
    id: 'room-meme-line',
    slug: 'weekly-meme-line',
    title: '이번 주 밈 대사 월드컵',
    topic: '커뮤니티에서 반복해서 쓰인 대사를 브래킷으로 모아 다음 결과 카드 문구를 고르는 투표.',
    categoryId: 'cat-meme',
    targetId: 'target-meme-board',
    createdAt: '2026-05-28T12:00:00.000Z',
    endAt: '2026-05-31T14:59:00.000Z',
    pollFormat: 'bracket',
    tags: ['밈', '월드컵', '대사'],
    thumbnail: { tone: 'meme', label: 'MEME CUP', accent: '#F43F5E' },
    featuredLabel: '실시간 급상승',
    goalValue: 1400,
    currentGoalValue: 1188,
    participantCount: 1044,
    candidates: [
      ['cand-meme-late', '이 타이밍에?', 482],
      ['cand-meme-save', '그건 저장해야지', 399],
      ['cand-meme-loop', '다음 방 열어', 344],
      ['cand-meme-close', '마감 10분 전이 진짜다', 301],
      ['cand-meme-ticket', '투표권 아껴뒀다', 277],
      ['cand-meme-card', '결과 카드 각', 180]
    ],
    earnedIcon: 'Meme Curator'
  }),
  createRoom({
    id: 'room-aurora-ending',
    slug: 'aurora-ending-line',
    title: '오로라 결말 한 줄 투표방',
    topic: '가상 웹소설 에피소드의 마지막 문장을 팬들이 고르고 랭킹으로 기록하는 방.',
    categoryId: 'cat-story',
    targetId: 'target-aurora-cast',
    createdAt: '2026-05-25T11:00:00.000Z',
    endAt: '2026-06-02T12:00:00.000Z',
    pollFormat: 'line',
    tags: ['작품', '문장픽', '팬월'],
    thumbnail: { tone: 'story', label: 'AURORA', accent: '#10B981' },
    goalValue: 900,
    currentGoalValue: 515,
    participantCount: 486,
    candidates: [
      ['cand-aurora-line-1', '다시 만날 별빛을 남겼다', 312],
      ['cand-aurora-line-2', '우리의 계절은 아직 끝나지 않았다', 281],
      ['cand-aurora-line-3', '끝은 늘 새로운 장면이었다', 173]
    ],
    topMessage: '문장 자체가 팬들이 만든 작은 기념품이 되면 좋겠어.',
    earnedIcon: 'Story Maker'
  }),
  createRoom({
    id: 'room-sunday-save',
    slug: 'sunday-club-save',
    title: '선데이 클럽 명장면 투표',
    topic: '가상 스포츠 클럽의 주간 하이라이트 중 팬들이 다시 보고 싶은 장면을 고르는 투표.',
    categoryId: 'cat-sports',
    targetId: 'target-sunday-club',
    createdAt: '2026-05-27T09:10:00.000Z',
    endAt: '2026-05-30T15:30:00.000Z',
    pollFormat: 'matchup',
    tags: ['스포츠', '하이라이트', 'D-day'],
    thumbnail: { tone: 'sports', label: 'MATCH', accent: '#F59E0B' },
    goalValue: 1300,
    currentGoalValue: 1040,
    participantCount: 712,
    candidates: [
      ['cand-sunday-save', '후반 추가시간 세이브', 455],
      ['cand-sunday-pass', '원터치 전환 패스', 312]
    ],
    earnedIcon: 'Match Crew'
  }),
  createRoom({
    id: 'room-byte-boss',
    slug: 'byte-dungeon-boss-mvp',
    title: '바이트 던전 보스전 MVP',
    topic: '가상 게임 던전 클리어 후 MVP 장면을 고르는 빠른 투표.',
    categoryId: 'cat-game',
    targetId: 'target-byte-dungeon',
    createdAt: '2026-05-28T05:30:00.000Z',
    endAt: '2026-06-03T11:00:00.000Z',
    pollFormat: 'quick',
    tags: ['게임', 'MVP', '퀵투표'],
    thumbnail: { tone: 'game', label: 'BOSS', accent: '#22C55E' },
    goalValue: 1200,
    currentGoalValue: 688,
    participantCount: 539,
    candidates: [
      ['cand-byte-tank', '마지막 패턴 막은 탱커', 260],
      ['cand-byte-heal', '무적 타이밍 살린 힐러', 244],
      ['cand-byte-burst', '폭딜 마무리 딜러', 221],
      ['cand-byte-shotcall', '콜 정리한 리더', 173]
    ],
    earnedIcon: 'Raid Badge'
  }),
  createRoom({
    id: 'room-comet-stage',
    slug: 'comet-showcase-pose',
    title: '코멧 쇼케이스 엔딩 포즈',
    topic: '가상 쇼케이스 결과 카드에 남길 엔딩 포즈를 팬들이 고르는 투표.',
    categoryId: 'cat-stage',
    targetId: 'target-comet-showcase',
    createdAt: '2026-05-28T13:20:00.000Z',
    endAt: '2026-06-04T14:59:00.000Z',
    pollFormat: 'multi_pick',
    tags: ['무대', '엔딩', '복수선택'],
    thumbnail: { tone: 'stage', label: 'COMET', accent: '#06B6D4' },
    goalValue: 1500,
    currentGoalValue: 832,
    participantCount: 628,
    candidates: [
      ['cand-comet-heart', '하트 라인 포즈', 312],
      ['cand-comet-wink', '윙크 클로즈업', 296],
      ['cand-comet-turn', '턴테이블 포즈', 210],
      ['cand-comet-spark', '스파크 배경 포즈', 178],
      ['cand-comet-wave', '단체 손인사', 144]
    ],
    earnedIcon: 'Stage Picker'
  }),
  createRoom({
    id: 'room-anime-sidekick',
    slug: 'sidekick-best-moment',
    title: '사이드킥 최고의 한 장면',
    topic: '가상 애니메이션 조연 캐릭터가 빛난 장면을 모아 고르는 투표.',
    categoryId: 'cat-anime',
    targetId: 'target-sidekick-crew',
    createdAt: '2026-05-24T08:10:00.000Z',
    endAt: '2026-06-05T10:00:00.000Z',
    pollFormat: 'scene',
    tags: ['애니', '조연', '장면'],
    thumbnail: { tone: 'anime', label: 'EP CUT', accent: '#EC4899' },
    goalValue: 1100,
    currentGoalValue: 544,
    participantCount: 431,
    candidates: [
      ['cand-sidekick-rescue', '무너진 다리 구조 장면', 208],
      ['cand-sidekick-joke', '긴장 풀어준 농담 장면', 177],
      ['cand-sidekick-letter', '편지를 남긴 장면', 166]
    ],
    earnedIcon: 'Episode Keeper'
  }),
  createRoom({
    id: 'room-food-snack',
    slug: 'late-night-snack',
    title: '방송 보며 먹고 싶은 야식픽',
    topic: '주말 라이브를 보며 같이 먹고 싶은 메뉴를 고르는 자유형 투표.',
    categoryId: 'cat-food',
    targetId: 'target-snack-table',
    createdAt: '2026-05-26T17:00:00.000Z',
    endAt: '2026-06-01T09:00:00.000Z',
    pollFormat: 'single',
    tags: ['푸드', '야식', '가벼운픽'],
    thumbnail: { tone: 'food', label: 'SNACK', accent: '#EA580C' },
    goalValue: 700,
    currentGoalValue: 501,
    participantCount: 366,
    candidates: [
      ['cand-snack-tteok', '매콤 떡볶이', 188],
      ['cand-snack-chicken', '순살 치킨', 172],
      ['cand-snack-noodle', '컵라면', 154],
      ['cand-snack-fries', '감자튀김', 111],
      ['cand-snack-ice', '아이스크림', 94],
      ['cand-snack-fruit', '과일컵', 61]
    ],
    earnedIcon: 'Snack Voter'
  }),
  createRoom({
    id: 'room-style-outfit',
    slug: 'concept-outfit-pick',
    title: '콘셉트 포스터 스타일 픽',
    topic: '가상 캐릭터 포스터에 어울리는 스타일 무드를 팬들이 고르는 투표.',
    categoryId: 'cat-fashion',
    targetId: 'target-concept-style',
    createdAt: '2026-05-23T10:00:00.000Z',
    endAt: '2026-06-06T10:00:00.000Z',
    pollFormat: 'multi_pick',
    tags: ['스타일', '포스터', '무드'],
    thumbnail: { tone: 'fashion', label: 'LOOK', accent: '#A855F7' },
    goalValue: 1000,
    currentGoalValue: 402,
    participantCount: 288,
    candidates: [
      ['cand-style-black', '블랙 테크웨어', 156],
      ['cand-style-denim', '워시드 데님', 122],
      ['cand-style-white', '화이트 셋업', 117],
      ['cand-style-varsity', '바시티 재킷', 93]
    ],
    earnedIcon: 'Look Book'
  }),
  createRoom({
    id: 'room-creator-intro',
    slug: 'creator-intro-bgm',
    title: '크리에이터 오프닝 BGM 투표',
    topic: '가상 크리에이터 채널의 새 오프닝에 어울리는 BGM 무드를 고르는 투표.',
    categoryId: 'cat-creator',
    targetId: 'target-creator-lab',
    createdAt: '2026-05-29T07:00:00.000Z',
    endAt: '2026-06-02T14:59:00.000Z',
    pollFormat: 'matchup',
    tags: ['크리에이터', 'BGM', '오프닝'],
    thumbnail: { tone: 'creator', label: 'INTRO', accent: '#0EA5E9' },
    goalValue: 800,
    currentGoalValue: 610,
    participantCount: 477,
    candidates: [
      ['cand-creator-synth', '가벼운 신스팝', 233],
      ['cand-creator-jazz', '밤 산책 재즈', 182],
      ['cand-creator-rock', '짧은 펑크록', 156]
    ],
    earnedIcon: 'Intro Crew'
  }),
  createRoom({
    id: 'room-open-topic',
    slug: 'weekend-rewatch-scene',
    title: '주말에 다시 보고 싶은 장면',
    topic: '카테고리에 얽매이지 않고 팬들이 직접 다시 볼 장면을 추가하는 자유 주제 투표.',
    categoryId: 'cat-free',
    targetId: 'target-free-board',
    createdAt: '2026-05-29T14:20:00.000Z',
    endAt: '2026-06-03T14:59:00.000Z',
    pollFormat: 'quick',
    tags: ['자유주제', '후보추가', '주말'],
    thumbnail: { tone: 'free', label: 'FREE', accent: '#64748B' },
    goalValue: 900,
    currentGoalValue: 389,
    participantCount: 250,
    candidates: [
      ['cand-free-rain', '빗속 엔딩 장면', 144],
      ['cand-free-rooftop', '옥상 대화 장면', 118]
    ],
    earnedIcon: 'Open Picker'
  }),
  createRoom({
    id: 'room-music-hook',
    slug: 'hook-repeat-vote',
    title: '계속 맴도는 훅 파트',
    topic: '가상 앨범 수록곡 중 팬들이 가장 오래 흥얼거린 훅 파트를 고르는 투표.',
    categoryId: 'cat-music',
    targetId: 'target-synth-city',
    createdAt: '2026-05-21T09:30:00.000Z',
    endAt: '2026-06-07T12:00:00.000Z',
    pollFormat: 'line',
    tags: ['음악', '훅', '가사'],
    thumbnail: { tone: 'music', label: 'HOOK', accent: '#3B82F6' },
    goalValue: 1200,
    currentGoalValue: 700,
    participantCount: 502,
    candidates: [
      ['cand-hook-dawn', '새벽이 지나도 남는 멜로디', 260],
      ['cand-hook-city', '도시 불빛을 접어 넣은 밤', 208],
      ['cand-hook-wave', '파도처럼 반복되는 코러스', 188],
      ['cand-hook-run', '다시 달리자는 브리지', 130]
    ],
    earnedIcon: 'Hook Keeper'
  }),
  createRoom({
    id: 'room-story-villain',
    slug: 'villain-redemption',
    title: '빌런 서사 전환점 투표',
    topic: '가상 웹툰에서 빌런이 달라졌다고 느낀 장면을 팬들이 직접 고르는 투표.',
    categoryId: 'cat-story',
    targetId: 'target-aurora-cast',
    createdAt: '2026-05-20T10:00:00.000Z',
    endAt: '2026-06-08T11:00:00.000Z',
    pollFormat: 'scene',
    tags: ['작품', '서사', '전환점'],
    thumbnail: { tone: 'story', label: 'ARC', accent: '#14B8A6' },
    goalValue: 950,
    currentGoalValue: 360,
    participantCount: 269,
    candidates: [
      ['cand-villain-apology', '처음으로 사과한 장면', 148],
      ['cand-villain-choice', '혼자 남기를 선택한 장면', 129],
      ['cand-villain-save', '주인공을 구한 장면', 124],
      ['cand-villain-letter', '편지를 태운 장면', 88],
      ['cand-villain-smile', '웃지 못한 마지막 컷', 71]
    ],
    earnedIcon: 'Arc Reader'
  }),
  createRoom({
    id: 'room-sports-chant',
    slug: 'club-chant-pick',
    title: '클럽 응원 문구 픽',
    topic: '가상 클럽의 다음 팬월 헤더에 올릴 짧은 문구를 고르는 투표.',
    categoryId: 'cat-sports',
    targetId: 'target-sunday-club',
    createdAt: '2026-05-22T12:00:00.000Z',
    endAt: '2026-06-04T10:00:00.000Z',
    pollFormat: 'line',
    tags: ['스포츠', '문구', '팬월'],
    thumbnail: { tone: 'sports', label: 'CHANT', accent: '#F97316' },
    goalValue: 800,
    currentGoalValue: 481,
    participantCount: 333,
    candidates: [
      ['cand-chant-never', '끝까지 한 골 더', 176],
      ['cand-chant-green', '초록 불빛으로 모여', 151],
      ['cand-chant-home', '우리의 홈은 여기', 109]
    ],
    earnedIcon: 'Chant Maker'
  }),
  createRoom({
    id: 'room-character-pair',
    slug: 'best-duo-pair',
    title: '최고의 듀오 케미 투표',
    topic: '가상 캐릭터 조합 중 다음 팬아트 주제로 보고 싶은 듀오를 고르는 투표.',
    categoryId: 'cat-character',
    targetId: 'target-neon-cast',
    createdAt: '2026-05-18T09:00:00.000Z',
    endAt: '2026-06-06T14:59:00.000Z',
    pollFormat: 'matchup',
    tags: ['캐릭터', '듀오', '팬아트'],
    thumbnail: { tone: 'character', label: 'DUO', accent: '#8B5CF6' },
    goalValue: 1100,
    currentGoalValue: 694,
    participantCount: 515,
    candidates: [
      ['cand-duo-rin-zero', '린 x 제로', 320],
      ['cand-duo-mika-ian', '미카 x 이안', 278],
      ['cand-duo-haru-rin', '하루 x 린', 141],
      ['cand-duo-zero-ian', '제로 x 이안', 132]
    ],
    earnedIcon: 'Duo Badge'
  }),
  createRoom({
    id: 'room-pixel-season',
    slug: 'pixel-league-season',
    title: '픽셀 리그 시즌 투표 결과',
    topic: '가상 게임 리그 시즌 종료 후 팬들이 만든 투표 결과 카드.',
    categoryId: 'cat-game',
    targetId: 'target-pixel-league',
    createdAt: '2026-05-16T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-27T12:00:00.000Z',
    pollFormat: 'matchup',
    tags: ['결과공개', '게임', '시즌'],
    thumbnail: { tone: 'game', label: 'RESULT', accent: '#22C55E' },
    goalValue: 1000,
    currentGoalValue: 1000,
    participantCount: 1421,
    candidates: [
      ['cand-pixel-comeback', '역전승 하이라이트', 803],
      ['cand-pixel-teamwork', '팀워크 장면', 588],
      ['cand-pixel-rookie', '루키 슈퍼플레이', 430],
      ['cand-pixel-coach', '감독 콜 장면', 260]
    ],
    topMessage: '결과 카드가 다음 시즌 투표방으로 이어지는 느낌이라 좋다.',
    earnedIcon: 'Comeback Badge',
    publishedAt: '2026-05-27T14:00:00.000Z'
  }),
  createRoom({
    id: 'result-luna-duet',
    slug: 'luna-duet-highlight',
    title: '루나 듀엣 하이라이트 결과',
    topic: '가상 듀엣 무대의 기억할 장면을 팬들이 골라 만든 결과 카드.',
    categoryId: 'cat-stage',
    targetId: 'target-comet-showcase',
    createdAt: '2026-05-15T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-26T10:00:00.000Z',
    pollFormat: 'scene',
    tags: ['결과공개', '무대', '듀엣'],
    thumbnail: { tone: 'stage', label: 'DUET', accent: '#00D084' },
    goalValue: 1200,
    currentGoalValue: 1200,
    participantCount: 920,
    candidates: [
      ['cand-duet-harmony', '마지막 화음 장면', 602],
      ['cand-duet-eye', '시선 교차 장면', 480],
      ['cand-duet-walk', '무대 중앙 워킹', 260]
    ],
    earnedIcon: 'Duet Memory',
    publishedAt: '2026-05-26T12:00:00.000Z'
  }),
  createRoom({
    id: 'result-aurora-side',
    slug: 'aurora-side-story',
    title: '오로라 외전 캐릭터 결과',
    topic: '가상 외전에서 팬들이 더 보고 싶은 캐릭터를 고른 결과 카드.',
    categoryId: 'cat-story',
    targetId: 'target-aurora-cast',
    createdAt: '2026-05-14T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-25T10:00:00.000Z',
    pollFormat: 'single',
    tags: ['결과공개', '작품', '외전'],
    thumbnail: { tone: 'story', label: 'SIDE', accent: '#10B981' },
    goalValue: 900,
    currentGoalValue: 900,
    participantCount: 733,
    candidates: [
      ['cand-side-min', '민의 기록장', 388],
      ['cand-side-ryu', '류의 사라진 하루', 342]
    ],
    earnedIcon: 'Side Story',
    publishedAt: '2026-05-25T12:00:00.000Z'
  }),
  createRoom({
    id: 'result-sunday-save',
    slug: 'sunday-final-save-result',
    title: '선데이 클럽 세이브 장면 결과',
    topic: '가상 클럽의 지난 결승전 장면 투표 결과 카드.',
    categoryId: 'cat-sports',
    targetId: 'target-sunday-club',
    createdAt: '2026-05-13T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-24T10:00:00.000Z',
    pollFormat: 'quick',
    tags: ['결과공개', '스포츠', '명장면'],
    thumbnail: { tone: 'sports', label: 'SAVE', accent: '#F59E0B' },
    goalValue: 950,
    currentGoalValue: 950,
    participantCount: 690,
    candidates: [
      ['cand-final-save', '골라인 세이브', 421],
      ['cand-final-tackle', '마지막 태클', 330],
      ['cand-final-run', '측면 돌파', 214]
    ],
    earnedIcon: 'Final Save',
    publishedAt: '2026-05-24T12:00:00.000Z'
  }),
  createRoom({
    id: 'result-meme-catchphrase',
    slug: 'meme-catchphrase-final',
    title: '밈 대사 결승 결과',
    topic: '팬월에서 가장 많이 반복된 대사의 최종 결과 카드.',
    categoryId: 'cat-meme',
    targetId: 'target-meme-board',
    createdAt: '2026-05-12T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-23T10:00:00.000Z',
    pollFormat: 'bracket',
    tags: ['결과공개', '밈', '월드컵'],
    thumbnail: { tone: 'meme', label: 'FINAL', accent: '#F43F5E' },
    goalValue: 850,
    currentGoalValue: 850,
    participantCount: 812,
    candidates: [
      ['cand-catch-save', '그건 저장해야지', 488],
      ['cand-catch-next', '다음 방 열어', 461],
      ['cand-catch-card', '결과 카드 각', 300],
      ['cand-catch-late', '이 타이밍에?', 255]
    ],
    earnedIcon: 'Catchphrase',
    publishedAt: '2026-05-23T12:00:00.000Z'
  }),
  createRoom({
    id: 'result-anime-opening',
    slug: 'anime-opening-result',
    title: '애니 오프닝 컷 결과',
    topic: '가상 애니 오프닝에서 팬들이 가장 다시 보고 싶은 컷의 결과 카드.',
    categoryId: 'cat-anime',
    targetId: 'target-sidekick-crew',
    createdAt: '2026-05-11T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-22T10:00:00.000Z',
    pollFormat: 'scene',
    tags: ['결과공개', '애니', '오프닝'],
    thumbnail: { tone: 'anime', label: 'OP', accent: '#EC4899' },
    goalValue: 700,
    currentGoalValue: 700,
    participantCount: 566,
    candidates: [
      ['cand-anime-sky', '하늘을 가르는 컷', 305],
      ['cand-anime-run', '달리는 실루엣 컷', 282],
      ['cand-anime-smile', '엔딩 직전 미소 컷', 221]
    ],
    earnedIcon: 'Opening Keeper',
    publishedAt: '2026-05-22T12:00:00.000Z'
  }),
  createRoom({
    id: 'result-food-dessert',
    slug: 'dessert-table-result',
    title: '디저트 테이블 결과',
    topic: '팬들이 골라 만든 가상 뷰잉파티 디저트 결과 카드.',
    categoryId: 'cat-food',
    targetId: 'target-snack-table',
    createdAt: '2026-05-10T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-21T10:00:00.000Z',
    pollFormat: 'single',
    tags: ['결과공개', '푸드', '파티'],
    thumbnail: { tone: 'food', label: 'SWEET', accent: '#EA580C' },
    goalValue: 650,
    currentGoalValue: 650,
    participantCount: 420,
    candidates: [
      ['cand-dessert-cake', '딸기 케이크', 238],
      ['cand-dessert-cookie', '초코 쿠키', 201],
      ['cand-dessert-pudding', '커스터드 푸딩', 144]
    ],
    earnedIcon: 'Sweet Pick',
    publishedAt: '2026-05-21T12:00:00.000Z'
  }),
  createRoom({
    id: 'result-fashion-look',
    slug: 'lookbook-result',
    title: '룩북 콘셉트 결과',
    topic: '가상 포스터 촬영 콘셉트를 팬들이 고른 결과 카드.',
    categoryId: 'cat-fashion',
    targetId: 'target-concept-style',
    createdAt: '2026-05-09T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-20T10:00:00.000Z',
    pollFormat: 'multi_pick',
    tags: ['결과공개', '스타일', '룩북'],
    thumbnail: { tone: 'fashion', label: 'LOOKBOOK', accent: '#A855F7' },
    goalValue: 720,
    currentGoalValue: 720,
    participantCount: 463,
    candidates: [
      ['cand-look-tech', '블랙 테크웨어', 260],
      ['cand-look-school', '스쿨룩 변주', 244],
      ['cand-look-summer', '여름 셋업', 160]
    ],
    earnedIcon: 'Lookbook',
    publishedAt: '2026-05-20T12:00:00.000Z'
  }),
  createRoom({
    id: 'result-creator-clip',
    slug: 'creator-clip-result',
    title: '크리에이터 클립 제목 결과',
    topic: '가상 크리에이터 클립의 제목을 팬들이 고른 결과 카드.',
    categoryId: 'cat-creator',
    targetId: 'target-creator-lab',
    createdAt: '2026-05-08T12:00:00.000Z',
    status: 'result_published',
    endAt: '2026-05-19T10:00:00.000Z',
    pollFormat: 'line',
    tags: ['결과공개', '크리에이터', '제목'],
    thumbnail: { tone: 'creator', label: 'CLIP', accent: '#0EA5E9' },
    goalValue: 600,
    currentGoalValue: 600,
    participantCount: 389,
    candidates: [
      ['cand-clip-title-1', '그 장면을 결국 해냈다', 210],
      ['cand-clip-title-2', '오늘의 판단은 빨랐다', 188],
      ['cand-clip-title-3', '편집자가 웃은 이유', 151]
    ],
    earnedIcon: 'Clip Editor',
    publishedAt: '2026-05-19T12:00:00.000Z'
  })
];

function createRoom(seed: RoomSeed): RallyRoom {
  const candidates = seed.candidates.map(([id, title, voteCount]) => ({
    id,
    targetId: seed.targetId,
    title,
    status: 'approved' as const,
    voteCount
  }));
  const topMessage = seed.topMessage ?? `${seed.title}에 남길 팬들의 선택을 모으는 중이에요.`;

  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    topic: seed.topic,
    categoryId: seed.categoryId,
    primaryTargetId: seed.targetId,
    createdAt: seed.createdAt,
    status: seed.status ?? 'active',
    visibility: 'public',
    endAt: seed.endAt,
    pollFormat: seed.pollFormat,
    tags: seed.tags,
    thumbnail: seed.thumbnail,
    isFeatured: Boolean(seed.featuredLabel),
    featuredLabel: seed.featuredLabel,
    addOptionCost: {
      voteTickets: 1,
      rp: 120
    },
    goalValue: seed.goalValue,
    currentGoalValue: seed.currentGoalValue,
    participantCount: seed.participantCount,
    candidates,
    missions: [
      {
        id: `${seed.id}-mission-vote`,
        type: 'vote',
        title: '오늘의 투표권 사용하기',
        rewardRp: 30,
        rewardEnergy: 25,
        isCompleted: seed.status === 'result_published'
      },
      {
        id: `${seed.id}-mission-message`,
        type: 'message',
        title: '선택 이유를 팬월에 남기기',
        rewardRp: 45,
        rewardEnergy: 30,
        isCompleted: false
      }
    ],
    messages: [
      {
        id: `${seed.id}-message-1`,
        type: 'cheer',
        body: topMessage,
        status: 'visible',
        createdAt: seed.createdAt
      },
      {
        id: `${seed.id}-message-2`,
        type: 'question',
        body: '후보를 더 추가하면 투표 흐름이 훨씬 살아날 것 같아요.',
        status: 'visible',
        createdAt: seed.createdAt
      }
    ],
    resultCard: {
      winnerCandidateId: candidates[0]?.id ?? '',
      totalParticipants: seed.participantCount,
      topMessage,
      earnedIcon: seed.earnedIcon ?? 'Vote Maker',
      publishedAt: seed.publishedAt
    }
  };
}

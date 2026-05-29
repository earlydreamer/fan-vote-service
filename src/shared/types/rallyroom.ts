export type CategoryTone =
  | 'stage'
  | 'story'
  | 'game'
  | 'sports'
  | 'character'
  | 'meme'
  | 'anime'
  | 'music'
  | 'food'
  | 'fashion'
  | 'creator'
  | 'free';
export type TargetType = 'fictional-person' | 'fictional-work' | 'fictional-team' | 'topic';
export type RoomStatus = 'active' | 'closed' | 'result_published';
export type RoomVisibility = 'public' | 'link_only';
export type CandidateStatus = 'approved' | 'pending' | 'hidden';
export type MissionType = 'check_in' | 'share' | 'message' | 'vote';
export type MessageType = 'cheer' | 'question';
export type MessageStatus = 'visible' | 'hidden' | 'pending';
export type PollFormat = 'single' | 'matchup' | 'bracket' | 'scene' | 'line' | 'quick' | 'multi_pick';
export type DiscoverySort = 'popular' | 'endingSoon' | 'newest' | 'results';

export interface Category {
  id: string;
  name: string;
  tone: CategoryTone;
  colorToken: string;
  isActive: boolean;
}

export interface RallyTarget {
  id: string;
  categoryId: string;
  name: string;
  targetType: TargetType;
  isSelectable: boolean;
  fictionalNotice: boolean;
}

export interface Candidate {
  id: string;
  targetId: string;
  title: string;
  status: CandidateStatus;
  voteCount: number;
}

export interface RoomThumbnail {
  tone: CategoryTone;
  label: string;
  accent: string;
}

export interface OptionAddCost {
  voteTickets: number;
  rp: number;
}

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  rewardRp: number;
  rewardEnergy: number;
  isCompleted: boolean;
}

export interface RoomMessage {
  id: string;
  type: MessageType;
  body: string;
  status: MessageStatus;
  createdAt: string;
}

export interface ResultCard {
  winnerCandidateId: string;
  totalParticipants: number;
  topMessage: string;
  earnedIcon: string;
  publishedAt?: string;
}

export interface RallyRoom {
  id: string;
  slug: string;
  title: string;
  voteTitle?: string;
  topic: string;
  categoryId: string;
  primaryTargetId: string;
  createdAt: string;
  status: RoomStatus;
  visibility: RoomVisibility;
  endAt: string;
  pollFormat: PollFormat;
  tags: string[];
  thumbnail: RoomThumbnail;
  isFeatured: boolean;
  featuredLabel?: string;
  addOptionCost: OptionAddCost;
  goalValue: number;
  currentGoalValue: number;
  participantCount: number;
  candidates: Candidate[];
  missions: Mission[];
  messages: RoomMessage[];
  resultCard: ResultCard;
}

export interface ProfileReadModel {
  totalRp: number;
  weeklyRp: number;
  streakDays: number;
  voteTickets: number;
  todayVotes: number;
  followedCategoryIds: string[];
  earnedRewards: string[];
  joinedRoomIds: string[];
  createdRoomIds: string[];
}

export interface CrewRoomStat {
  roomId: string;
  title: string;
  participantCount: number;
  voteCount: number;
  missionCompletionRate: number;
  messageCount: number;
}

export interface CrewStatsReadModel {
  totalRooms: number;
  activeRooms: number;
  totalParticipants: number;
  averageMissionCompletionRate: number;
  strongestCategoryId: string;
  roomStats: CrewRoomStat[];
  nextMissionSuggestion: string;
}

export interface MissionSummary extends Mission {
  roomId: string;
  roomTitle: string;
}

export interface DashboardReadModel {
  categories: Category[];
  targets: RallyTarget[];
  allRooms: RallyRoom[];
  activeRooms: RallyRoom[];
  expiringRooms: RallyRoom[];
  featuredRooms: RallyRoom[];
  resultRooms: RallyRoom[];
  todayMissions: MissionSummary[];
  profile: ProfileReadModel;
  templates: Array<{
    id: string;
    title: string;
    description: string;
    categoryId: string;
  }>;
}

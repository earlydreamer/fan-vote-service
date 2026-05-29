export type CategoryTone = 'stage' | 'story' | 'game' | 'sports';
export type TargetType = 'fictional-person' | 'fictional-work' | 'fictional-team' | 'topic';
export type RoomStatus = 'active' | 'closed' | 'result_published';
export type RoomVisibility = 'public' | 'link_only';
export type CandidateStatus = 'approved' | 'pending' | 'hidden';
export type MissionType = 'check_in' | 'share' | 'message' | 'vote';
export type MessageType = 'cheer' | 'question';
export type MessageStatus = 'visible' | 'hidden' | 'pending';

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
  topic: string;
  categoryId: string;
  primaryTargetId: string;
  status: RoomStatus;
  visibility: RoomVisibility;
  endAt: string;
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
  activeRooms: RallyRoom[];
  expiringRooms: RallyRoom[];
  todayMissions: MissionSummary[];
  profile: ProfileReadModel;
  templates: Array<{
    id: string;
    title: string;
    description: string;
    categoryId: string;
  }>;
}

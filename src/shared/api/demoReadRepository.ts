import categoriesJson from '../data/demo/categories.json';
import crewStatsJson from '../data/demo/crewStats.json';
import profileJson from '../data/demo/profile.json';
import roomsJson from '../data/demo/rooms.json';
import targetsJson from '../data/demo/targets.json';
import type {
  Category,
  CrewStatsReadModel,
  DashboardReadModel,
  MissionSummary,
  ProfileReadModel,
  RallyRoom,
  RallyTarget
} from '../types/rallyroom';

const categories = categoriesJson as Category[];
const targets = targetsJson as RallyTarget[];
const rooms = roomsJson as RallyRoom[];
const profile = profileJson as ProfileReadModel;
const crewStats = crewStatsJson as CrewStatsReadModel;

export const demoReadRepository = {
  getDashboard(): DashboardReadModel {
    const activeRooms = rooms.filter((room) => room.status === 'active');
    const expiringRooms = [...activeRooms].sort(
      (left, right) => new Date(left.endAt).getTime() - new Date(right.endAt).getTime()
    );

    return {
      categories: categories.filter((category) => category.isActive),
      targets: targets.filter((target) => target.isSelectable),
      activeRooms,
      expiringRooms,
      todayMissions: getTodayMissions(activeRooms),
      profile,
      templates: [
        {
          id: 'template-dday',
          title: 'D-day 투표방',
          description: '마감일을 정하고 Vote Energy를 함께 채우는 기본 템플릿',
          categoryId: 'cat-stage'
        },
        {
          id: 'template-result',
          title: '결과 카드형',
          description: '투표 종료 후 팬월 문구와 우승 후보를 카드로 남기는 템플릿',
          categoryId: 'cat-game'
        }
      ]
    };
  },

  getRoomDetail(roomId: string): RallyRoom | undefined {
    const room = rooms.find((candidate) => candidate.id === roomId || candidate.slug === roomId);
    if (!room) return undefined;

    return {
      ...room,
      candidates: room.candidates.filter((candidate) => candidate.status === 'approved'),
      messages: room.messages.filter((message) => message.status === 'visible')
    };
  },

  getProfile(): ProfileReadModel {
    return profile;
  },

  getCrewStats(): CrewStatsReadModel {
    return crewStats;
  },

  getTargets(): RallyTarget[] {
    return targets;
  },

  getCategory(categoryId: string): Category | undefined {
    return categories.find((category) => category.id === categoryId);
  }
};

function getTodayMissions(activeRooms: RallyRoom[]): MissionSummary[] {
  return activeRooms.flatMap((room) =>
    room.missions
      .filter((mission) => !mission.isCompleted)
      .map((mission) => ({
        ...mission,
        roomId: room.id,
        roomTitle: room.title
      }))
  );
}

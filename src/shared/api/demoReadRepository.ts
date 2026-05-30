import categoriesJson from '../data/demo/categories.json';
import crewStatsJson from '../data/demo/crewStats.json';
import profileJson from '../data/demo/profile.json';
import { demoRooms } from '../data/demo/demoRooms';
import targetsJson from '../data/demo/targets.json';
import type {
  Category,
  CrewStatsReadModel,
  DashboardReadModel,
  DiscoverySort,
  MissionSummary,
  ProfileReadModel,
  RallyRoom,
  RallyTarget
} from '../types/rallyroom';

const categories = categoriesJson as Category[];
const targets = targetsJson as RallyTarget[];
const rooms = demoRooms;
const profile = profileJson as ProfileReadModel;
const crewStats = crewStatsJson as CrewStatsReadModel;

export const demoReadRepository = {
  getDashboard(): DashboardReadModel {
    const allRooms = sortDiscoveryRooms(rooms, 'popular');
    const activeRooms = allRooms.filter((room) => room.status === 'active');
    const expiringRooms = sortDiscoveryRooms(activeRooms, 'endingSoon').slice(0, 8);
    const featuredRooms = allRooms.filter((room) => room.isFeatured);
    const resultRooms = sortDiscoveryRooms(
      allRooms.filter((room) => room.status === 'result_published'),
      'results'
    );

    return {
      categories: categories.filter((category) => category.isActive),
      targets: targets.filter((target) => target.isSelectable),
      allRooms,
      activeRooms,
      expiringRooms,
      featuredRooms,
      resultRooms,
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
        },
        {
          id: 'template-option-add',
          title: '후보 추가형',
          description: '팬이 투표권이나 RP를 써서 새 투표 항목을 제안하는 템플릿',
          categoryId: 'cat-character'
        }
      ]
    };
  },

  getDiscoveryRooms(sort: DiscoverySort = 'popular'): RallyRoom[] {
    return sortDiscoveryRooms(rooms, sort);
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

  updateProfile(updates: Partial<ProfileReadModel>): ProfileReadModel {
    Object.assign(profile, updates);
    window.dispatchEvent(new CustomEvent('profile-updated'));
    return profile;
  },

  exchangeRpToTickets(amount: number): boolean {
    const cost = amount * 100;
    if (profile.totalRp < cost) return false;

    this.updateProfile({
      totalRp: Math.max(profile.totalRp - cost, 0),
      voteTickets: profile.voteTickets + amount
    });
    return true;
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

function sortDiscoveryRooms(source: RallyRoom[], sort: DiscoverySort): RallyRoom[] {
  const sortedRooms = [...source];

  switch (sort) {
    case 'endingSoon':
      return sortedRooms
        .filter((room) => room.status === 'active')
        .sort((left, right) => new Date(left.endAt).getTime() - new Date(right.endAt).getTime());
    case 'newest':
      return sortedRooms.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
    case 'results':
      return sortedRooms
        .filter((room) => room.status === 'result_published')
        .sort(
          (left, right) =>
            new Date(right.resultCard.publishedAt ?? right.endAt).getTime() -
            new Date(left.resultCard.publishedAt ?? left.endAt).getTime()
        );
    case 'popular':
    default:
      return sortedRooms.sort((left, right) => roomHeat(right) - roomHeat(left));
  }
}

function roomHeat(room: RallyRoom): number {
  const voteCount = room.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
  const statusBoost = room.status === 'active' ? 400 : 0;
  const featuredBoost = room.isFeatured ? 250 : 0;

  return voteCount + room.participantCount + statusBoost + featuredBoost;
}

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

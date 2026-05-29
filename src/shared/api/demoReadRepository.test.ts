import { describe, expect, it } from 'vitest';
import { demoReadRepository } from './demoReadRepository';

describe('demoReadRepository', () => {
  it('provides enough discovery content for a streaming-style vote home', () => {
    const dashboard = demoReadRepository.getDashboard();

    expect(dashboard.categories.length).toBeGreaterThanOrEqual(10);
    expect(dashboard.allRooms.length).toBeGreaterThanOrEqual(24);
    expect(dashboard.featuredRooms.length).toBeGreaterThanOrEqual(4);
    expect(dashboard.expiringRooms.length).toBeGreaterThanOrEqual(4);
    expect(dashboard.resultRooms.length).toBeGreaterThanOrEqual(6);
    expect(new Set(dashboard.allRooms.map((room) => room.pollFormat)).size).toBeGreaterThanOrEqual(6);
    expect(new Set(dashboard.allRooms.map((room) => room.categoryId)).size).toBeGreaterThanOrEqual(10);
  });

  it('models varied candidate counts and option-add costs for the reward loop', () => {
    const dashboard = demoReadRepository.getDashboard();
    const candidateCounts = dashboard.allRooms.map((room) => room.candidates.length);

    expect(Math.min(...candidateCounts)).toBeLessThanOrEqual(2);
    expect(Math.max(...candidateCounts)).toBeGreaterThanOrEqual(7);
    expect(
      dashboard.allRooms.every(
        (room) => room.addOptionCost.voteTickets > 0 || room.addOptionCost.rp > 0
      )
    ).toBe(true);
  });

  it('returns sorted discovery rooms for popular, deadline, newest, and result views', () => {
    expect(demoReadRepository.getDiscoveryRooms('popular')[0]?.id).toBe('room-stage-opening');
    expect(demoReadRepository.getDiscoveryRooms('endingSoon')[0]?.id).toBe('room-stage-opening');
    expect(demoReadRepository.getDiscoveryRooms('newest')[0]?.id).toBe('room-synth-mv');
    expect(demoReadRepository.getDiscoveryRooms('results')[0]?.status).toBe('result_published');
  });
});

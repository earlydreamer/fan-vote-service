import { describe, expect, it } from 'vitest';
import { demoReadRepository } from './demoReadRepository';

describe('demoReadRepository', () => {
  it('returns schema-aware dashboard data for page rendering', () => {
    const dashboard = demoReadRepository.getDashboard();

    expect(dashboard.profile.totalRp).toBeGreaterThan(0);
    expect(dashboard.activeRooms.length).toBeGreaterThan(0);
    expect(dashboard.expiringRooms.length).toBeGreaterThan(0);
    expect(dashboard.todayMissions.length).toBeGreaterThan(0);
    expect(dashboard.categories.every((category) => category.isActive)).toBe(true);
    expect(dashboard.activeRooms.every((room) => room.status === 'active')).toBe(true);
  });

  it('returns room detail data filtered for public read surfaces', () => {
    const room = demoReadRepository.getRoomDetail('room-stage-opening');

    expect(room).toBeDefined();
    expect(room?.candidates.every((candidate) => candidate.status === 'approved')).toBe(true);
    expect(room?.messages.every((message) => message.status === 'visible')).toBe(true);
  });

  it('returns aggregate crew stats without exposing raw activity events', () => {
    const crewStats = demoReadRepository.getCrewStats();

    expect(crewStats.totalRooms).toBeGreaterThan(0);
    expect(crewStats).not.toHaveProperty('events');
    expect(crewStats).not.toHaveProperty('rawEvents');
  });

  it('keeps demo targets fictional to avoid official partnership confusion', () => {
    const targets = demoReadRepository.getTargets();

    expect(targets.length).toBeGreaterThan(0);
    expect(targets.every((target) => target.fictionalNotice)).toBe(true);
  });
});

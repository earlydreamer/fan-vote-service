import { describe, expect, it } from 'vitest';
import { buildPricingIntent } from './pricingIntent';

describe('buildPricingIntent', () => {
  it('builds a checkout intent for a paid fan package without trusted reward fields', () => {
    const result = buildPricingIntent({
      itemId: 'plus-monthly',
      userId: 'demo-user'
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.payload).toMatchObject({
      command: 'create-checkout-session',
      checkout: {
        itemId: 'plus-monthly',
        kind: 'subscription',
        userId: 'demo-user',
        returnTo: '/profile'
      }
    });

    const serializedPayload = JSON.stringify(result.payload);

    expect(serializedPayload).not.toContain('totalRp');
    expect(serializedPayload).not.toContain('total_rp');
    expect(serializedPayload).not.toContain('voteTickets');
    expect(serializedPayload).not.toContain('vote_tickets');
    expect(serializedPayload).not.toContain('rewardRp');
    expect(serializedPayload).not.toContain('reward_rp');
  });

  it('builds a separate Crew partnership inquiry intent instead of a checkout', () => {
    const result = buildPricingIntent({
      itemId: 'crew-partnership',
      userId: 'demo-user'
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.payload).toMatchObject({
      command: 'request-crew-partnership',
      inquiry: {
        itemId: 'crew-partnership',
        kind: 'partnership_inquiry',
        userId: 'demo-user',
        followUp: 'official-account-review'
      }
    });
  });

  it('rejects unknown pricing items', () => {
    const result = buildPricingIntent({
      itemId: 'unknown-pack',
      userId: 'demo-user'
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.errors).toContain('선택할 수 없는 요금제예요.');
  });
});

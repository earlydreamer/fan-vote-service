export type PricingItemId = 'plus-monthly' | 'vote-ticket-pack' | 'crew-partnership';

type CheckoutItemKind = 'subscription' | 'credit_pack';

interface PricingIntentInput {
  itemId: string;
  userId: string;
}

interface CheckoutIntentPayload {
  command: 'create-checkout-session';
  checkout: {
    itemId: Exclude<PricingItemId, 'crew-partnership'>;
    kind: CheckoutItemKind;
    userId: string;
    returnTo: '/profile';
  };
}

interface CrewPartnershipIntentPayload {
  command: 'request-crew-partnership';
  inquiry: {
    itemId: 'crew-partnership';
    kind: 'partnership_inquiry';
    userId: string;
    followUp: 'official-account-review';
  };
}

export type PricingIntentPayload = CheckoutIntentPayload | CrewPartnershipIntentPayload;

export type PricingIntentResult =
  | {
      ok: true;
      payload: PricingIntentPayload;
      note: string;
    }
  | {
      ok: false;
      errors: string[];
    };

const checkoutItems: Record<Exclude<PricingItemId, 'crew-partnership'>, CheckoutItemKind> = {
  'plus-monthly': 'subscription',
  'vote-ticket-pack': 'credit_pack'
};

export function buildPricingIntent({ itemId, userId }: PricingIntentInput): PricingIntentResult {
  if (itemId === 'crew-partnership') {
    return {
      ok: true,
      payload: {
        command: 'request-crew-partnership',
        inquiry: {
          itemId,
          kind: 'partnership_inquiry',
          userId,
          followUp: 'official-account-review'
        }
      },
      note: '공식성 검증 문의 intent만 만들고 실제 제휴 상태는 서버 승인 뒤 반영돼요.'
    };
  }

  if (itemId === 'plus-monthly' || itemId === 'vote-ticket-pack') {
    return {
      ok: true,
      payload: {
        command: 'create-checkout-session',
        checkout: {
          itemId,
          kind: checkoutItems[itemId],
          userId,
          returnTo: '/profile'
        }
      },
      note: '실제 결제는 실행하지 않았어요. 결제 완료 후 보상은 서버 응답과 read model에서만 갱신돼요.'
    };
  }

  return {
    ok: false,
    errors: ['선택할 수 없는 요금제예요.']
  };
}

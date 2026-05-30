import { useState } from 'react';
import { ArrowRight, BadgeCheck, CreditCard, Sparkles, Ticket } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { buildPricingIntent, type PricingIntentResult, type PricingItemId } from './pricingIntent';

const plans = [
  {
    id: 'free-demo',
    name: 'Free',
    price: '0원',
    description: '팬이 직접 투표방을 열고 기본 결과 카드를 남기는 데모 플랜',
    features: ['투표방 생성', '기본 투표권', '팬월 메시지', '기본 결과 카드'],
    action: null
  },
  {
    id: 'plus-monthly',
    name: 'Plus',
    price: '월 4,900원',
    description: '꾸준히 방을 운영하는 팬을 위한 투표권, RP, 결과 카드 확장',
    features: ['추가 투표권 충전', '후보 추가 우선 검수', '결과 카드 테마', '관심 카테고리 알림'],
    action: 'Plus 시작하기'
  },
  {
    id: 'crew-partnership',
    name: 'Crew',
    price: '상담 필요',
    description: '향후 공식 계정이나 크리에이터가 aggregate 지표를 보는 확장 플랜',
    features: ['Crew 대시보드', '공식성 검증 플로우', '투표방 운영 리포트', '제휴 캠페인 템플릿'],
    action: 'Crew 문의하기'
  }
] as const;

const addOnPackages = [
  {
    id: 'vote-ticket-pack',
    title: '투표권 팩',
    price: '1,900원',
    description: '관심 투표방에서 후보 항목 추가와 추가 참여 intent를 만들기 위한 가벼운 패키지',
    action: '투표권 팩 선택'
  }
] as const;

const demoUserId = 'demo-user';

export function PricingPage() {
  const [intentResult, setIntentResult] = useState<PricingIntentResult | null>(null);

  const handleSelect = (itemId: PricingItemId) => {
    setIntentResult(buildPricingIntent({ itemId, userId: demoUserId }));
  };

  return (
    <div className="pricing-page">
      <section className="pricing-hero" aria-labelledby="pricing-title">
        <div>
          <p className="eyebrow">Business loop</p>
          <h1 id="pricing-title">요금제</h1>
          <p>
            MVP에서는 실제 결제를 실행하지 않고, 투표권과 RP가 후보 추가/결과 카드/반복 참여로 이어지는 구매 intent를
            화면으로 보여줘요.
          </p>
        </div>
        <div className="pricing-hero__actions" aria-label="요금제 후속 행동">
          <a className="button button-primary" href="/rooms/new">
            <Sparkles size={17} aria-hidden="true" />
            투표방 만들기
          </a>
          <a className="button button-secondary" href="/profile">
            내 활동에서 보상 확인
          </a>
        </div>
      </section>

      <div className="plan-grid">
        {plans.map((plan) => (
          <article key={plan.name} className="plan-card" aria-label={`${plan.name} 요금제`}>
            <span className="chip chip-reward">{plan.name}</span>
            <h2>{plan.price}</h2>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {plan.action ? (
              <Button
                variant="primary"
                className="plan-card__action"
                onClick={() => handleSelect(plan.id)}
              >
                {plan.name === 'Crew' ? <BadgeCheck size={17} aria-hidden="true" /> : <CreditCard size={17} aria-hidden="true" />}
                {plan.action}
              </Button>
            ) : (
              <span className="button plan-card__current">현재 데모 기본 플랜</span>
            )}
          </article>
        ))}
      </div>

      <section className="pricing-addons" aria-labelledby="pricing-addons-title">
        <div className="collection-heading compact">
          <div>
            <p className="eyebrow">Reward spend</p>
            <h2 id="pricing-addons-title">가벼운 충전 패키지</h2>
          </div>
        </div>
        <div className="addon-grid">
          {addOnPackages.map((item) => (
            <article key={item.id} className="addon-card" aria-label={item.title}>
              <Ticket size={22} aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <strong>{item.price}</strong>
              <Button variant="secondary" onClick={() => handleSelect(item.id)}>
                {item.action}
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </article>
          ))}
        </div>
      </section>

      {intentResult && (
        <section className="pricing-intent-preview" aria-labelledby="pricing-intent-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Command boundary</p>
              <h2 id="pricing-intent-title">결제 intent preview</h2>
            </div>
          </div>
          {intentResult.ok ? (
            <>
              <span className="chip chip-format">{intentResult.payload.command}</span>
              <p>{intentResult.note}</p>
              <pre>{JSON.stringify(intentResult.payload, null, 2)}</pre>
            </>
          ) : (
            <p role="alert" className="error-copy">
              {intentResult.errors.join(' ')}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

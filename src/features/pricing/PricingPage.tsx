const plans = [
  {
    name: 'Free',
    price: '0원',
    description: '팬이 직접 응원방을 열고 기본 결과 카드를 남기는 데모 플랜',
    features: ['응원방 생성', '투표와 미션', '기본 결과 카드']
  },
  {
    name: 'Plus',
    price: '월 4,900원',
    description: '꾸준히 방을 운영하는 팬을 위한 리워드와 템플릿 확장',
    features: ['추가 결과 카드 테마', 'RP 아이콘 확장', '예약 미션 템플릿']
  },
  {
    name: 'Crew',
    price: '상담 필요',
    description: '향후 공식 계정이나 크리에이터가 aggregate 지표를 보는 확장 플랜',
    features: ['Crew 대시보드', '공식성 검증 플로우', '방 운영 리포트']
  }
] as const;

export function PricingPage() {
  return (
    <div className="pricing-page">
      <section className="dashboard-intro" aria-labelledby="pricing-title">
        <div>
          <p className="eyebrow">Business loop</p>
          <h1 id="pricing-title">요금제</h1>
          <p>
            MVP에서는 결제 흐름을 만들지 않고, 반복 방문과 리워드 확장이 가능한 과금 방향만
            화면으로 보여줘요.
          </p>
        </div>
      </section>

      <div className="plan-grid">
        {plans.map((plan) => (
          <article key={plan.name} className="plan-card">
            <span className="chip chip-reward">{plan.name}</span>
            <h2>{plan.price}</h2>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

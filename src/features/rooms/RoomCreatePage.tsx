import { CheckCircle2, ImagePlus, PlusCircle, Ticket } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';

export function RoomCreatePage() {
  const dashboard = demoReadRepository.getDashboard();

  return (
    <div className="create-studio-page">
      <section className="create-studio-hero" aria-labelledby="room-create-title">
        <div>
          <p className="eyebrow">Create vote room</p>
          <h1 id="room-create-title">새 투표방 열기</h1>
          <p className="guard-copy">
            공식 제휴나 전달 보장을 암시하지 않도록, 투표 주제와 대상은 팬 주도 기록으로만 표현해요.
          </p>
        </div>
        <a className="button button-primary" href="/">
          홈 피드 보기
        </a>
      </section>

      <div className="create-studio-grid">
        <section className="content-panel form-panel" aria-labelledby="basic-info-title">
          <h2 id="basic-info-title">기본 정보</h2>
          <form className="stacked-form">
            <label>
              투표 주제
              <input value="가상 쇼케이스 최고의 오프닝 장면" readOnly />
            </label>
            <label>
              카테고리
              <select defaultValue={dashboard.categories[0]?.id}>
                {dashboard.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              연결 대상
              <select defaultValue={dashboard.targets[0]?.id}>
                {dashboard.targets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.name} · 데모 대상
                  </option>
                ))}
              </select>
            </label>
            <label>
              마감일
              <input value="2026-05-31 23:59" readOnly />
            </label>
          </form>
        </section>

        <section className="content-panel candidate-setup" aria-labelledby="candidate-setup-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Poll options</p>
              <h2 id="candidate-setup-title">투표 항목 구성</h2>
            </div>
            <Ticket size={18} aria-hidden="true" />
          </div>
          <div className="candidate-chip-grid">
            {['첫 장면 스포트라이트', '합창 엔딩 포즈', '커튼콜 실루엣', '원테이크 카메라 워크'].map(
              (candidate) => (
                <span key={candidate}>{candidate}</span>
              )
            )}
          </div>
          <button type="button" className="button button-secondary">
            <PlusCircle size={17} aria-hidden="true" />
            항목 추가 비용: 투표권 1장 또는 120 RP
          </button>
          <p>
            MVP에서는 팬이 항목을 추가하면 검수 대기 상태로 올라가고, 승인 후 후보 리스트에 반영되는
            흐름을 보여줘요.
          </p>
        </section>

        <aside className="live-preview" aria-labelledby="preview-title">
          <div className="preview-media">
            <ImagePlus size={28} aria-hidden="true" />
            <span>OPENING</span>
          </div>
          <div className="preview-card">
            <p className="eyebrow">Preview</p>
            <h2 id="preview-title">방 카드 미리보기</h2>
            <p>후보 랭킹, 참여 미션, 팬월, 항목 추가 비용이 함께 노출되는 투표방으로 생성돼요.</p>
            <ul className="check-list">
              <li>
                <CheckCircle2 size={18} aria-hidden="true" />
                신뢰 필드는 서버 read model에서만 표시
              </li>
              <li>
                <CheckCircle2 size={18} aria-hidden="true" />
                투표/미션/후보 추가는 command API로 확장 예정
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

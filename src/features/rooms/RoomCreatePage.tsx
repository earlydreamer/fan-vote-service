import { CheckCircle2 } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';

export function RoomCreatePage() {
  const dashboard = demoReadRepository.getDashboard();

  return (
    <div className="page-grid create-page">
      <section className="content-panel form-panel" aria-labelledby="room-create-title">
        <p className="eyebrow">Open a room</p>
        <h1 id="room-create-title">새 투표방 열기</h1>
        <p className="guard-copy">
          공식 제휴나 전달 보장을 암시하지 않도록, 투표 주제와 대상은 팬 주도 기록으로만 표현해요.
        </p>

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

      <aside className="content-panel live-preview" aria-labelledby="preview-title">
        <p className="eyebrow">Preview</p>
        <h2 id="preview-title">방 카드 미리보기</h2>
        <div className="preview-card">
          <span className="chip chip-energy">D-2</span>
          <h3>은하 무대 오프닝 투표방</h3>
          <p>후보 랭킹, 참여 미션, 팬월을 함께 운영하는 투표방으로 생성돼요.</p>
          <ul className="check-list">
            <li>
              <CheckCircle2 size={18} aria-hidden="true" />
              신뢰 필드는 서버 read model에서만 표시
            </li>
            <li>
              <CheckCircle2 size={18} aria-hidden="true" />
              투표/미션은 command API로 확장 예정
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

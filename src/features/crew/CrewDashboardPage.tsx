import { BarChart3 } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { buildCrewDashboardViewModel } from './crewStatsReadModel';
import { CrewStatsCards } from './CrewStatsCards';

export function CrewDashboardPage() {
  const crewStats = demoReadRepository.getCrewStats();
  const categories = demoReadRepository.getDashboard().categories;
  const crewDashboard = buildCrewDashboardViewModel(crewStats, categories);

  return (
    <div className="crew-page">
      <section className="ops-hero" aria-labelledby="crew-title">
        <div>
          <p className="eyebrow">운영자 화면</p>
          <h1 id="crew-title">Crew 대시보드</h1>
          <p>공식 계정이나 크리에이터 확장 시 계정 상태와 작업 내역을 한눈에 확인하는 화면이에요.</p>
        </div>
        <BarChart3 size={32} aria-hidden="true" />
      </section>

      <CrewStatsCards viewModel={crewDashboard} />
    </div>
  );
}

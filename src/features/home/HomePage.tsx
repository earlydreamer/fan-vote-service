import { useState } from 'react';
import { Flame, PlusCircle, Sparkles, Ticket, Trophy } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import type { DiscoverySort, RallyRoom } from '../../shared/types/rallyroom';
import { ProgressMeter } from '../../shared/ui/ProgressMeter';
import { RoomCard } from '../../shared/ui/RoomCard';

const sortOptions: Array<{ id: DiscoverySort; label: string }> = [
  { id: 'popular', label: '인기순' },
  { id: 'endingSoon', label: '마감순' },
  { id: 'newest', label: '최신순' },
  { id: 'results', label: '결과순' }
];

export function HomePage() {
  const dashboard = demoReadRepository.getDashboard();
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [sort, setSort] = useState<DiscoverySort>('popular');
  const sortedRooms = demoReadRepository.getDiscoveryRooms(sort);
  const visibleRooms = sortedRooms.filter(
    (room) => selectedCategoryId === 'all' || room.categoryId === selectedCategoryId
  );
  const featuredRoom = dashboard.featuredRooms[0] ?? dashboard.allRooms[0];
  const secondaryFeaturedRooms = dashboard.featuredRooms.slice(1, 4);
  const totalVotes = dashboard.allRooms.reduce(
    (sum, room) => sum + room.candidates.reduce((roomSum, candidate) => roomSum + candidate.voteCount, 0),
    0
  );

  return (
    <div className="home-discovery">
      <section className="top-signal-strip" aria-label="오늘의 활동 요약">
        <span>
          <Flame size={16} aria-hidden="true" />
          Live {dashboard.activeRooms.length}
        </span>
        <span>{totalVotes.toLocaleString()}표 누적</span>
        <span>보유 투표권 {dashboard.profile.voteTickets}장</span>
        <span>{dashboard.profile.weeklyRp.toLocaleString()} RP 이번 주 획득</span>
      </section>

      <section className="featured-stage" aria-label="Featured 투표">
        <div className="featured-copy">
          <p className="eyebrow">Fan Vote Discovery</p>
          <h1 id="home-title">지금 뜨는 팬 투표</h1>
          <p>
            팬이 직접 주제를 열고 후보를 더하며, 투표권과 RP를 다시 참여 행동으로 쓰는 인기투표
            보드예요.
          </p>
          <div className="featured-actions">
            <a className="button button-primary" href={`/rooms/${featuredRoom.id}`}>
              지금 투표하기
            </a>
            <a className="button button-secondary" href="/rooms/new">
              <PlusCircle size={18} aria-hidden="true" />
              투표방 만들기
            </a>
          </div>
        </div>

        <FeaturedVote room={featuredRoom} />

        <div className="featured-stack" aria-label="함께 뜨는 투표">
          {secondaryFeaturedRooms.map((room) => (
            <a key={room.id} href={`/rooms/${room.id}`} className="featured-mini">
              <span>{room.featuredLabel ?? 'Featured'}</span>
              <strong>{room.title}</strong>
              <em>{room.participantCount.toLocaleString()}명 참여</em>
            </a>
          ))}
        </div>
      </section>

      <nav className="category-filter" aria-label="카테고리 탐색">
        <button type="button" aria-pressed={selectedCategoryId === 'all'} onClick={() => setSelectedCategoryId('all')}>
          전체
          <span aria-hidden="true">{dashboard.allRooms.length}</span>
        </button>
        {dashboard.categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={selectedCategoryId === category.id}
            onClick={() => setSelectedCategoryId(category.id)}
          >
            {category.name}
            <span aria-hidden="true">
              {dashboard.allRooms.filter((room) => room.categoryId === category.id).length}
            </span>
          </button>
        ))}
      </nav>

      <section className="content-collection" aria-labelledby="gallery-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">Vote gallery</p>
            <h2 id="gallery-title">인기 투표 갤러리</h2>
          </div>
          <div className="sort-tabs" aria-label="투표 정렬">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={sort === option.id}
                onClick={() => setSort(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="vote-card-grid">
          {visibleRooms.map((room) => (
            <RoomCard key={room.id} room={room} category={demoReadRepository.getCategory(room.categoryId)} />
          ))}
        </div>
      </section>

      <div className="content-shelf-grid">
        <section className="content-shelf" aria-labelledby="ending-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">D-day</p>
              <h2 id="ending-title">마감 임박 투표</h2>
            </div>
            <Ticket size={18} aria-hidden="true" />
          </div>
          <div className="horizontal-card-row">
            {dashboard.expiringRooms.slice(0, 5).map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                category={demoReadRepository.getCategory(room.categoryId)}
                compact
              />
            ))}
          </div>
        </section>

        <section className="content-shelf" aria-labelledby="result-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Result cards</p>
              <h2 id="result-title">최근 결과 카드</h2>
            </div>
            <Trophy size={18} aria-hidden="true" />
          </div>
          <div className="result-strip">
            {dashboard.resultRooms.slice(0, 6).map((room) => (
              <a key={room.id} href={`/rooms/${room.id}/result`} className="result-tile">
                <span>{demoReadRepository.getCategory(room.categoryId)?.name ?? '결과'}</span>
                <strong>{room.title}</strong>
                <em>{room.resultCard.earnedIcon}</em>
              </a>
            ))}
          </div>
        </section>

        <section className="content-shelf mission-shelf" aria-labelledby="mission-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Reward loop</p>
              <h2 id="mission-title">오늘의 참여 미션</h2>
            </div>
            <Sparkles size={18} aria-hidden="true" />
          </div>
          <div className="mission-card-grid">
            {dashboard.todayMissions.slice(0, 6).map((mission) => (
              <article key={mission.id} className="mission-card">
                <span className="chip chip-mission">{mission.roomTitle}</span>
                <h3>{mission.title}</h3>
                <p>
                  +{mission.rewardRp} RP · Energy +{mission.rewardEnergy}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function FeaturedVote({ room }: { room: RallyRoom }) {
  const category = demoReadRepository.getCategory(room.categoryId);
  const leader = [...room.candidates].sort((left, right) => right.voteCount - left.voteCount)[0];
  const voteCount = room.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

  return (
    <article className="featured-vote-card" aria-label={`${room.title} Featured 카드`}>
      <div className="featured-vote-card__media">
        <span>{room.featuredLabel ?? 'Featured'}</span>
        <strong>{room.thumbnail.label}</strong>
      </div>
      <div className="featured-vote-card__body">
        <div className="room-card__meta">
          <span className="chip">{category?.name ?? '투표방'}</span>
          <span className="chip chip-energy">{room.candidates.length}개 항목</span>
        </div>
        <h2>{room.title}</h2>
        <p>{room.topic}</p>
        <ProgressMeter label="Vote Energy" value={room.currentGoalValue} max={room.goalValue} />
        <div className="featured-vote-card__stats">
          <span>
            <strong>{leader?.title ?? '집계 중'}</strong>
            현재 1위
          </span>
          <span>
            <strong>{voteCount.toLocaleString()}</strong>
            누적 표
          </span>
          <span>
            <strong>{room.participantCount.toLocaleString()}</strong>
            참여자
          </span>
        </div>
      </div>
    </article>
  );
}

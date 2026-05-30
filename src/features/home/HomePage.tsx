import { useState } from 'react';
import { PlusCircle, Sparkles, Ticket, Trophy, Zap } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { getVoteTitle } from '../../shared/domain/roomDisplay';
import type { DiscoverySort, RallyRoom } from '../../shared/types/rallyroom';
import { ProgressMeter } from '../../shared/ui/ProgressMeter';
import { RoomCard } from '../../shared/ui/RoomCard';
import { RoomThumbnail } from '../../shared/ui/RoomThumbnail';
import { Button } from '../../shared/ui/Button';

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
  const secondaryFeaturedRooms = dashboard.featuredRooms.slice(1, 3);
  const totalVotes = dashboard.allRooms.reduce(
    (sum, room) => sum + room.candidates.reduce((roomSum, candidate) => roomSum + candidate.voteCount, 0),
    0
  );

  return (
    <div className="home-discovery">
      <section className="featured-stage" aria-label="Featured 투표">
        <div className="featured-copy">
          <div className="hero-pill">
            <Zap size={17} aria-hidden="true" />
            팬이 만드는 투표의 공간
          </div>
          <h1 id="home-title">
            지금 뜨는 <span>팬 투표</span>를 직접 만들어보세요
          </h1>
          <p>
            좋아하는 작품, 캐릭터, 장면을 팬이 직접 투표방으로 만들고 후보를 더해요. 투표권과 RP는
            다시 항목 추가와 결과 카드로 이어집니다.
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
          <div className="hero-stats" aria-label="오늘의 활동 요약">
            <span>
              <strong>{dashboard.activeRooms.length}</strong>
              Live
            </span>
            <span>
              <strong>{totalVotes.toLocaleString()}</strong>
              누적 표
            </span>
            <span>
              <strong>{dashboard.profile.voteTickets}장</strong>
              보유 투표권
            </span>
          </div>
        </div>

        <div className="hero-art-card">
          <img
            src="https://cdn.vibe-x.app/apps/871a45296be42693e004065f/assets/original/hero-1-55890d0c-0afe-481f-9557-eb2b3b35af2f.png"
            alt="PickRally 팬 투표 커뮤니티"
          />
        </div>
      </section>

      <section className="featured-strip" aria-label="함께 뜨는 투표">
        <FeaturedVote room={featuredRoom} />
        {secondaryFeaturedRooms.map((room) => (
          <a key={room.id} href={`/rooms/${room.id}`} className="featured-mini">
            <span>{room.featuredLabel ?? 'Featured'}</span>
            <strong>{getVoteTitle(room)}</strong>
            <em>투표방 · {room.title}</em>
            <small>{room.participantCount.toLocaleString()}명 참여</small>
          </a>
        ))}
      </section>

      <nav className="category-filter" aria-label="카테고리 탐색">
        <Button variant="unstyled" aria-pressed={selectedCategoryId === 'all'} onClick={() => setSelectedCategoryId('all')}>
          전체
          <span aria-hidden="true">{dashboard.allRooms.length}</span>
        </Button>
        {dashboard.categories.map((category) => (
          <Button
            key={category.id}
            variant="unstyled"
            aria-pressed={selectedCategoryId === category.id}
            onClick={() => setSelectedCategoryId(category.id)}
          >
            {category.name}
            <span aria-hidden="true">
              {dashboard.allRooms.filter((room) => room.categoryId === category.id).length}
            </span>
          </Button>
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
              <Button
                key={option.id}
                variant="unstyled"
                aria-pressed={sort === option.id}
                onClick={() => setSort(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="vote-card-grid vote-card-grid--wide">
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
  const voteTitle = getVoteTitle(room);

  return (
    <article className="featured-vote-card" aria-label={`${voteTitle} Featured 카드`}>
      <RoomThumbnail
        room={room}
        categoryName={category?.name}
        href={`/rooms/${room.id}`}
        className="featured-vote-card__media"
      />
      <div className="featured-vote-card__body">
        <div className="room-card__meta">
          <span className="chip">{category?.name ?? '투표방'}</span>
          <span className="chip chip-energy">{room.candidates.length}개 항목</span>
        </div>
        <span className="room-card__room-name">투표방 · {room.title}</span>
        <h2>{voteTitle}</h2>
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

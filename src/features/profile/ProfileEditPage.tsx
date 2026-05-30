import React, { useState } from 'react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { Button } from '../../shared/ui/Button';
import { UserRound } from 'lucide-react';

export function ProfileEditPage() {
  const profile = demoReadRepository.getProfile();
  const dashboard = demoReadRepository.getDashboard();

  const [nickname, setNickname] = useState(profile.nickname || '팬 PickRally');
  const [followedCategoryIds, setFollowedCategoryIds] = useState<string[]>(profile.followedCategoryIds);

  const handleCategoryToggle = (categoryId: string) => {
    setFollowedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    demoReadRepository.updateProfile({
      nickname,
      followedCategoryIds
    });
    
    // SPA 라우팅 이동
    window.history.pushState(null, '', '/profile');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="profile-edit-page">
      <section className="profile-hero" aria-labelledby="profile-edit-title">
        <div className="profile-avatar" aria-hidden="true">
          <UserRound size={24} />
        </div>
        <div>
          <p className="eyebrow">Settings</p>
          <h1 id="profile-edit-title">프로필 수정</h1>
          <p>닉네임과 관심 카테고리를 수정해 나만의 투표 루프를 완성해보세요.</p>
        </div>
      </section>

      <section className="content-panel" aria-labelledby="form-heading">
        <h2 id="form-heading" className="sr-only">프로필 설정 폼</h2>
        <form className="stacked-form" onSubmit={handleSave}>
          <div className="form-section">
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요"
              required
            />

            <fieldset className="categories-fieldset">
              <legend>관심 카테고리</legend>
              <div className="categories-checkbox-grid">
                {dashboard.categories.map((category) => (
                  <label key={category.id} className="category-checkbox-label">
                    <input
                      type="checkbox"
                      checked={followedCategoryIds.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary">
              저장하기
            </Button>
            <a className="button button-secondary" href="/profile">
              취소
            </a>
          </div>
        </form>
      </section>
    </div>
  );
}

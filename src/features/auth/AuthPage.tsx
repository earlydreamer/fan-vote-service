import { Button } from '../../shared/ui/Button';

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <div className="auth-card">
        <p className="eyebrow">Member preview</p>
        <h1 id="auth-title">회원가입</h1>
        <p>데모 계정으로 로그인하면 투표권, 팬월 작성, 후보 중간 추가, 내 활동 화면을 바로 확인할 수 있어요.</p>

        <div className="auth-card__actions">
          <Button onClick={onLogin}>
            데모 계정으로 시작하기
          </Button>
          <a className="button button-secondary" href="/">
            홈 피드 둘러보기
          </a>
        </div>
      </div>
    </section>
  );
}
